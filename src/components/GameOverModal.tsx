import React from 'react';
import { soundManager } from '../utils/audio';
import { RotateCcw, HeartCrack, Skull, AlertOctagon, ShieldAlert, Home } from 'lucide-react';

interface GameOverModalProps {
  isOpen: boolean;
  stageNumber: number;
  onRestartAtStage1: () => void;
  onGoToMenu: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  stageNumber,
  onRestartAtStage1,
  onGoToMenu
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg bg-gradient-to-b from-slate-900 via-rose-950/40 to-slate-950 border-2 border-rose-500/80 rounded-2xl shadow-2xl p-6 sm:p-8 text-center text-white relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-rose-600/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-amber-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Arcade Skull / Heartbreak icon */}
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 rounded-2xl bg-rose-950/80 border-2 border-rose-500/60 flex items-center justify-center shadow-lg shadow-rose-950/80 animate-bounce">
            <HeartCrack className="w-12 h-12 text-rose-500" />
          </div>
        </div>

        {/* Retro Title */}
        <div className="space-y-1 mb-4">
          <div className="inline-block px-3 py-1 bg-rose-600/30 border border-rose-500/50 rounded-full text-xs font-mono font-bold tracking-widest text-rose-300 uppercase">
            Desafio Clássico SENAI
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white drop-shadow-md">
            GAME OVER
          </h2>
          <p className="text-sm sm:text-base font-semibold text-rose-400">
            Senaizinho esgotou todas as 3 vidas!
          </p>
        </div>

        {/* Automatic Stage Locking Notice */}
        <div className="bg-rose-950/50 border border-rose-600/40 rounded-xl p-4 mb-6 text-left space-y-2 text-xs sm:text-sm text-slate-200">
          <div className="flex items-start gap-2.5">
            <AlertOctagon className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-rose-300 block mb-1">
                Tente novamente nesta fase:
              </span>
              <p className="text-slate-300 leading-relaxed">
                Você perdeu as vidas na <strong className="text-white">Fase {stageNumber}</strong>. Ao tentar novamente, o personagem volta ao começo dessa fase. As fórmulas já resolvidas, XP e fases liberadas permanecem salvos.
              </p>
            </div>
          </div>
          <div className="pt-2 border-t border-rose-900/50 flex items-center gap-2 text-[11px] text-slate-400">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Suas 3 vidas serão restauradas para tentar novamente esta fase.</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => {
              soundManager.playClick();
              onRestartAtStage1();
            }}
            className="w-full sm:w-auto flex-1 px-6 py-3.5 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-extrabold rounded-xl shadow-lg shadow-rose-950/50 flex items-center justify-center gap-2 transition active:scale-95 text-sm"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Tentar esta fase novamente</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onGoToMenu();
            }}
            className="w-full sm:w-auto px-5 py-3.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-slate-300 hover:text-white font-bold text-sm flex items-center justify-center gap-2 transition"
          >
            <Home className="w-4 h-4" />
            <span>Menu Principal</span>
          </button>
        </div>
      </div>
    </div>
  );
};
