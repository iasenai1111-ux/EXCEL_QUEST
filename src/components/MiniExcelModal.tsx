import React, { useState, useEffect, useRef } from 'react';
import { StageDefinition, CellData } from '../types/game';
import { validateStageChallenge, evaluateFormula } from '../utils/formulaParser';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import { CheckCircle2, AlertTriangle, Lightbulb, X, CornerDownLeft, Sparkles, HelpCircle, Delete } from 'lucide-react';

interface MiniExcelModalProps {
  stage: StageDefinition;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (stageId: number, formulaUsed: string, resultValue: number) => void;
  attemptsCount: number;
  onIncrementAttempt: (stageId: number) => void;
}

export const MiniExcelModal: React.FC<MiniExcelModalProps> = ({
  stage,
  isOpen,
  onClose,
  onSuccess,
  attemptsCount,
  onIncrementAttempt
}) => {
  const targetCellKey = stage.challenge.targetCell;
  const [selectedCell, setSelectedCell] = useState<string>(targetCellKey);
  const [formulaInput, setFormulaInput] = useState<string>('');
  const [currentGridCells, setCurrentGridCells] = useState<Record<string, CellData>>({});
  const [feedback, setFeedback] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: ''
  });
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [calculatedResult, setCalculatedResult] = useState<number | null>(null);
  const [showFormulaGuide, setShowFormulaGuide] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize or reset cells when stage opens
  useEffect(() => {
    if (isOpen) {
      setCurrentGridCells({ ...stage.grid.cells });
      setSelectedCell(stage.challenge.targetCell);
      setFormulaInput('');
      setFeedback({ type: 'idle', message: '' });
      setIsCompleted(false);
      setCalculatedResult(null);

      // Focus input after modal mount
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen, stage]);

  if (!isOpen) return null;

  // Handle cell click in table
  const handleCellClick = (cellCoord: string) => {
    soundManager.playClick();

    // If currently editing the target cell and formula starts with '=', clicking other cells inserts their reference
    if (selectedCell === targetCellKey && formulaInput.startsWith('=')) {
      if (cellCoord !== targetCellKey) {
        // Append cell coordinate
        setFormulaInput(prev => {
          // If ends with operator or parenthesis, just append
          if (/[+\-*/(:;,=]$/.test(prev.trim())) {
            return prev + cellCoord;
          }
          // If ends with another cell or number without operator, insert + or append
          return prev + ' + ' + cellCoord;
        });
        inputRef.current?.focus();
        return;
      }
    }

    // Otherwise select the cell
    setSelectedCell(cellCoord);
    if (cellCoord === targetCellKey && !formulaInput) {
      // Keep focused on target
    }
    inputRef.current?.focus();
  };

  // Quick button actions
  const insertToken = (token: string) => {
    soundManager.playClick();
    setFormulaInput(prev => {
      if (token === '=') {
        if (!prev) return '=';
        if (!prev.startsWith('=')) return '=' + prev;
        return prev;
      }
      if (!prev) return '=' + token;
      return prev + token;
    });
    inputRef.current?.focus();
  };

  const clearFormula = () => {
    soundManager.playClick();
    setFormulaInput('');
    setFeedback({ type: 'idle', message: '' });
    inputRef.current?.focus();
  };

  const backspaceFormula = () => {
    soundManager.playClick();
    setFormulaInput(prev => prev.slice(0, -1));
    inputRef.current?.focus();
  };

  // Execute formula evaluation and submission
  const handleSubmitFormula = () => {
    if (!formulaInput.trim()) {
      setFeedback({
        type: 'error',
        message: 'Por favor, digite uma fórmula antes de pressionar Enter.'
      });
      soundManager.playError();
      return;
    }

    const validation = validateStageChallenge(formulaInput, stage);

    if (validation.isValid && validation.calculatedValue !== undefined) {
      soundManager.playSuccess();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}

      // Update grid cell immediately with the calculated result
      setCurrentGridCells(prev => ({
        ...prev,
        [targetCellKey]: {
          value: validation.calculatedValue!,
          type: 'number'
        }
      }));

      setCalculatedResult(validation.calculatedValue);
      setIsCompleted(true);
      setFeedback({
        type: 'success',
        message: validation.message
      });

      // Notify parent
      onSuccess(stage.id, formulaInput, validation.calculatedValue);
    } else {
      soundManager.playError();
      onIncrementAttempt(stage.id);
      setFeedback({
        type: 'error',
        message: validation.message
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmitFormula();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  // Dynamic preview evaluation while typing
  let previewVal: string | null = null;
  if (formulaInput.startsWith('=') && formulaInput.length > 2) {
    const preview = evaluateFormula(formulaInput, currentGridCells);
    if (preview.success && preview.value !== undefined) {
      previewVal = String(preview.value);
    }
  }

  // Tiered hints based on attemptsCount
  // 0 attempts: no hint yet
  // 1 attempt: conceptual hint (index 0)
  // 2 attempts: cell highlight + hint (index 1)
  // 3+ attempts: step-by-step guided example (index 2)
  const currentHintIndex = Math.min(Math.max(0, attemptsCount - 1), 2);
  const showHint = attemptsCount >= 1;
  const isCellHighlighted = attemptsCount >= 2;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#101B35]/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#101B35] border-2 border-[#334E77] rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Top Excel Green Header Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#15803D] to-[#166534] text-white">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-white text-[#107c41] font-extrabold text-sm flex items-center justify-center rounded shadow">
              X
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-wide">Terminal Excel SENAI</span>
                <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-950/60 text-emerald-200 rounded-full border border-emerald-400/40">
                  {stage.title}
                </span>
              </div>
              <p className="text-xs text-emerald-100 opacity-90 hidden sm:block">
                {stage.challenge.instruction}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFormulaGuide(!showFormulaGuide)}
              className="p-1.5 text-xs bg-emerald-900/60 hover:bg-emerald-800 text-emerald-100 rounded-lg flex items-center gap-1 transition"
              title="Guia de Fórmulas"
            >
              <HelpCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Guia</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-red-500/30 text-white rounded-lg transition"
              aria-label="Fechar Terminal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Formula syntax guide tooltip banner if toggled */}
        {showFormulaGuide && (
          <div className="p-3 bg-slate-900 border-b border-emerald-500/30 text-xs text-slate-300 flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-bold text-emerald-400">Como funciona:</span>
              <span>1. Clique na célula amarela (<strong>{targetCellKey}</strong>).</span>
              <span>2. Clique em <strong>=</strong> ou digite com o teclado.</span>
              <span>3. Clique nas células de dados (ex: <strong>{stage.challenge.requiredCells.join(', ')}</strong>) ou digite seus nomes.</span>
              <span>4. Use operadores como <strong>+</strong>, <strong>-</strong>, <strong>*</strong> ou funções como <strong>SOMA()</strong>, <strong>MÉDIA()</strong>.</span>
            </div>
            <span className="text-emerald-300 font-mono">Fórmulas aceitas: {stage.challenge.acceptedFormulasDescription}</span>
          </div>
        )}

        {/* Excel Formula Bar (fx) */}
        <div className="p-3 bg-[#0d162d] border-b border-slate-700/80 flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
          {/* Name Box */}
          <div className="flex items-center gap-2">
            <div className="w-16 px-2 py-1.5 bg-[#172545] border border-slate-600 rounded text-center font-mono font-bold text-emerald-400 text-sm shadow-inner">
              {selectedCell}
            </div>
            <div className="w-8 h-8 flex items-center justify-center font-serif italic font-bold text-slate-400 bg-slate-800/80 rounded border border-slate-700">
              fx
            </div>
          </div>

          {/* Formula Input */}
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={formulaInput}
              onChange={(e) => setFormulaInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isCompleted}
              placeholder={`Digite a fórmula para ${targetCellKey} (ex: ${stage.challenge.acceptedFormulasDescription.split(' ')[0]})...`}
              className="w-full pl-3 pr-24 py-1.5 bg-[#080d1a] border-2 border-emerald-500/60 focus:border-emerald-400 rounded-lg text-emerald-200 font-mono text-sm tracking-wider focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition shadow-inner"
            />
            {previewVal !== null && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono px-2 py-0.5 bg-emerald-950/80 text-emerald-300 rounded border border-emerald-500/40">
                Resultado: <strong>{previewVal}</strong>
              </div>
            )}
          </div>

          {/* Enter Action Button */}
          <button
            onClick={handleSubmitFormula}
            disabled={isCompleted || !formulaInput.trim()}
            className="flex items-center justify-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm rounded-lg shadow-md transition"
          >
            <CornerDownLeft className="w-4 h-4" />
            <span>ENTER</span>
          </button>
        </div>

        {/* Interactive Formula Assistant Buttons */}
        <div className="px-3 py-2 bg-[#13203f] border-b border-slate-700/60 flex items-center gap-1.5 overflow-x-auto text-xs scrollbar-thin">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-1 hidden sm:inline">
            Inserir:
          </span>
          <button
            onClick={() => insertToken('=')}
            className="px-2.5 py-1 bg-emerald-700/50 hover:bg-emerald-600 border border-emerald-500/50 rounded font-mono font-bold text-white transition active:scale-95"
            title="Começar fórmula com sinal de igual"
          >
            =
          </button>
          <button
            onClick={() => insertToken(' + ')}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded font-mono font-bold text-emerald-300 transition active:scale-95"
            title="Soma (+)"
          >
            +
          </button>
          <button
            onClick={() => insertToken(' - ')}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded font-mono font-bold text-emerald-300 transition active:scale-95"
            title="Subtração (-)"
          >
            -
          </button>
          <button
            onClick={() => insertToken(' * ')}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded font-mono font-bold text-emerald-300 transition active:scale-95"
            title="Multiplicação (*)"
          >
            *
          </button>
          <button
            onClick={() => insertToken(' / ')}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded font-mono font-bold text-emerald-300 transition active:scale-95"
            title="Divisão (/)"
          >
            /
          </button>
          <button
            onClick={() => insertToken('(')}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded font-mono font-bold text-slate-300 transition active:scale-95"
          >
            (
          </button>
          <button
            onClick={() => insertToken(')')}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded font-mono font-bold text-slate-300 transition active:scale-95"
          >
            )
          </button>
          <button
            onClick={() => insertToken(':')}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded font-mono font-bold text-slate-300 transition active:scale-95"
            title="Intervalo até (:)"
          >
            :
          </button>
          {stage.challenge.allowedFunctions.includes('SOMA') && (
            <button
              onClick={() => insertToken('SOMA(')}
              className="px-2.5 py-1 bg-cyan-900/60 hover:bg-cyan-800 border border-cyan-500/50 rounded font-mono font-bold text-cyan-200 transition active:scale-95"
            >
              SOMA(
            </button>
          )}
          {stage.challenge.allowedFunctions.includes('MÉDIA') && (
            <button
              onClick={() => insertToken('MÉDIA(')}
              className="px-2.5 py-1 bg-purple-900/60 hover:bg-purple-800 border border-purple-500/50 rounded font-mono font-bold text-purple-200 transition active:scale-95"
            >
              MÉDIA(
            </button>
          )}
          {stage.theme === 'boss' && (
            <button
              onClick={() => insertToken('%')}
              className="px-2.5 py-1 bg-rose-900/60 hover:bg-rose-800 border border-rose-500/50 rounded font-mono font-bold text-rose-200 transition active:scale-95"
            >
              %
            </button>
          )}
          <div className="flex-1" />
          <button
            onClick={backspaceFormula}
            className="p-1 px-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-600 flex items-center gap-1 transition"
            title="Apagar caractere"
          >
            <Delete className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={clearFormula}
            className="px-2 py-1 bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/40 rounded transition"
            title="Limpar fórmula"
          >
            Limpar
          </button>
        </div>

        {/* Spreadsheet Grid Container */}
        <div className="p-4 overflow-auto flex-1 bg-[#0b1328] min-h-[220px]">
          <div className="inline-block min-w-full border border-slate-700/80 rounded-lg overflow-hidden shadow-xl bg-[#0e172e]">
            <table className="w-full border-collapse select-none text-left">
              <thead>
                <tr>
                  {/* Top-Left Empty Header Corner */}
                  <th className="w-12 p-2 bg-[#172547] border border-slate-700/90 text-center text-xs font-semibold text-slate-400">
                    #
                  </th>
                  {stage.grid.columns.map(col => (
                    <th
                      key={col}
                      className="p-2 bg-[#172547] border border-slate-700/90 text-center text-xs font-bold text-slate-300 tracking-wider min-w-[110px]"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stage.grid.rows.map(row => (
                  <tr key={row}>
                    {/* Row Header */}
                    <td className="p-2 bg-[#172547] border border-slate-700/90 text-center text-xs font-bold text-slate-400">
                      {row}
                    </td>

                    {/* Data Cells */}
                    {stage.grid.columns.map(col => {
                      const coord = `${col}${row}`;
                      const cell = currentGridCells[coord] || { value: '', type: 'label' };
                      const isSelected = selectedCell === coord;
                      const isTarget = coord === targetCellKey;
                      const isRelevantCell = isCellHighlighted && stage.challenge.requiredCells.includes(coord);

                      let cellBg = 'bg-[#0f1b36] hover:bg-[#152345]';
                      let textColor = 'text-slate-200';
                      let borderColor = 'border-slate-800';

                      if (cell.type === 'label') {
                        textColor = row === 1 ? 'text-cyan-300 font-bold' : 'text-slate-300';
                      }

                      if (cell.type === 'number' || cell.type === 'currency') {
                        textColor = 'text-emerald-400 font-mono font-bold';
                      }

                      // Editable target cell styling
                      if (isTarget) {
                        cellBg = 'bg-amber-950/40 hover:bg-amber-900/40';
                        borderColor = 'border-amber-500/70';
                        textColor = 'text-amber-300 font-mono font-extrabold';
                      }

                      // Completed state
                      if (isTarget && isCompleted) {
                        cellBg = 'bg-emerald-950/50';
                        borderColor = 'border-emerald-500';
                        textColor = 'text-emerald-300 font-mono font-extrabold text-base';
                      }

                      // Pulsing hint highlight for relevant cells
                      const hintPulseClass = isRelevantCell
                        ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-slate-900 animate-pulse bg-cyan-950/40'
                        : '';

                      const selectedOutlineClass = isSelected
                        ? 'ring-2 ring-emerald-400 ring-inset bg-emerald-950/20'
                        : '';

                      return (
                        <td
                          key={coord}
                          onClick={() => handleCellClick(coord)}
                          className={`relative p-2.5 border transition cursor-pointer text-sm font-sans ${cellBg} ${textColor} ${borderColor} ${hintPulseClass} ${selectedOutlineClass}`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="truncate">
                              {cell.format ? cell.format : String(cell.value)}
                            </span>
                            {isTarget && !isCompleted && (
                              <span className="ml-1 text-[10px] px-1.5 py-0.5 bg-amber-500/30 text-amber-200 rounded font-mono">
                                EDITÁVEL
                              </span>
                            )}
                            {isTarget && isCompleted && (
                              <span className="ml-1 text-emerald-400">
                                <Sparkles className="w-3.5 h-3.5" />
                              </span>
                            )}
                          </div>

                          {/* Excel handle square on selected cell */}
                          {isSelected && (
                            <div className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-400 translate-x-1 translate-y-1 z-10" />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Smart Hints Panel */}
        {showHint && !isCompleted && (
          <div className="px-4 py-2.5 bg-[#17223b] border-t border-slate-700/80 flex items-start gap-2.5 text-xs text-amber-200 animate-fadeIn">
            <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold text-amber-300">
                {attemptsCount === 1 && 'Dica Conceitual: '}
                {attemptsCount === 2 && 'Dica de Células: '}
                {attemptsCount >= 3 && 'Exemplo Guiado: '}
              </span>
              <span>{stage.challenge.hints[currentHintIndex]}</span>
            </div>
          </div>
        )}

        {/* Feedback Message Bar */}
        {feedback.type !== 'idle' && (
          <div
            className={`px-4 py-2.5 flex items-center justify-between border-t text-sm font-medium ${
              feedback.type === 'success'
                ? 'bg-emerald-950/80 text-emerald-200 border-emerald-600'
                : 'bg-red-950/80 text-red-200 border-red-700'
            }`}
          >
            <div className="flex items-center gap-2">
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-red-400" />
              )}
              <span>{feedback.message}</span>
            </div>
            {feedback.type === 'success' && (
              <span className="font-mono font-bold text-emerald-300 bg-emerald-900/60 px-2 py-0.5 rounded text-xs">
                +100 XP
              </span>
            )}
          </div>
        )}

        {/* Bottom Actions Bar */}
        <div className="p-3 bg-[#0d162d] border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span>Dificuldade: <strong>Nível 1</strong></span>
            <span>•</span>
            <span>Célula Alvo: <strong className="text-amber-400">{targetCellKey}</strong></span>
            <span>•</span>
            <span>Resultado Esperado: <strong className="text-emerald-400">{stage.challenge.expectedValue}</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 btn-game btn-game-surface text-xs"
            >
              Voltar ao Cenário
            </button>
            {isCompleted ? (
              <button
                onClick={onClose}
                className="px-5 py-2 btn-game btn-game-play text-xs flex items-center gap-1.5"
              >
                <span>Avançar no Jogo</span>
                <Sparkles className="w-4 h-4 text-[#FFD166]" />
              </button>
            ) : (
              <button
                onClick={handleSubmitFormula}
                className="px-5 py-2 btn-game btn-game-play text-xs flex items-center gap-1.5"
              >
                <span>Verificar Fórmula</span>
                <CornerDownLeft className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
