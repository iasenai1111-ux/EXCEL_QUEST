import React, { useState } from 'react';
import { GameProgress, StudentProfile } from '../types/game';
import { LEVEL_1_STAGES } from '../data/stages';
import { soundManager } from '../utils/audio';
import { Volume2, VolumeX, Trophy, GraduationCap, Send, User, ChevronRight, Home, Map, Settings } from 'lucide-react';

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
  isInGame
}) => {
  const [isMuted, setIsMuted] = useState(soundManager.getMuted());

  React.useEffect(() => {
    const unsub = soundManager.subscribe(() => {
      setIsMuted(soundManager.getMuted());
    });
    return () => unsub();
  }, []);

  const handleToggleMute = () => {
    const next = soundManager.toggleMute();
    setIsMuted(next);
  };

  // Compute Rank Title based on XP
  let rankTitle = 'Iniciante';
  if (progress.xp >= 600) rankTitle = 'Mestre SENAI';
  else if (progress.xp >= 400) rankTitle = 'Analista de Dados';
  else if (progress.xp >= 200) rankTitle = 'Operador de Fórmulas';
  else if (progress.xp >= 100) rankTitle = 'Aventureiro Júnior';

  // XP Progress towards next level (max 800)
  const xpPercent = Math.min(100, Math.round((progress.xp / 800) * 100));

  return (
    <header className="w-full bg-[#0d162d]/95 backdrop-blur-md border-b border-slate-700/80 sticky top-0 z-40 px-3 sm:px-6 py-2.5 transition">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        
        {/* Left Brand & Home */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundManager.playClick();
              onGoHome();
            }}
            className="flex items-center gap-2 group text-left"
            title="Voltar à Tela Inicial"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#107c41] to-[#0a522a] border border-emerald-400/50 flex items-center justify-center font-black text-white text-base shadow-lg group-hover:scale-105 transition">
              X
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-white text-sm sm:text-base tracking-wide group-hover:text-emerald-400 transition">
                  EXCEL QUEST
                </span>
                <span className="text-[10px] bg-cyan-950 text-cyan-300 px-1.5 py-0.2 rounded border border-cyan-500/40 font-mono hidden sm:inline">
                  SENAI
                </span>
              </div>
              <span className="text-[11px] text-slate-400 block -mt-0.5">
                A Aventura das Fórmulas
              </span>
            </div>
          </button>

          {/* Quick Stage Indicator (1-5) */}
          {isInGame && (
            <div className="hidden md:flex items-center gap-1 ml-3 pl-3 border-l border-slate-700">
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
                        ? 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-300 shadow-md'
                        : isCompleted
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/60'
                        : isUnlocked
                        ? 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-600'
                        : 'bg-slate-900/60 text-slate-600 cursor-not-allowed border border-slate-800'
                    }`}
                  >
                    {isCompleted ? '✓' : st.id}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Center / Right Player Stats & XP Bar */}
        <div className="flex items-center flex-wrap gap-2.5 sm:gap-4">
          
          {/* XP Progress Bar */}
          <div className="hidden lg:flex flex-col items-end w-36">
            <div className="flex items-center justify-between w-full text-[10px] font-mono text-slate-400 mb-0.5">
              <span className="text-emerald-400 font-bold">{rankTitle}</span>
              <span>{progress.xp} XP</span>
            </div>
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
          </div>

          {/* Coins Counter */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-950/40 border border-amber-500/40 rounded-xl text-xs font-mono font-bold text-amber-300 shadow-inner">
            <span>🪙</span>
            <span>{progress.coins}</span>
          </div>

          {/* Student Profile Badge */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenProfile();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800/80 hover:bg-slate-700 border border-slate-600 rounded-xl text-xs text-slate-200 transition"
            title="Editar Identificação do Aluno"
          >
            <User className="w-3.5 h-3.5 text-cyan-400" />
            <span className="max-w-[100px] truncate font-medium">
              {profile?.name ? profile.name.split(' ')[0] : 'Identificar'}
            </span>
          </button>

          {/* Overworld Map Button */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenMap();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-500/50 rounded-xl text-cyan-200 text-xs font-semibold transition"
            title="Abrir Mapa dos Mundos (Super Mario Style)"
          >
            <Map className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Mapa</span>
          </button>

          {/* Medals & Conquistas */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenAchievements();
            }}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl text-amber-300 transition"
            title="Conquistas & Medalhas"
          >
            <Trophy className="w-4 h-4" />
          </button>

          {/* Sound Toggle */}
          <button
            onClick={handleToggleMute}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl text-slate-300 transition"
            title={isMuted ? 'Ativar Sons' : 'Silenciar Sons'}
            aria-label="Controle de Som"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Settings Modal Button */}
          {onOpenSettings && (
            <button
              onClick={() => {
                soundManager.playClick();
                onOpenSettings();
              }}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl text-cyan-300 hover:text-cyan-200 transition"
              title="Configurações de Áudio (Carry on Wayward Son) & Jogo"
              aria-label="Configurações de Áudio"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}

          {/* Teacher Dashboard Button */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenTeacherDashboard();
            }}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-indigo-950/70 hover:bg-indigo-900 border border-indigo-500/50 rounded-xl text-indigo-200 text-xs font-semibold transition"
            title="Acessar Painel do Professor"
          >
            <GraduationCap className="w-4 h-4 text-indigo-400" />
            <span>Docente</span>
          </button>

          {/* ENTREGAR ATIVIDADE Button */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenSubmit();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs rounded-xl shadow-md transition active:scale-95"
            title="Entregar Atividade ao Professor (Google Forms)"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">ENTREGAR ATIVIDADE</span>
            <span className="sm:hidden">Entregar</span>
          </button>

        </div>

      </div>
    </header>
  );
};
