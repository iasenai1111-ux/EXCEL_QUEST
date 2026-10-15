import React, { useEffect } from 'react';
import { GameProgress, StudentProfile } from '../types/game';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Trophy, Award, CheckCircle2, Download, Send, ArrowLeft, Sparkles, X, Swords, Flame, Star, ShieldCheck } from 'lucide-react';

interface VictoryScreenModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: GameProgress;
  profile: StudentProfile | null;
  onOpenSubmit: () => void;
  onDownloadWorkbook: () => void;
}

export const VictoryScreenModal: React.FC<VictoryScreenModalProps> = ({
  isOpen,
  onClose,
  progress,
  profile,
  onOpenSubmit,
  onDownloadWorkbook
}) => {
  useEffect(() => {
    if (isOpen) {
      soundManager.playVictory();
      try {
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.4 }
        });
      } catch {}
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.5 }
      });
      soundManager.playSuccess();
    } catch {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#101B35]/90 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#101B35] border-4 border-[#FFD166] rounded-3xl shadow-2xl overflow-hidden flex flex-col my-4">
        
        {/* Top Street Fighter Arcade Marquee Banner */}
        <div className="relative px-6 py-4 bg-gradient-to-r from-[#EF4444] via-[#FF9F1C] to-[#EF4444] text-center text-white border-b-4 border-[#FFD166] shadow-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-yellow-300 animate-ping" />
            <span className="text-xs sm:text-sm font-mono font-black tracking-widest text-yellow-200 uppercase drop-shadow">
              SENAI ARCADE EDITION • 2026
            </span>
          </div>

          <div className="text-xl sm:text-3xl font-black italic tracking-tighter text-yellow-300 drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] font-sans">
            ★ YOU WIN! PERFECT! ★
          </div>

          <button
            onClick={onClose}
            className="p-1.5 bg-black/40 hover:bg-black/60 text-white rounded-lg transition"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Street Fighter Character Victory & Dialogue Layout */}
        <div className="p-4 sm:p-6 space-y-5 overflow-y-auto max-h-[82vh]">
          
          {/* Main VS / Clear Stage Duel Presentation */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-[#070b16]/90 border-2 border-amber-500/60 rounded-2xl p-4 sm:p-6 shadow-2xl relative overflow-hidden">
            
            {/* Background arcade speed lines glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />

            {/* Fighter Portrait: SENAIZINHO */}
            <div className="md:col-span-4 flex flex-col items-center text-center">
              <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-2xl bg-gradient-to-b from-blue-900 via-slate-800 to-slate-950 border-4 border-yellow-400 p-2 shadow-2xl shadow-yellow-500/20 flex flex-col items-center justify-center">
                {/* Pixel Art Senaizinho Fighter Stance */}
                <div className="relative flex flex-col items-center">
                  {/* Cap */}
                  <div className="w-16 h-5 bg-[#005594] border-2 border-white rounded-t-md relative">
                    <span className="text-[7px] text-white font-black absolute top-0.5 left-1">SENAI</span>
                    <div className="w-8 h-2 bg-amber-400 absolute -bottom-1 -right-2 rounded-r-sm"></div>
                  </div>
                  {/* Face */}
                  <div className="w-12 h-10 bg-[#ffd1a4] border-2 border-[#d49b6a] relative flex items-center justify-around px-1.5">
                    <div className="w-2 h-2.5 bg-slate-900 rounded-sm"></div>
                    <div className="w-2 h-2.5 bg-slate-900 rounded-sm"></div>
                    <div className="absolute bottom-1 w-4 h-1.5 bg-red-600 rounded-full"></div>
                  </div>
                  {/* Belt / Bandana */}
                  <div className="w-14 h-2.5 bg-red-600 border border-red-700 shadow flex items-center justify-center">
                    <span className="text-[6px] text-white font-mono font-bold">FAIXA PRETA EXCEL</span>
                  </div>
                  {/* Uniform Body */}
                  <div className="w-16 h-12 bg-[#005594] border-2 border-slate-700 rounded-b-md flex items-center justify-center relative">
                    <span className="text-[8px] font-black text-amber-300 font-mono tracking-wider">SENAI</span>
                  </div>
                </div>

                {/* Champion Emblem Badge */}
                <div className="absolute -bottom-3 px-3 py-0.5 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-[10px] font-black uppercase rounded-full shadow-lg border border-yellow-200">
                  CHAMPION
                </div>
              </div>

              <span className="mt-3 font-black text-lg text-yellow-300 tracking-wider">
                SENAIZINHO
              </span>
              <span className="text-[11px] font-mono text-cyan-300">
                Mestre Supremo das Fórmulas
              </span>
            </div>

            {/* Victory Quote & Dialogue Bubble (Iconic Street Fighter Ending) */}
            <div className="md:col-span-8 space-y-3">
              <div className="relative p-4 sm:p-5 bg-gradient-to-br from-slate-900 to-blue-950/80 border-2 border-cyan-400 rounded-2xl shadow-xl">
                <div className="absolute -left-2 top-8 w-4 h-4 bg-slate-900 border-l-2 border-b-2 border-cyan-400 transform rotate-45 hidden md:block" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400 block mb-1">
                  FRASE DE VITÓRIA DO LUTADOR:
                </span>
                <p className="text-sm sm:text-base font-extrabold text-white italic leading-relaxed">
                  “Você achou que me derrotaria com um erro de sintaxe ou divisão por zero?! No SENAI nós dominamos SOMA, SUBTRAÇÃO, MULTIPLICAÇÃO, MÉDIA, SE e Fórmulas Compostas de olhos fechados! Volte quando souber congelar células com $!”
                </p>
                <div className="mt-2 text-right">
                  <span className="text-[10px] font-mono text-cyan-300 font-bold">
                    — YOU MUST DEFEAT ALL 10 FORMULAS TO STAND A CHANCE!
                  </span>
                </div>
              </div>

              {/* Arcade Match Stats Box */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                <div className="p-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Fases Zeradas</span>
                  <strong className="text-emerald-400 font-black text-base font-mono">10 / 10</strong>
                </div>
                <div className="p-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Score Total</span>
                  <strong className="text-amber-400 font-black text-base font-mono">{progress.xp} XP</strong>
                </div>
                <div className="p-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Moedas Bonus</span>
                  <strong className="text-yellow-400 font-black text-base font-mono">{progress.coins} 🪙</strong>
                </div>
                <div className="p-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Fighter Rank</span>
                  <strong className="text-purple-400 font-black text-base font-mono">RANK SSS</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Official SENAI Certificate of Completion */}
          <div className="p-5 sm:p-6 bg-gradient-to-br from-[#0c1630] via-[#0f1f42] to-[#0a1226] border-2 border-amber-400/80 rounded-2xl shadow-xl text-center space-y-3 relative">
            <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-amber-300 uppercase tracking-wider border-b border-slate-700 pb-2">
              <span className="font-bold">ESCOLA SENAI “ORLANDO LAVIERO FERRAIUOLO”</span>
              <span className="text-cyan-400 font-bold">CURSO: FORMAÇÃO PROFISSIONAL SENAI-SP</span>
            </div>

            <div>
              <span className="text-xs text-slate-400 uppercase tracking-widest font-mono">Certificamos com louvor que:</span>
              <h2 className="text-2xl font-black text-white mt-1 tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-100 to-amber-300">
                {profile?.name || 'Aventureiro das Fórmulas'}
              </h2>
              <p className="text-xs text-cyan-300 font-mono mt-0.5">
                Turma: {profile?.className || 'Informática Industrial'} {profile?.mode === 'dupla' ? `• Em Dupla com: ${profile.partnerName}` : ''}
              </p>
            </div>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-2xl mx-auto">
              Superou todos os 10 mundos e desafios matemáticos do <strong className="text-yellow-300">SUPER SENAI BROS: EXCEL WORLD</strong>, demonstrando destreza completa em planilhas digitais, raciocínio lógico e automação de fórmulas no Microsoft Excel.
            </p>

            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
              <span>Orientação: <strong className="text-slate-200">Instrutor Rafael Pereira</strong></span>
              <span className="font-mono text-slate-500">Data de Emissão: {new Date().toLocaleDateString('pt-BR')}</span>
            </div>
          </div>

          {/* Action Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => {
                soundManager.playCoin();
                onDownloadWorkbook();
              }}
              className="py-3.5 px-4 btn-game btn-game-surface text-xs sm:text-sm flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4 text-[#22D3EE]" />
              <span>Baixar Planilha XLSX do Aluno</span>
            </button>

            <button
              onClick={() => {
                soundManager.playSuccess();
                onOpenSubmit();
              }}
              className="py-3.5 px-4 btn-game btn-game-play text-xs sm:text-sm flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4 text-white" />
              <span>Entregar Atividade ao Professor</span>
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-[#172747] border-t border-[#334E77] flex flex-wrap justify-between items-center gap-3">
          <button
            onClick={triggerConfetti}
            className="text-xs text-[#FFD166] hover:text-[#FFE885] flex items-center gap-1.5 font-bold transition active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-[#FFD166]" />
            <span>Explodir Mais Confetes!</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 btn-game btn-game-surface text-xs"
          >
            Voltar ao Mapa de Fases
          </button>
        </div>

      </div>
    </div>
  );
};
