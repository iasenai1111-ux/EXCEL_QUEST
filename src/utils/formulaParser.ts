import { CellData, StageDefinition, StageQuestion } from '../types/game';

export interface ParseResult {
  success: boolean;
  value?: number;
  error?: string;
  astDetails?: string;
}

export interface ValidationResult {
  isValid: boolean;
  calculatedValue?: number;
  message: string;
  hintLevelToOffer?: number;
}

/**
 * Token types for safe arithmetic evaluation
 */
type TokenType = 'NUMBER' | 'OP' | 'LPAREN' | 'RPAREN' | 'EOF';

interface Token {
  type: TokenType;
  value: string | number;
}

/**
 * Lexer for mathematical expressions
 */
function tokenize(expr: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const clean = expr.trim();

  while (i < clean.length) {
    const char = clean[i];

    if (/\s/.test(char)) {
      i++;
      continue;
    }

    if (/[0-9.]/.test(char)) {
      let numStr = '';
      while (i < clean.length && /[0-9.]/.test(clean[i])) {
        numStr += clean[i];
        i++;
      }
      // Check for trailing %
      if (i < clean.length && clean[i] === '%') {
        tokens.push({ type: 'NUMBER', value: parseFloat(numStr) / 100 });
        i++;
      } else {
        tokens.push({ type: 'NUMBER', value: parseFloat(numStr) });
      }
      continue;
    }

    if (char === '+' || char === '-' || char === '*' || char === '/') {
      tokens.push({ type: 'OP', value: char });
      i++;
      continue;
    }

    if (char === '(') {
      tokens.push({ type: 'LPAREN', value: '(' });
      i++;
      continue;
    }

    if (char === ')') {
      tokens.push({ type: 'RPAREN', value: ')' });
      i++;
      continue;
    }

    if (char === '%') {
      tokens.push({ type: 'OP', value: '%' });
      i++;
      continue;
    }

    throw new Error(`Caractere desconhecido na fórmula: ${char}`);
  }

  tokens.push({ type: 'EOF', value: '' });
  return tokens;
}

/**
 * Recursive descent safe mathematical parser
 * Precedence:
 * - Primary: Number, ( expr )
 * - Multiplicative: *, /
 * - Additive: +, -
 */
class ExpressionParser {
  private tokens: Token[];
  private current: number = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  private peek(): Token {
    return this.tokens[this.current];
  }

  private consume(expected?: TokenType): Token {
    const token = this.tokens[this.current];
    if (expected && token.type !== expected) {
      throw new Error(`Esperado ${expected}, mas encontrou ${token.type}`);
    }
    this.current++;
    return token;
  }

  public parse(): number {
    const result = this.parseAdditive();
    if (this.peek().type !== 'EOF') {
      throw new Error('Sintaxe incompleta ou tokens extras no final.');
    }
    return result;
  }

  private parseAdditive(): number {
    let left = this.parseMultiplicative();

    while (this.peek().type === 'OP' && (this.peek().value === '+' || this.peek().value === '-')) {
      const op = this.consume().value;
      const right = this.parseMultiplicative();
      if (op === '+') {
        left += right;
      } else {
        left -= right;
      }
    }
    return left;
  }

  private parseMultiplicative(): number {
    let left = this.parseUnary();

    while (this.peek().type === 'OP' && (this.peek().value === '*' || this.peek().value === '/')) {
      const op = this.consume().value;
      const right = this.parseUnary();
      if (op === '*') {
        left *= right;
      } else {
        if (right === 0) {
          throw new Error('Divisão por zero (#DIV/0!)');
        }
        left /= right;
      }
    }
    return left;
  }

  private parseUnary(): number {
    if (this.peek().type === 'OP' && this.peek().value === '-') {
      this.consume();
      return -this.parseUnary();
    }
    if (this.peek().type === 'OP' && this.peek().value === '+') {
      this.consume();
      return this.parseUnary();
    }
    return this.parsePrimary();
  }

  private parsePrimary(): number {
    const token = this.peek();

    if (token.type === 'NUMBER') {
      this.consume();
      let val = Number(token.value);
      // check if followed by % operator
      if (this.peek().type === 'OP' && this.peek().value === '%') {
        this.consume();
        val = val / 100;
      }
      return val;
    }

    if (token.type === 'LPAREN') {
      this.consume('LPAREN');
      const val = this.parseAdditive();
      this.consume('RPAREN');
      return val;
    }

    throw new Error('Valor ou parêntese esperado.');
  }
}

/**
 * Expand cell ranges like B2:D2 to ['B2', 'C2', 'D2']
 */
function expandRange(startCell: string, endCell: string): string[] {
  const colStart = startCell.charAt(0).toUpperCase();
  const rowStart = parseInt(startCell.slice(1), 10);
  const colEnd = endCell.charAt(0).toUpperCase();
  const rowEnd = parseInt(endCell.slice(1), 10);

  const startColCode = colStart.charCodeAt(0);
  const endColCode = colEnd.charCodeAt(0);

  const minCol = Math.min(startColCode, endColCode);
  const maxCol = Math.max(startColCode, endColCode);
  const minRow = Math.min(rowStart, rowEnd);
  const maxRow = Math.max(rowStart, rowEnd);

  const list: string[] = [];
  for (let r = minRow; r <= maxRow; r++) {
    for (let c = minCol; c <= maxCol; c++) {
      list.push(`${String.fromCharCode(c)}${r}`);
    }
  }
  return list;
}

/**
 * Extracts numeric value from a cell data object
 */
function getCellNumericValue(cell: CellData | undefined): number {
  if (!cell) return 0;
  if (typeof cell.value === 'number') return cell.value;
  const num = parseFloat(String(cell.value).replace(/[^\d.-]/g, ''));
  return isNaN(num) ? 0 : num;
}

/**
 * Safe evaluation of Excel formula string without eval()
 */
export function evaluateFormula(formula: string, cells: Record<string, CellData>): ParseResult {
  let clean = formula.trim();
  if (!clean.startsWith('=')) {
    return {
      success: false,
      error: 'Toda fórmula no Excel deve começar com o sinal de igual (=)'
    };
  }

  // Remove leading '='
  clean = clean.substring(1).trim();
  if (!clean) {
    return { success: false, error: 'Digite uma expressão após o =' };
  }

  try {
    // Normalization of uppercase function names and Portuguese / English variants
    let expr = clean.toUpperCase();

    // 1. Process SOMA / SUM functions: e.g. SOMA(B2:C2) or SOMA(B2; C2) or SOMA(B2, C2)
    expr = expr.replace(/(SOMA|SUM)\s*\(([^)]+)\)/g, (_, _fn, argsStr) => {
      const parts = argsStr.split(/[;,]/).map((s: string) => s.trim());
      const values: number[] = [];

      parts.forEach((part: string) => {
        if (part.includes(':')) {
          const [start, end] = part.split(':').map((s: string) => s.trim());
          const expanded = expandRange(start, end);
          expanded.forEach(c => values.push(getCellNumericValue(cells[c])));
        } else if (/^[A-Z][0-9]+$/.test(part)) {
          values.push(getCellNumericValue(cells[part]));
        } else {
          const direct = parseFloat(part);
          if (!isNaN(direct)) values.push(direct);
        }
      });

      const sum = values.reduce((acc, curr) => acc + curr, 0);
      return String(sum);
    });

    // 2. Process MÉDIA / MEDIA / AVERAGE functions: e.g. MÉDIA(B2:D2)
    expr = expr.replace(/(MÉDIA|MEDIA|AVERAGE)\s*\(([^)]+)\)/g, (_, _fn, argsStr) => {
      const parts = argsStr.split(/[;,]/).map((s: string) => s.trim());
      const values: number[] = [];

      parts.forEach((part: string) => {
        if (part.includes(':')) {
          const [start, end] = part.split(':').map((s: string) => s.trim());
          const expanded = expandRange(start, end);
          expanded.forEach(c => values.push(getCellNumericValue(cells[c])));
        } else if (/^[A-Z][0-9]+$/.test(part)) {
          values.push(getCellNumericValue(cells[part]));
        } else {
          const direct = parseFloat(part);
          if (!isNaN(direct)) values.push(direct);
        }
      });

      if (values.length === 0) return '0';
      const avg = values.reduce((acc, curr) => acc + curr, 0) / values.length;
      return String(avg);
    });

    // 3. Process MÁXIMO / MAXIMO / MAX functions: e.g. MÁXIMO(B2:D2)
    expr = expr.replace(/(MÁXIMO|MAXIMO|MAX)\s*\(([^)]+)\)/g, (_, _fn, argsStr) => {
      const parts = argsStr.split(/[;,]/).map((s: string) => s.trim());
      const values: number[] = [];

      parts.forEach((part: string) => {
        if (part.includes(':')) {
          const [start, end] = part.split(':').map((s: string) => s.trim());
          const expanded = expandRange(start, end);
          expanded.forEach(c => values.push(getCellNumericValue(cells[c])));
        } else if (/^[A-Z][0-9]+$/.test(part)) {
          values.push(getCellNumericValue(cells[part]));
        } else {
          const direct = parseFloat(part);
          if (!isNaN(direct)) values.push(direct);
        }
      });

      if (values.length === 0) return '0';
      return String(Math.max(...values));
    });

    // 4. Process MÍNIMO / MINIMO / MIN functions: e.g. MÍNIMO(B2:D2)
    expr = expr.replace(/(MÍNIMO|MINIMO|MIN)\s*\(([^)]+)\)/g, (_, _fn, argsStr) => {
      const parts = argsStr.split(/[;,]/).map((s: string) => s.trim());
      const values: number[] = [];

      parts.forEach((part: string) => {
        if (part.includes(':')) {
          const [start, end] = part.split(':').map((s: string) => s.trim());
          const expanded = expandRange(start, end);
          expanded.forEach(c => values.push(getCellNumericValue(cells[c])));
        } else if (/^[A-Z][0-9]+$/.test(part)) {
          values.push(getCellNumericValue(cells[part]));
        } else {
          const direct = parseFloat(part);
          if (!isNaN(direct)) values.push(direct);
        }
      });

      if (values.length === 0) return '0';
      return String(Math.min(...values));
    });

    // 5. Process CONT.SE / COUNTIF: e.g. CONT.SE(B2:D2; ">=50") or CONT.SE(B2:D2; 10)
    expr = expr.replace(/(CONT\.SE|COUNTIF)\s*\(([^;]+)[;,]([^)]+)\)/g, (_, _fn, rangeStr, criteriaStr) => {
      const range = rangeStr.trim();
      const crit = criteriaStr.trim().replace(/^["']|["']$/g, '');
      const cellsToCheck = range.includes(':')
        ? expandRange(range.split(':')[0].trim(), range.split(':')[1].trim())
        : [range];

      let count = 0;
      cellsToCheck.forEach(c => {
        const val = getCellNumericValue(cells[c]);
        if (crit.startsWith('>=')) {
          if (val >= parseFloat(crit.slice(2))) count++;
        } else if (crit.startsWith('<=')) {
          if (val <= parseFloat(crit.slice(2))) count++;
        } else if (crit.startsWith('>')) {
          if (val > parseFloat(crit.slice(1))) count++;
        } else if (crit.startsWith('<')) {
          if (val < parseFloat(crit.slice(1))) count++;
        } else if (crit.startsWith('=')) {
          if (val === parseFloat(crit.slice(1))) count++;
        } else {
          if (val === parseFloat(crit)) count++;
        }
      });
      return String(count);
    });

    // 6. Process SE / IF: e.g. SE(B2>=50; 100; 0)
    expr = expr.replace(/(SE|IF)\s*\(([^;]+)[;,]([^;]+)[;,]([^)]+)\)/g, (_, _fn, conditionStr, trueValStr, falseValStr) => {
      let cond = conditionStr.trim();
      // Replace cell in condition
      cond = cond.replace(/\b([A-Z][0-9]+)\b/g, (match: string) => {
        return String(getCellNumericValue(cells[match]));
      });

      let isConditionTrue = false;
      if (cond.includes('>=')) {
        const [left, right] = cond.split('>=').map((s: string) => parseFloat(s.trim()));
        isConditionTrue = left >= right;
      } else if (cond.includes('<=')) {
        const [left, right] = cond.split('<=').map((s: string) => parseFloat(s.trim()));
        isConditionTrue = left <= right;
      } else if (cond.includes('>')) {
        const [left, right] = cond.split('>').map((s: string) => parseFloat(s.trim()));
        isConditionTrue = left > right;
      } else if (cond.includes('<')) {
        const [left, right] = cond.split('<').map((s: string) => parseFloat(s.trim()));
        isConditionTrue = left < right;
      } else if (cond.includes('=')) {
        const [left, right] = cond.split('=').map((s: string) => parseFloat(s.trim()));
        isConditionTrue = left === right;
      }

      return isConditionTrue ? trueValStr.trim() : falseValStr.trim();
    });

    // 3. Replace standalone cell references (e.g. B2, C2, D2) with their numeric values
    // Using word boundaries to avoid replacing parts of identifiers
    expr = expr.replace(/\b([A-Z][0-9]+)\b/g, (match, cellRef) => {
      const cell = cells[cellRef];
      if (!cell) return '0';
      return String(getCellNumericValue(cell));
    });

    // 4. Tokenize and evaluate safely with ExpressionParser
    const tokens = tokenize(expr);
    const parser = new ExpressionParser(tokens);
    const result = parser.parse();

    return {
      success: true,
      value: Math.round(result * 1000) / 1000
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erro ao calcular fórmula';
    return {
      success: false,
      error: msg
    };
  }
}

/**
 * Validates a user's entered formula against the stage requirements.
 * Accepts equivalent valid Excel formulas.
 */
export function validateStageChallenge(
  rawFormula: string,
  stage: StageDefinition,
  question?: StageQuestion,
  currentCells?: Record<string, CellData>
): ValidationResult {
  const trimmed = rawFormula.trim();

  if (!trimmed.startsWith('=')) {
    return {
      isValid: false,
      message: 'Atenção: No Excel, toda fórmula DEVE começar com o caractere "=" (igual)!',
      hintLevelToOffer: 1
    };
  }

  const cellsToUse = currentCells || stage.grid.cells;
  const evalResult = evaluateFormula(trimmed, cellsToUse);

  if (!evalResult.success || evalResult.value === undefined) {
    return {
      isValid: false,
      message: evalResult.error || 'Fórmula com sintaxe incorreta. Verifique parênteses e operadores.',
      hintLevelToOffer: 1
    };
  }

  const calculated = evalResult.value;
  const expected = question ? question.expectedValue : stage.challenge.expectedValue;
  const requiredCells = question ? question.requiredCells : stage.challenge.requiredCells;
  const isValueMatch = Math.abs(calculated - expected) < 0.05;

  if (!isValueMatch) {
    return {
      isValid: false,
      calculatedValue: calculated,
      message: `O resultado obtido foi ${calculated}, mas o esperado para esta questão é ${expected}. Tente novamente!`,
      hintLevelToOffer: 1
    };
  }

  // Educational check: did they use cell references or at least proper Excel mechanics?
  const upper = trimmed.toUpperCase();
  const hasCellRefs = requiredCells.some(cell => upper.includes(cell));

  // If they just typed "=200" or raw numbers without cell references, we can gently guide them
  // or allow it with a bonus tip, but let's encourage cell references
  const containsRawResultOnly = trimmed.replace(/\s+/g, '') === `=${expected}`;
  if (containsRawResultOnly) {
    return {
      isValid: false,
      calculatedValue: calculated,
      message: `Você digitou apenas o número final! O poder do Excel vem de referenciar as células (ex: =${requiredCells.join(' + ')}).`,
      hintLevelToOffer: 2
    };
  }

  return {
    isValid: true,
    calculatedValue: calculated,
    message: 'MISSÃO CONCLUÍDA! Fórmula perfeita e resultado calculado com sucesso!',
    hintLevelToOffer: 0
  };
}
