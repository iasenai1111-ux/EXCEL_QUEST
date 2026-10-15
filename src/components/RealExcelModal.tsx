import React, { useState } from 'react';
import { StageDefinition, StudentProfile } from '../types/game';
import { generateStudentWorkbook } from '../utils/xlsxGenerator';
import { soundManager } from '../utils/audio';
import { Download, CheckSquare, FileSpreadsheet, ArrowRight, X, AlertCircle, Sparkles } from 'lucide-react';

interface RealExcelModalProps {
  stage: StageDefinition;
  profile: StudentProfile | null;
  isOpen: boolean;
  onClose: () => void;
  isConfirmed: boolean;
  onConfirmPractice: (stageId: number) => void;
  onNextStage?: () => void;
}

export const RealExcelModal: React.FC<RealExcelModalProps> = ({
  stage,
  profile,
  isOpen,
  onClose,
  isConfirmed,
  onConfirmPractice,
  onNextStage
}) => {
  const [downloadCount, setDownloadCount] = useState<number>(0);
  const [hasConfirmed, setHasConfirmed] = useState<boolean>(isConfirmed);

  if (!isOpen) return null;

  const handleDownload = () => {
    soundManager.playCoin();
    generateStudentWorkbook(profile);
    setDownloadCount(prev => prev + 1);
  };

  const handleConfirm = () => {
    soundManager.playSuccess();
    setHasConfirmed(true);
    onConfirmPractice(stage.id);
  };

  const { realExcelInstructions } = stage.challenge;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#101B35]/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#101B35] border-2 border-[#334E77] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#172747] via-[#213556] to-[#172747] border-b border-[#334E77] text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#22C55E]/20 rounded-xl border border-[#22C55E]/50">
              <FileSpreadsheet className="w-6 h-6 text-[#22C55E]" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#22D3EE] font-bold">
                Etapa Prática Pedagógica SENAI
              </span>
              <h2 className="text-lg font-bold text-[#F8FAFC]">AGORA É SUA VEZ NO EXCEL DE VERDADE!</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#CBD5E1] hover:text-white rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-sm text-[#CBD5E1] max-h-[75vh]">
          
          {/* Motivation Box */}
          <div className="p-3.5 bg-[#172747] border border-[#22C55E]/40 rounded-2xl flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-[#22C55E] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-[#22C55E]">
                Parabéns pelo sucesso no simulador!
              </p>
              <p className="text-xs text-[#CBD5E1] mt-0.5">
                O aprendizado no SENAI só se consolida quando você executa a fórmula no software Microsoft Excel instalado no computador do laboratório.
              </p>
            </div>
          </div>

          {/* Download Action Banner */}
          <div className="p-4 bg-[#172747] border border-[#334E77] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-inner">
            <div>
              <div className="font-bold text-[#F8FAFC] flex items-center gap-2">
                <span>Planilha Oficial de Exercícios (.xlsx)</span>
                {downloadCount > 0 && (
                  <span className="text-[10px] bg-[#22C55E]/20 text-[#22C55E] px-2 py-0.5 rounded-full border border-[#22C55E]/40 font-mono font-bold">
                    Baixado ({downloadCount}x)
                  </span>
                )}
              </div>
              <p className="text-xs text-[#CBD5E1] mt-0.5">
                Personalizada com: <strong className="text-[#22D3EE]">{profile?.name || 'Aluno SENAI'}</strong> ({profile?.className || 'Turma SENAI'})
              </p>
            </div>
            <button
              onClick={handleDownload}
              className="w-full sm:w-auto px-5 py-2.5 btn-game btn-game-play text-xs flex items-center justify-center gap-2 shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>Baixar Planilha XLSX</span>
            </button>
          </div>

          {/* Detailed Instructions */}
          <div className="space-y-3 pt-1">
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#CBD5E1]">
              Roteiro de Prática para a {stage.title}:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 bg-[#172747] border border-[#334E77] rounded-xl">
                <span className="text-[#CBD5E1] block mb-1">1. Aba do Arquivo:</span>
                <span className="font-mono font-bold text-[#22D3EE] bg-[#101B35] px-2 py-0.5 rounded border border-[#334E77]">
                  {realExcelInstructions.sheetName}
                </span>
              </div>
              <div className="p-3 bg-[#172747] border border-[#334E77] rounded-xl">
                <span className="text-[#CBD5E1] block mb-1">2. Célula a Preencher:</span>
                <span className="font-mono font-bold text-[#FFD166] bg-[#101B35] px-2 py-0.5 rounded border border-[#FFD166]/40">
                  Célula {realExcelInstructions.cellsToFill} (Fundo Amarelo)
                </span>
              </div>
            </div>

            <div className="p-4 bg-[#172747] border border-[#334E77] rounded-2xl space-y-2 text-xs">
              <span className="text-[#CBD5E1] font-semibold block">3. O que fazer no Excel do computador:</span>
              <p className="text-[#F8FAFC] leading-relaxed">
                {realExcelInstructions.description}
              </p>
              <div className="pt-2 border-t border-[#334E77] flex items-center justify-between">
                <span className="text-[#CBD5E1]">4. Resultado esperado para conferência:</span>
                <span className="font-mono font-bold text-[#22C55E] bg-[#101B35] px-2.5 py-1 rounded border border-[#22C55E]/40 text-sm">
                  {realExcelInstructions.expectedResultText}
                </span>
              </div>
            </div>
          </div>

          {/* Pedagogical Notice */}
          <div className="p-3.5 bg-[#FF9F1C]/15 border border-[#FF9F1C]/40 rounded-2xl text-xs text-[#FFD166] flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-[#FF9F1C] shrink-0 mt-0.5" />
            <p>
              <strong>Aviso de Aprendizagem:</strong> A prática real no computador é um compromisso do aluno com seu desenvolvimento técnico. Confirme abaixo somente após abrir seu software de planilhas e testar a fórmula.
            </p>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#172747] border-t border-[#334E77] flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 btn-game btn-game-surface text-xs"
          >
            Fechar
          </button>

          <div className="flex items-center gap-2">
            {!hasConfirmed ? (
              <button
                onClick={handleConfirm}
                className="px-4 py-2.5 btn-game btn-game-continue text-xs flex items-center gap-2"
              >
                <CheckSquare className="w-4 h-4" />
                <span>Confirmar que Pratiquei no PC (+50 XP)</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#22C55E] flex items-center gap-1 bg-[#101B35] px-3 py-1.5 rounded-xl border border-[#22C55E]/40">
                  <CheckSquare className="w-4 h-4 text-[#22C55E]" />
                  Prática Registrada!
                </span>
                {onNextStage && (
                  <button
                    onClick={() => {
                      onClose();
                      onNextStage();
                    }}
                    className="px-4 py-2 btn-game btn-game-play text-xs flex items-center gap-1.5"
                  >
                    <span>Ir Para Próxima Fase</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
