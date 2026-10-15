import React, { useState } from 'react';
import { GameProgress, StudentProfile } from '../types/game';
import { LEVEL_1_STAGES } from '../data/stages';
import { soundManager } from '../utils/audio';
import {
  Volume2,
  VolumeX,
  Trophy,
  GraduationCap,
  Send,
  User,
  Map,
  Settings,
  Zap,
  Coins
} from 'lucide-react';

interface HeaderProps {
  progress: GameProgress;
  profile: StudentProfile | null;
  onOpenAchievements: () => void;
  onOpenTeacherDashboard: () => void;
  onOpenSubmit: () => void;
  onOpenProfile: () => void;
  onOpenMap: () => void;
  onOpenSettings?: () => void;
  onGoHome: () => void;
  onSelectStage: (stageId: number) => void;
  currentStageId: number;
  isInGame: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  progress,
  profile,
  onOpenAchievements,
  onOpenTeacherDashboard,
  onOpenSubmit,
  onOpenProfile,
  onOpenMap,
  onOpenSettings,
  onGoHome,
  onSelectStage,
  currentStageId,
  isInGame,
}) => {
  const [isMuted, setIsMuted] = useState(soundManager.getMuted());
  const [bgmMode, setBgmMode] = useState(soundManager.getBgmMode());

  React.useEffect(() => {
    const unsub = soundManager.subscribe(() => {
      setIsMuted(soundManager.getMuted());
      setBgmMode(soundManager.getBgmMode());
    });
    return () => unsub();
  }, []);

  const handleToggleMute = () => {
    const next = soundManager.toggleMute();
    setIsMuted(next);
  };

  const handleToggleBgmMode = () => {
    const nextMode = bgmMode === 'bit' ? 'original' : 'bit';
    soundManager.setBgmMode(nextMode);
    soundManager.playClick();
  };

  // Rank title by XP
  let rankTitle = 'Iniciante';
  if (progress.xp >= 600) rankTitle = 'Mestre SENAI';
  else if (progress.xp >= 400) rankTitle = 'Analista';
  else if (progress.xp >= 200) rankTitle = 'Operador';
  else if (progress.xp >= 100) rankTitle = 'Júnior';

  const xpPercent = Math.min(100, Math.round((progress.xp / 800) * 100));

  return (
    <header className="w-full bg-[#101B35]/95 backdrop-blur-md border-b border-[#213556] sticky top-0 z-40 px-3 sm:px-6 py-2 transition">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        
        {/* Left: Videogame Logo + In-Game Stage Switcher */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundManager.playClick();
              onGoHome();
            }}
            className="flex items-center gap-2.5 group text-left transition active:scale-95"
            title="Voltar à Tela Inicial"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#EF4444] via-[#FF9F1C] to-[#2563EB] border-2 border-[#FFD166] flex items-center justify-center font-black text-white text-base shadow-[0_2px_0_#7F1D1D] group-hover:scale-105 transition font-mono">
              S
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-[#FFD166] text-xs sm:text-sm tracking-wide font-mono uppercase drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                  SUPER SENAI BROS
                </span>
                <span className="text-[9px] bg-[#172747] text-[#22D3EE] px-1.5 py-0.2 rounded border border-[#334E77] font-mono hidden sm:inline font-bold">
                  EXCEL
                </span>
              </div>
              <span className="text-[10px] text-[#22C55E] block font-mono font-bold tracking-tight">
                EXCEL WORLD • ODISSÉIA
              </span>
            </div>
          </button>

          {/* In-Game Stage Navigator */}
          {isInGame && (
            <div className="hidden lg:flex items-center gap-1 ml-2 pl-3 border-l border-[#213556]">
              {LEVEL_1_STAGES.map((st) => {
                const isCurrent = st.id === currentStageId;
                const isUnlocked = st.id <= progress.highestUnlockedStageId;
                const isCompleted = progress.completedStages.includes(st.id);

                return (
                  <button
                    key={st.id}
                    disabled={!isUnlocked}
                    onClick={() => {
                      soundManager.playClick();
                      onSelectStage(st.id);
                    }}
                    title={`${st.title} (${isCompleted ? 'Concluída' : isUnlocked ? 'Desbloqueada' : 'Bloqueada'})`}
                    className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition flex items-center justify-center ${
                      isCurrent
                        ? 'bg-[#22C55E] text-[#0F172A] ring-2 ring-[#86EFAC] shadow-md font-black'
                        : isCompleted
                        ? 'bg-[#172747] text-[#22C55E] border border-[#22C55E]/40 hover:bg-[#213556]'
                        : isUnlocked
                        ? 'bg-[#172747] text-[#CBD5E1] hover:bg-[#213556] border border-[#334E77]'
                        : 'bg-[#101B35] text-slate-600 cursor-not-allowed border border-[#172747]'
                    }`}
                  >
                    {isCompleted ? '✓' : st.id}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Center / Right: Student Badge, XP Gauge, Coins & Clean Action Controls */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-3">
          
          {/* XP Progress Gauge */}
          <div className="hidden md:flex flex-col items-end w-32 sm:w-36">
            <div className="flex items-center justify-between w-full text-[10px] font-mono text-[#CBD5E1] mb-0.5">
              <span className="text-[#22D3EE] font-bold">{rankTitle}</span>
              <span>{progress.xp} XP</span>
            </div>
            <div className="w-full h-2 bg-[#172747] rounded-full overflow-hidden border border-[#334E77]">
              <div
                className="h-full bg-gradient-to-r from-[#22C55E] via-[#22D3EE] to-[#2563EB] transition-all duration-500"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
          </div>

          {/* Moedas Counter (#FFD166) */}
          <div
            className="flex items-center gap-1.5 px-3 py-1 bg-[#172747] border border-[#FFD166]/50 rounded-xl text-xs font-mono font-extrabold text-[#FFD166] shadow-sm animate-coin-shine"
            title="Moedas Coletadas"
          >
            <span>🪙</span>
            <span>{progress.coins}</span>
          </div>

          {/* Student Profile Card Pill */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenProfile();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#172747] hover:bg-[#213556] border border-[#334E77] rounded-xl text-xs text-[#F8FAFC] transition active:scale-95"
            title="Identificação do Aluno"
          >
            <User className="w-3.5 h-3.5 text-[#22D3EE]" />
            <span className="max-w-[100px] truncate font-semibold">
              {profile?.name ? profile.name.split(' ')[0] : 'Identificar'}
            </span>
          </button>

          {/* Overworld Map Button (#2563EB) */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenMap();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white border border-[#60A5FA] rounded-xl text-xs font-bold transition shadow-sm active:scale-95"
            title="Abrir Mapa dos Mundos"
          >
            <Map className="w-4 h-4 text-[#93C5FD]" />
            <span className="hidden sm:inline">Mapa</span>
          </button>

          {/* Conquistas (Roxo #8B5CF6) */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenAchievements();
            }}
            className="p-1.5 bg-[#172747] hover:bg-[#8B5CF6]/30 border border-[#8B5CF6]/50 rounded-xl text-[#FFD166] transition active:scale-95"
            title="Conquistas & Medalhas"
          >
            <Trophy className="w-4 h-4" />
          </button>

          {/* Sound Mute Toggle */}
          <button
            onClick={handleToggleMute}
            className="p-1.5 bg-[#172747] hover:bg-[#213556] border border-[#334E77] rounded-xl text-[#CBD5E1] transition active:scale-95"
            title={isMuted ? 'Ativar Sons' : 'Silenciar Sons'}
            aria-label="Controle de Som"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-[#EF4444]" /> : <Volume2 className="w-4 h-4 text-[#22C55E]" />}
          </button>

          {/* Audio Track Selector: 8-Bit vs Original Rock */}
          <button
            onClick={handleToggleBgmMode}
            className={`px-2 py-1 rounded-xl text-[11px] font-mono font-bold flex items-center gap-1 border transition active:scale-95 ${
              bgmMode === 'original'
                ? 'bg-[#FF9F1C]/20 border-[#FF9F1C] text-[#FFD166]'
                : 'bg-[#22C55E]/20 border-[#22C55E] text-[#22C55E]'
            }`}
            title={`Trilha sonora Carry on Wayward Son: ${
              bgmMode === 'original' ? 'Versão Original (Rock Studio)' : 'Versão 8-Bit (Arcade Chiptune)'
            }`}
          >
            <span>{bgmMode === 'original' ? '🎸' : '👾'}</span>
            <span className="hidden md:inline font-sans text-[10px]">
              {bgmMode === 'original' ? 'Rock' : '8-Bit'}
            </span>
          </button>

          {/* Settings Modal Button */}
          {onOpenSettings && (
            <button
              onClick={() => {
                soundManager.playClick();
                onOpenSettings();
              }}
              className="p-1.5 bg-[#172747] hover:bg-[#213556] border border-[#334E77] rounded-xl text-[#CBD5E1] hover:text-white transition active:scale-95"
              title="Configurações de Áudio & Volume"
              aria-label="Configurações de Áudio"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}

          {/* Teacher Dashboard Button (Neutral Surface) */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenTeacherDashboard();
            }}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-[#172747] hover:bg-[#213556] border border-[#334E77] rounded-xl text-[#CBD5E1] text-xs font-semibold transition active:scale-95"
            title="Acessar Painel do Professor"
          >
            <GraduationCap className="w-4 h-4 text-[#22D3EE]" />
            <span>Professor</span>
          </button>

          {/* ENTREGAR ATIVIDADE (Ciano #0284C7 / #22D3EE) */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenSubmit();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 btn-game btn-game-cyan text-xs font-bold shadow-md active:scale-95"
            title="Entregar Atividade ao Professor (Google Forms)"
          >
            <Send className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">ENTREGAR</span>
          </button>

        </div>

      </div>
    </header>
  );
};
