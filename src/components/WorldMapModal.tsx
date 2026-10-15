import React from 'react';
import { LEVEL_1_STAGES } from '../data/stages';
import { GameProgress } from '../types/game';
import { soundManager } from '../utils/audio';
import { MapPin, Lock, CheckCircle2, X } from 'lucide-react';

interface WorldMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: GameProgress;
  currentStageId: number;
  onSelectStage: (stageId: number) => void;
}

export const WorldMapModal: React.FC<WorldMapModalProps> = ({
  isOpen,
  onClose,
  progress,
  currentStageId,
  onSelectStage,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#101B35]/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-[#101B35] border-2 border-[#334E77] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#172747] via-[#213556] to-[#172747] border-b border-[#334E77] text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#2563EB]/30 rounded-xl border border-[#2563EB]">
              <MapPin className="w-6 h-6 text-[#22D3EE]" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#22D3EE]">
                Overworld SENAI • Nível 1
              </span>
              <h2 className="text-lg font-bold text-[#F8FAFC]">Mapa dos Mundos (Super Mario Style)</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#CBD5E1] hover:text-white rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Map Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-[#CBD5E1]">
          
          <p className="text-xs text-[#CBD5E1] text-center max-w-xl mx-auto">
            Percorra a trilha industrial do SENAI. Complete o desafio no terminal para liberar a próxima rota!
          </p>

          {/* Interactive World Route Nodes */}
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-4 py-6 px-4 bg-[#172747] border border-[#334E77] rounded-2xl shadow-inner">
            
            {/* Connecting Track Line behind nodes */}
            <div className="hidden md:block absolute top-1/2 left-12 right-12 h-2 bg-[#101B35] -translate-y-1/2 z-0 rounded-full overflow-hidden border border-[#334E77]/60">
              <div
                className="h-full bg-gradient-to-r from-[#22C55E] via-[#22D3EE] to-[#FFD166] transition-all duration-700"
                style={{
                  width: `${((progress.highestUnlockedStageId - 1) / (LEVEL_1_STAGES.length - 1)) * 100}%`
                }}
              />
            </div>

            {LEVEL_1_STAGES.map((st, index) => {
              const isUnlocked = st.id <= progress.highestUnlockedStageId;
              const isCompleted = progress.completedStages.includes(st.id);
              const isCurrent = st.id === currentStageId;

              return (
                <div key={st.id} className="relative z-10 flex flex-col items-center group w-full md:w-auto">
                  
                  {/* Node Button */}
                  <button
                    disabled={!isUnlocked}
                    onClick={() => {
                      soundManager.playClick();
                      onSelectStage(st.id);
                      onClose();
                    }}
                    className={`relative w-16 h-16 rounded-2xl border-2 flex flex-col items-center justify-center transition transform group-hover:scale-105 active:scale-95 shadow-xl ${
                      isCurrent
                        ? 'bg-[#2563EB] text-white border-white ring-4 ring-[#22D3EE]/50 animate-pulse'
                        : isCompleted
                        ? 'bg-[#22C55E] text-white border-[#86EFAC] ring-2 ring-[#22C55E]/40'
                        : isUnlocked
                        ? 'bg-[#213556] text-[#F8FAFC] hover:bg-[#2A436C] border-[#334E77]'
                        : 'bg-[#101B35] text-slate-600 border-[#172747] cursor-not-allowed opacity-60'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-7 h-7 text-white" />
                    ) : isUnlocked ? (
                      <span className="font-black text-lg font-mono">{st.id}</span>
                    ) : (
                      <Lock className="w-6 h-6 text-slate-500" />
                    )}

                    <span className="text-[9px] font-mono font-bold mt-0.5">
                      {isCompleted ? '100%' : `W1-${st.id}`}
                    </span>

                    {/* Mario Hat / Current Position Pin Marker */}
                    {isCurrent && (
                      <div className="absolute -top-4 w-7 h-5 bg-[#EF4444] rounded-t-full border border-white text-[9px] text-white flex items-center justify-center font-bold shadow-lg animate-bounce">
                        ▲
                      </div>
                    )}
                  </button>

                  {/* Stage Title Pill */}
                  <div className="mt-3 text-center max-w-[120px]">
                    <span className={`text-xs font-bold block truncate ${isUnlocked ? 'text-[#F8FAFC]' : 'text-slate-500'}`}>
                      {st.title.split('—')[1]?.trim() || st.title}
                    </span>
                    <span className="text-[10px] text-[#22D3EE] font-mono block">
                      {st.challenge.operationName}
                    </span>
                  </div>

                  {/* Vertical connector for mobile view */}
                  {index < LEVEL_1_STAGES.length - 1 && (
                    <div className="md:hidden w-1 h-6 bg-[#334E77] my-1 rounded" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick Stage Cards Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {LEVEL_1_STAGES.map((st) => {
              const isUnlocked = st.id <= progress.highestUnlockedStageId;
              const isCompleted = progress.completedStages.includes(st.id);

              return (
                <div
                  key={st.id}
                  onClick={() => {
                    if (isUnlocked) {
                      soundManager.playClick();
                      onSelectStage(st.id);
                      onClose();
                    }
                  }}
                  className={`p-3.5 rounded-2xl border transition ${
                    isUnlocked
                      ? 'bg-[#172747] border-[#334E77] hover:border-[#22D3EE] cursor-pointer shadow-md'
                      : 'bg-[#101B35] border-[#172747] opacity-60 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-mono text-[#22D3EE] font-bold">MUNDO 1-{st.id}</span>
                    {isCompleted ? (
                      <span className="text-[#22C55E] font-semibold flex items-center gap-1 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Concluída
                      </span>
                    ) : isUnlocked ? (
                      <span className="text-[#FFD166] font-semibold text-[11px]">Disponível</span>
                    ) : (
                      <span className="text-slate-500 text-[11px]">Bloqueada</span>
                    )}
                  </div>
                  <strong className="text-[#F8FAFC] text-xs block truncate mb-1">
                    {st.title}
                  </strong>
                  <p className="text-[11px] text-[#CBD5E1] line-clamp-2">
                    {st.learningGoal}
                  </p>
                </div>
              );
            })}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-[#172747] border-t border-[#334E77] flex justify-between items-center text-xs text-[#CBD5E1]">
          <div className="flex items-center gap-2">
            <span>Progresso da Trilha:</span>
            <strong className="text-[#22C55E] font-mono">
              {progress.completedStages.length} de {LEVEL_1_STAGES.length} Fases
            </strong>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 btn-game btn-game-surface text-xs"
          >
            Fechar Mapa
          </button>
        </div>

      </div>
    </div>
  );
};
