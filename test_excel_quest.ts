import { LEVEL_1_STAGES } from './src/data/stages';
import { evaluateFormula, validateStageChallenge } from './src/utils/formulaParser';
import { generateExportSaveCode, parseImportSaveCode } from './src/utils/storage';
import { generateStudentWorkbook } from './src/utils/xlsxGenerator';
import { getStageSheetSpecs } from './src/sheets';
import { checkAABBCollision, calculateDistance } from './src/engine';

console.log('=== INICIANDO TESTES DO EXCEL QUEST 2.1 ===\n');

let failedTests = 0;

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FALHA: ${message}`);
    failedTests++;
  } else {
    console.log(`✅ SUCESSO: ${message}`);
  }
}

// 1. Test Stage 1: Mercado das Somas (120 + 80 = 200)
const stage1 = LEVEL_1_STAGES[0];
const res1a = evaluateFormula('=B2+C2', stage1.grid.cells);
assert(res1a.success && res1a.value === 200, 'Fase 1: =B2+C2 resulta em 200');

const res1b = evaluateFormula('=SOMA(B2:C2)', stage1.grid.cells);
assert(res1b.success && res1b.value === 200, 'Fase 1: =SOMA(B2:C2) resulta em 200');

const res1c = evaluateFormula('=SOMA(B2;C2)', stage1.grid.cells);
assert(res1c.success && res1c.value === 200, 'Fase 1: =SOMA(B2;C2) resulta em 200');

const val1 = validateStageChallenge('=B2+C2', stage1);
assert(val1.isValid && val1.calculatedValue === 200, 'Fase 1: Validação aceita fórmula =B2+C2');

// 2. Test Stage 2: Depósito Perdido (19 - 7 = 12)
const stage2 = LEVEL_1_STAGES[1];
const res2 = evaluateFormula('=B2-C2', stage2.grid.cells);
assert(res2.success && res2.value === 12, 'Fase 2: =B2-C2 resulta em 12');

const val2 = validateStageChallenge('=B2-C2', stage2);
assert(val2.isValid && val2.calculatedValue === 12, 'Fase 2: Validação aceita fórmula =B2-C2');

// 3. Test Stage 3: Fábrica de Controles (6 * 45 = 270)
const stage3 = LEVEL_1_STAGES[2];
const res3a = evaluateFormula('=B2*C2', stage3.grid.cells);
assert(res3a.success && res3a.value === 270, 'Fase 3: =B2*C2 resulta em 270');

const res3b = evaluateFormula('=C2*B2', stage3.grid.cells);
assert(res3b.success && res3b.value === 270, 'Fase 3: =C2*B2 resulta em 270');

const val3 = validateStageChallenge('=B2*C2', stage3);
assert(val3.isValid && val3.calculatedValue === 270, 'Fase 3: Validação aceita fórmula =B2*C2');

// 4. Test Stage 4: Arena das Médias (Média de 6, 8 e 10 = 8)
const stage4 = LEVEL_1_STAGES[3];
const res4a = evaluateFormula('=MÉDIA(B2:D2)', stage4.grid.cells);
assert(res4a.success && res4a.value === 8, 'Fase 4: =MÉDIA(B2:D2) resulta em 8');

const res4b = evaluateFormula('=MEDIA(B2:D2)', stage4.grid.cells);
assert(res4b.success && res4b.value === 8, 'Fase 4: =MEDIA(B2:D2) sem acento resulta em 8');

const res4c = evaluateFormula('=(B2+C2+D2)/3', stage4.grid.cells);
assert(res4c.success && res4c.value === 8, 'Fase 4: =(B2+C2+D2)/3 resulta em 8');

const val4 = validateStageChallenge('=MÉDIA(B2:D2)', stage4);
assert(val4.isValid && val4.calculatedValue === 8, 'Fase 4: Validação aceita fórmula =MÉDIA(B2:D2)');

// 5. Test Stage 5: Chefão dos Descontos (R$ 200 com 15% de desconto = 170)
const stage5 = LEVEL_1_STAGES[4];
const res5a = evaluateFormula('=B2-(B2*C2)', stage5.grid.cells);
assert(res5a.success && res5a.value === 170, 'Fase 5: =B2-(B2*C2) resulta em 170');

const res5b = evaluateFormula('=B2*(1-C2)', stage5.grid.cells);
assert(res5b.success && res5b.value === 170, 'Fase 5: =B2*(1-C2) resulta em 170');

const val5 = validateStageChallenge('=B2-(B2*C2)', stage5);
assert(val5.isValid && val5.calculatedValue === 170, 'Fase 5: Validação aceita fórmula =B2-(B2*C2)');

// 6. Test Stage 6: Inspeção Condicional (=SE(B2>=50; 100; 0) = 100)
const stage6 = LEVEL_1_STAGES[5];
const res6 = evaluateFormula('=SE(B2>=50; 100; 0)', stage6.grid.cells);
assert(res6.success && res6.value === 100, 'Fase 6: =SE(B2>=50; 100; 0) resulta em 100');
const val6 = validateStageChallenge('=SE(B2>=50; 100; 0)', stage6);
assert(val6.isValid && val6.calculatedValue === 100, 'Fase 6: Validação aceita fórmula =SE(B2>=50; 100; 0)');

// 7. Test Stage 7: Usina Elétrica (=MÁXIMO(B2:D2) = 3200)
const stage7 = LEVEL_1_STAGES[6];
const res7 = evaluateFormula('=MÁXIMO(B2:D2)', stage7.grid.cells);
assert(res7.success && res7.value === 3200, 'Fase 7: =MÁXIMO(B2:D2) resulta em 3200');
const val7 = validateStageChallenge('=MÁXIMO(B2:D2)', stage7);
assert(val7.isValid && val7.calculatedValue === 3200, 'Fase 7: Validação aceita fórmula =MÁXIMO(B2:D2)');

// 8. Test Stage 8: Lab de Tolerâncias (=MÍNIMO(B2:D2) = 9)
const stage8 = LEVEL_1_STAGES[7];
const res8 = evaluateFormula('=MÍNIMO(B2:D2)', stage8.grid.cells);
assert(res8.success && res8.value === 9, 'Fase 8: =MÍNIMO(B2:D2) resulta em 9');
const val8 = validateStageChallenge('=MÍNIMO(B2:D2)', stage8);
assert(val8.isValid && val8.calculatedValue === 9, 'Fase 8: Validação aceita fórmula =MÍNIMO(B2:D2)');

// 9. Test Stage 9: Almoxarifado de Sensores (=CONT.SE(B2:D2; ">=50") = 2)
const stage9 = LEVEL_1_STAGES[8];
const res9 = evaluateFormula('=CONT.SE(B2:D2; ">=50")', stage9.grid.cells);
assert(res9.success && res9.value === 2, 'Fase 9: =CONT.SE(B2:D2; ">=50") resulta em 2');
const val9 = validateStageChallenge('=CONT.SE(B2:D2; ">=50")', stage9);
assert(val9.isValid && val9.calculatedValue === 2, 'Fase 9: Validação aceita fórmula =CONT.SE(B2:D2; ">=50")');

// 10. Test Stage 10: Supercomputador Central (=(B2+C2)/D2 = 250)
const stage10 = LEVEL_1_STAGES[9];
const res10 = evaluateFormula('=(B2+C2)/D2', stage10.grid.cells);
assert(res10.success && res10.value === 250, 'Fase 10: =(B2+C2)/D2 resulta em 250');
const val10 = validateStageChallenge('=(B2+C2)/D2', stage10);
assert(val10.isValid && val10.calculatedValue === 250, 'Fase 10: Validação aceita fórmula =(B2+C2)/D2');

// 11. Test Syntax & Pedagogical Errors
const errNoEqual = validateStageChallenge('B2+C2', stage1);
assert(!errNoEqual.isValid, 'Fórmula sem "=" é rejeitada com aviso educativo');

const errRawConst = validateStageChallenge('=200', stage1);
assert(!errRawConst.isValid, 'Digitação apenas do número estático é rejeitada com estímulo a referenciar células');

// 12. Test Save Code Portability (Anonymized)
const mockProgress = {
  currentStageId: 8,
  highestUnlockedStageId: 8,
  completedStages: [1, 2, 3, 4, 5, 6, 7],
  realExcelConfirmedStages: [1, 2],
  xp: 850,
  coins: 24,
  medals: ['first_steps', 'addition_master', 'subtraction_pro'],
  attemptsPerStage: { 1: 1, 2: 2 },
  timeSpentSeconds: 340,
};

const code = generateExportSaveCode(mockProgress);
assert(code.startsWith('EXQ-'), 'Código de salvamento gerado com prefixo EXQ-');

const parsed = parseImportSaveCode(code);
assert(
  parsed !== null &&
    parsed.highestUnlockedStageId === 8 &&
    parsed.xp === 850 &&
    parsed.coins === 24,
  'Importação de código restaura progresso de fases e moedas fielmente'
);

// 13. Test Sheet Specs (10 Phases)
const specs = getStageSheetSpecs();
assert(specs.length === 10, 'São 10 especificações de abas correspondentes às 10 fases');

// 9. Test Engine Collision
const boxA = { x: 10, y: 10, w: 20, h: 20 };
const boxB = { x: 20, y: 20, w: 20, h: 20 };
const boxC = { x: 100, y: 100, w: 20, h: 20 };
assert(checkAABBCollision(boxA, boxB) === true, 'Engine: Colisão detectada entre caixas sobrepostas');
assert(checkAABBCollision(boxA, boxC) === false, 'Engine: Ausência de colisão para caixas distantes');
assert(calculateDistance(0, 0, 3, 4) === 5, 'Engine: Cálculo de distância euclidiana correto');

console.log(`\n=== RESULTADO: ${failedTests === 0 ? 'TODOS OS TESTES PASSARAM COM SUCESSO! 🎉' : `${failedTests} FALHAS DETECTADAS.`} ===`);
if (failedTests > 0) process.exit(1);
