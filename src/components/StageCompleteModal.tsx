import React from 'react';
import { StageDefinition } from '../types/game';
import { soundManager } from '../utils/audio';
import { Trophy, ArrowRight, FileSpreadsheet, Sparkles, CheckCircle2, X } from 'lucide-react';

interface StageCompleteModalProps {
  stage: StageDefinition;
  isOpen: boolean;
  onClose: () => void;
  onOpenRealExcel: () => void;
  onNextStage: () => void;
  hasNextStage: boolean;
  isRealExcelDone: boolean;
}

export const StageCompleteModal: React.FC<StageCompleteModalProps> = ({
  stage,
  isOpen,
  onClose,
  onOpenRealExcel,
  onNextStage,
  hasNextStage,
  isRealExcelDone
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#0e172e] border-2 border-emerald-500/70 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-center">
        
        {/* Banner */}
        <div className="p-6 bg-gradient-to-b from-emerald-800 via-teal-900 to-[#0e172e] border-b border-emerald-500/30 flex flex-col items-center">
          <div className="w-16 h-16 bg-emerald-950 border-2 border-emerald-400 rounded-2xl flex items-center justify-center text-3xl shadow-xl animate-bounce">
            🎉
          </div>
          <span className="mt-3 text-xs font-mono uppercase tracking-widest text-emerald-300 font-bold">
            Fase Concluída com Sucesso!
          </span>
          <h2 className="text-xl font-extrabold text-white mt-1">
            {stage.title}
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-sm">
            {stage.learningGoal}
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs text-slate-200">
          
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-900 border border-slate-700/80 rounded-xl">
              <span className="text-slate-400 block mb-1">XP Conquistado</span>
              <span className="font-mono font-bold text-emerald-400 text-base">+100 XP</span>
            </div>
            <div className="p-3 bg-slate-900 border border-slate-700/80 rounded-xl">
              <span className="text-slate-400 block mb-1">Portal Desbloqueado</span>
              <span className="font-mono font-bold text-cyan-400 text-base">ABERTO ✓</span>
            </div>
          </div>

          <div className="p-3.5 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-left flex items-start gap-3">
            <FileSpreadsheet className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-emerald-300">
                Próximo Passo Recomendado:
              </p>
              <p className="text-slate-300">
                Teste esta mesma fórmula na planilha real do Microsoft Excel no seu computador para fixar o aprendizado e registrar a prática!
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-2 pt-2">
            <button
              onClick={() => {
                soundManager.playClick();
                onOpenRealExcel();
              }}
              className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition active:scale-95"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>{isRealExcelDone ? 'Ver Roteiro no Excel Real (Já Praticado)' : 'Praticar no Excel Real Agora'}</span>
            </button>

            {hasNextStage ? (
              <button
                onClick={() => {
                  soundManager.playSuccess();
                  onNextStage();
                }}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition active:scale-95"
              >
                <span>Avançar para a Próxima Fase</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => {
                  soundManager.playVictory();
                  onNextStage();
                }}
                className="w-full py-3 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white font-extrabold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition active:scale-95"
              >
                <Trophy className="w-4 h-4" />
                <span>Ver Grande Tela de Vitória Final!</span>
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
