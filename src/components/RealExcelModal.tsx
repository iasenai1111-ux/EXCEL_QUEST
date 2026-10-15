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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#0e172e] border-2 border-emerald-500/60 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-950/50 rounded-xl border border-emerald-400/40">
              <FileSpreadsheet className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <span className="text-[11px] font-mono tracking-wider uppercase text-emerald-200">
                Etapa Prática Pedagógica SENAI
              </span>
              <h2 className="text-lg font-bold">AGORA É SUA VEZ NO EXCEL DE VERDADE!</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white hover:bg-emerald-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-sm text-slate-200 max-h-[75vh]">
          
          {/* Motivation Box */}
          <div className="p-3.5 bg-emerald-950/40 border border-emerald-500/40 rounded-xl flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-emerald-300">
                Parabéns pelo sucesso no simulador!
              </p>
              <p className="text-xs text-slate-300 mt-0.5">
                O aprendizado no SENAI só se consolida quando você executa a fórmula no software Microsoft Excel instalado no computador do laboratório.
              </p>
            </div>
          </div>

          {/* Download Action Banner */}
          <div className="p-4 bg-gradient-to-r from-slate-900 to-[#13203f] border border-slate-700 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-inner">
            <div>
              <div className="font-bold text-white flex items-center gap-2">
                <span>Planilha Oficial de Exercícios (.xlsx)</span>
                {downloadCount > 0 && (
                  <span className="text-[10px] bg-emerald-900 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/40">
                    Baixado ({downloadCount}x)
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Personalizada com o nome: <strong className="text-cyan-300">{profile?.name || 'Aluno SENAI'}</strong> ({profile?.className || 'Turma SENAI'})
              </p>
            </div>
            <button
              onClick={handleDownload}
              className="w-full sm:w-auto px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition active:scale-95 shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>Baixar Planilha XLSX</span>
            </button>
          </div>

          {/* Detailed Instructions */}
          <div className="space-y-3 pt-1">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">
              Roteiro de Prática para a {stage.title}:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 bg-[#131f38] border border-slate-700/80 rounded-lg">
                <span className="text-slate-400 block mb-1">1. Aba do Arquivo:</span>
                <span className="font-mono font-bold text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                  {realExcelInstructions.sheetName}
                </span>
              </div>
              <div className="p-3 bg-[#131f38] border border-slate-700/80 rounded-lg">
                <span className="text-slate-400 block mb-1">2. Célula a Preencher:</span>
                <span className="font-mono font-bold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                  Célula {realExcelInstructions.cellsToFill} (Fundo Amarelo)
                </span>
              </div>
            </div>

            <div className="p-3.5 bg-[#131f38] border border-slate-700/80 rounded-lg space-y-2 text-xs">
              <span className="text-slate-400 font-semibold block">3. O que fazer no Excel do computador:</span>
              <p className="text-slate-200 leading-relaxed">
                {realExcelInstructions.description}
              </p>
              <div className="pt-2 border-t border-slate-700 flex items-center justify-between">
                <span className="text-slate-400">4. Resultado esperado para conferência:</span>
                <span className="font-mono font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded border border-emerald-500/40 text-sm">
                  {realExcelInstructions.expectedResultText}
                </span>
              </div>
            </div>
          </div>

          {/* Pedagogical Self-Confirmation Notice */}
          <div className="p-3 bg-slate-900/90 border border-slate-700/70 rounded-xl text-xs text-slate-300 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p>
              <strong>Aviso de Aprendizagem:</strong> A prática real no computador é um compromisso do aluno com seu desenvolvimento técnico. Confirme abaixo somente após abrir seu software de planilhas e testar a fórmula.
            </p>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#091024] border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl transition"
          >
            Fechar
          </button>

          <div className="flex items-center gap-2">
            {!hasConfirmed ? (
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 transition"
              >
                <CheckSquare className="w-4 h-4" />
                <span>Confirmar que Pratiquei no PC (+50 XP)</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-500/30">
                  <CheckSquare className="w-4 h-4 text-emerald-400" />
                  Prática Registrada!
                </span>
                {onNextStage && (
                  <button
                    onClick={() => {
                      onClose();
                      onNextStage();
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-1.5 transition"
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
