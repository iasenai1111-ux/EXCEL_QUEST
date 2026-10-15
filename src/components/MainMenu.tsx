import React from 'react';
import { GameProgress, StudentProfile } from '../types/game';
import { LEVEL_1_STAGES } from '../data/stages';
import { soundManager } from '../utils/audio';
import { ParallaxGameScene } from './ParallaxGameScene';
import {
  Play,
  RotateCcw,
  HelpCircle,
  Trophy,
  GraduationCap,
  Send,
  UserCheck,
  MapPin,
  CheckCircle2,
  Settings,
  Film,
  Sparkles,
  Shield,
  Layers,
  FileSpreadsheet
} from 'lucide-react';

interface MainMenuProps {
  onPlay: () => void;
  onContinue: () => void;
  onHowToPlay: () => void;
  onAchievements: () => void;
  onTeacherDashboard: () => void;
  onOpenSubmit: () => void;
  onOpenProfile: () => void;
  onOpenMap?: () => void;
  onOpenSettings?: () => void;
  onOpenTrailer?: () => void;
  progress: GameProgress;
  profile: StudentProfile | null;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onPlay,
  onContinue,
  onHowToPlay,
  onAchievements,
  onTeacherDashboard,
  onOpenSubmit,
  onOpenProfile,
  onOpenMap,
  onOpenSettings,
  onOpenTrailer,
  progress,
  profile,
}) => {
  const hasSavedProgress = progress.completedStages.length > 0 || progress.xp > 0;
  const completedCount = progress.completedStages.length;
  const totalStages = LEVEL_1_STAGES.length;

  return (
    <div className="relative w-full min-h-[calc(100vh-68px)] bg-[#101B35] flex flex-col justify-between p-3 sm:p-6 select-none overflow-x-hidden">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-[#2563EB]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-[#22C55E]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Dynamic 2-Column Videogame Layout */}
      <div className="relative z-10 max-w-7xl mx-auto w-full my-auto py-2 sm:py-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          
          {/* LEFT COLUMN: 2D Platformer Animated Diorama Scene */}
          <div className="lg:col-span-6 flex flex-col items-center">
            
            {/* The 2D World Viewport Frame */}
            <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-3xl overflow-hidden border-2 border-[#334E77] shadow-[0_12px_36px_rgba(16,27,53,0.7)] bg-[#172747]">
              
              {/* Animated Canvas */}
              <ParallaxGameScene className="w-full h-full" />

              {/* In-Diorama Top Overlay Badges */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                <div className="flex items-center gap-2 px-3 py-1 bg-[#101B35]/85 backdrop-blur-md rounded-xl border border-[#334E77] text-[11px] font-mono font-bold text-[#F8FAFC] shadow">
                  <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
                  <span>MUNDO 1: FÁBRICA INTELIGENTE</span>
                </div>

                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#FFD166]/20 border border-[#FFD166]/60 rounded-xl text-[11px] font-mono font-black text-[#FFD166] backdrop-blur-md shadow">
                  <span className="animate-spin text-xs">🪙</span>
                  <span>COLETE MOEDAS</span>
                </div>
              </div>

              {/* In-Diorama Bottom Gameplay Feature Chips */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none text-[10px] font-mono text-[#CBD5E1]">
                <span className="px-2.5 py-1 bg-[#101B35]/80 backdrop-blur rounded-lg border border-[#334E77]/80">
                  ⌨️ Setas / WASD • [E] Terminal
                </span>
                <span className="px-2.5 py-1 bg-[#101B35]/80 backdrop-blur rounded-lg border border-[#334E77]/80 text-[#22D3EE] font-bold">
                  ★ Fórmulas Reais Excel
                </span>
              </div>
            </div>

            {/* Quick 10 Stages Progress Visual Pill Strip */}
            <div className="w-full mt-4 p-3.5 bg-[#172747] border border-[#334E77] rounded-2xl shadow-md">
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className="text-[#CBD5E1] font-semibold flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#22D3EE]" />
                  <span>Progresso das 10 Missões:</span>
                </span>
                <span className="text-[#FFD166] font-bold">
                  {completedCount} / {totalStages} Concluídas
                </span>
              </div>

              <div className="grid grid-cols-10 gap-0.5 sm:gap-1.5">
                {LEVEL_1_STAGES.map((st) => {
                  const isDone = progress.completedStages.includes(st.id);
                  const isCurrent = st.id === progress.highestUnlockedStageId;
                  
                  return (
                    <div
                      key={st.id}
                      title={`Fase ${st.id}: ${st.title} (${st.challenge.operationName})`}
                      className={`h-6 sm:h-7 rounded-md sm:rounded-lg flex items-center justify-center font-mono text-[10px] font-bold transition border ${
                        isDone
                          ? 'bg-[#22C55E]/20 text-[#22C55E] border-[#22C55E]/60 shadow-sm'
                          : isCurrent
                          ? 'bg-[#2563EB]/30 text-[#60A5FA] border-[#2563EB] animate-pulse ring-1 ring-[#60A5FA]'
                          : 'bg-[#101B35] text-slate-500 border-[#334E77]'
                      }`}
                    >
                      {isDone ? '✓' : st.id}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Videogame Title, Student ID & Tactile Action Center */}
          <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left">
            
            {/* SENAI Institutional Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#172747] border border-[#334E77] rounded-full text-xs text-[#22D3EE] font-mono shadow-sm mb-3">
              <span className="w-2 h-2 rounded-full bg-[#22D3EE] animate-ping" />
              <span className="font-semibold tracking-wider">SENAI-SP • EDUCAÇÃO PROFISSIONAL</span>
            </div>

            {/* Videogame Title Block */}
            <div className="mb-4">
              {/* Colorful 3D Arcade Lettering: SUPER SENAI BROS. */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-1 sm:gap-1.5 mb-2">
                <span className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center font-black text-white bg-[#EF4444] rounded-xl border-2 border-[#991B1B] shadow-[0_3px_0_#7F1D1D] font-mono text-base">
                  S
                </span>
                <span className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center font-black text-[#FFD166] bg-[#2563EB] rounded-xl border-2 border-[#1E3A8A] shadow-[0_3px_0_#172554] font-mono text-base">
                  U
                </span>
                <span className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center font-black text-white bg-[#FF9F1C] rounded-xl border-2 border-[#9A3412] shadow-[0_3px_0_#7C2D12] font-mono text-base">
                  P
                </span>
                <span className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center font-black text-white bg-[#22C55E] rounded-xl border-2 border-[#166534] shadow-[0_3px_0_#14532D] font-mono text-base">
                  E
                </span>
                <span className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center font-black text-white bg-[#EF4444] rounded-xl border-2 border-[#991B1B] shadow-[0_3px_0_#7F1D1D] font-mono text-base">
                  R
                </span>
                <div className="ml-2 px-3 py-1 bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] rounded-xl border border-[#60A5FA] shadow-[0_3px_0_#172554] flex items-center gap-1">
                  <span className="text-xs sm:text-sm font-black text-white tracking-widest font-mono">
                    SENAI BROS
                  </span>
                </div>
              </div>

              {/* Main Game Logo: EXCEL WORLD */}
              <div className="relative inline-block">
                <h1 className="text-3xl min-[400px]:text-4xl sm:text-6xl lg:text-6xl font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-b from-[#FFFBEB] via-[#FFD166] to-[#FF9F1C] drop-shadow-[0_4px_0_#78350F] font-mono uppercase">
                  EXCEL WORLD
                </h1>
                <div className="absolute -top-3 -right-1 sm:-right-8 rotate-12">
                  <span className="text-[10px] sm:text-xs font-black bg-[#22C55E] text-[#0F172A] px-2.5 py-0.5 rounded-full border-2 border-white shadow-lg flex items-center gap-1 animate-bounce">
                    ★ 10 FASES!
                  </span>
                </div>
              </div>

              {/* Subtitle */}
              <div className="mt-2 flex items-center justify-center lg:justify-start gap-2 text-xs sm:text-sm font-bold text-[#FFD166]">
                <span>🍄</span>
                <span className="tracking-wide">A Grande Odisséia das Planilhas • Microsoft Excel</span>
                <span>⭐</span>
              </div>
            </div>

            {/* Student ID Card */}
            <div className="w-full max-w-lg mb-5 p-3.5 bg-[#172747] border border-[#334E77] rounded-2xl shadow-lg flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-xl bg-[#213556] border border-[#3B5A8C] text-[#22D3EE] flex items-center justify-center shrink-0">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-[#CBD5E1] uppercase tracking-wider block font-semibold">
                    Aluno Registrado:
                  </span>
                  <strong className="text-sm text-[#F8FAFC] block truncate max-w-[220px]">
                    {profile?.name || 'Aventureiro não identificado'}
                  </strong>
                  <span className="text-xs text-[#22D3EE] font-mono block">
                    {profile?.className || 'Clique para definir sua turma'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  soundManager.playClick();
                  onOpenProfile();
                }}
                className="px-3.5 py-2 btn-game btn-game-surface text-xs font-bold text-[#F8FAFC] shrink-0"
              >
                {profile ? 'Alterar' : 'Identificar'}
              </button>
            </div>

            {/* Tactical Game Buttons Dock */}
            <div className="w-full max-w-lg space-y-3">
              
              {/* PRIMARY ACTION: JOGAR NOVO JOGO (Vibrant Green) */}
              <button
                onClick={() => {
                  soundManager.playVictory();
                  onPlay();
                }}
                className="w-full py-4 px-6 btn-game btn-game-play text-base sm:text-lg flex items-center justify-center gap-3 group"
              >
                <Play className="w-6 h-6 fill-white group-hover:scale-110 transition shrink-0" />
                <span>JOGAR NOVO JOGO</span>
              </button>

              {/* SECONDARY ACTION: CONTINUAR (Royal Blue) */}
              {hasSavedProgress && (
                <button
                  onClick={() => {
                    soundManager.playSuccess();
                    onContinue();
                  }}
                  className="w-full py-3.5 px-5 btn-game btn-game-continue text-sm sm:text-base flex items-center justify-center gap-2.5"
                >
                  <RotateCcw className="w-5 h-5 text-[#93C5FD] shrink-0" />
                  <span>CONTINUAR (Fase {progress.highestUnlockedStageId} • {progress.xp} XP)</span>
                </button>
              )}

              {/* COMPACT ACTIONS GRID: Clean 2x2 layout */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                
                {/* MAPA DOS MUNDOS */}
                {onOpenMap && (
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      onOpenMap();
                    }}
                    className="py-3 px-3 btn-game btn-game-map text-xs flex items-center justify-center gap-2"
                  >
                    <MapPin className="w-4 h-4 text-[#93C5FD] shrink-0" />
                    <span>MAPA DOS MUNDOS</span>
                  </button>
                )}

                {/* CONQUISTAS */}
                <button
                  onClick={() => {
                    soundManager.playClick();
                    onAchievements();
                  }}
                  className="py-3 px-3 btn-game btn-game-achievements text-xs flex items-center justify-center gap-2"
                >
                  <Trophy className="w-4 h-4 text-[#FFD166] shrink-0" />
                  <span>CONQUISTAS</span>
                </button>

                {/* ENTREGAR ATIVIDADE */}
                <button
                  onClick={() => {
                    soundManager.playClick();
                    onOpenSubmit();
                  }}
                  className="py-3 px-3 btn-game btn-game-cyan text-xs flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4 text-white shrink-0" />
                  <span>ENTREGAR ATIVIDADE</span>
                </button>

                {/* PAINEL DO PROFESSOR (Neutral Surface Dark Blue) */}
                <button
                  onClick={() => {
                    soundManager.playClick();
                    onTeacherDashboard();
                  }}
                  className="py-3 px-3 btn-game btn-game-surface text-xs flex items-center justify-center gap-2"
                >
                  <GraduationCap className="w-4 h-4 text-[#CBD5E1] shrink-0" />
                  <span>PROFESSOR</span>
                </button>
              </div>

              {/* COMPACT UTILITY BAR: Como Jogar, Configurações & Trailer */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                <button
                  onClick={() => {
                    soundManager.playClick();
                    onHowToPlay();
                  }}
                  className="py-2.5 px-2 btn-game btn-game-surface text-[11px] flex items-center justify-center gap-1.5"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-[#22D3EE]" />
                  <span>Como Jogar</span>
                </button>

                {onOpenSettings && (
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      onOpenSettings();
                    }}
                    className="py-2.5 px-2 btn-game btn-game-surface text-[11px] flex items-center justify-center gap-1.5"
                  >
                    <Settings className="w-3.5 h-3.5 text-[#CBD5E1]" />
                    <span>Configurações</span>
                  </button>
                )}

                {onOpenTrailer && (
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      onOpenTrailer();
                    }}
                    className="py-2.5 px-2 btn-game btn-game-surface text-[11px] flex items-center justify-center gap-1.5"
                  >
                    <Film className="w-3.5 h-3.5 text-[#FF9F1C]" />
                    <span>Trailer</span>
                  </button>
                )}
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* Discreet Institutional Bottom Attribution */}
      <footer className="relative z-10 max-w-7xl mx-auto w-full pt-4 mt-4 border-t border-[#334E77]/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#CBD5E1]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
          <span className="font-medium text-[#F8FAFC]">
            Instrutor de Formação Profissional do SENAI-SP Rafael Pereira
          </span>
          <span className="hidden sm:inline text-slate-500">•</span>
          <span className="text-[#CBD5E1]">Escola SENAI “Orlando Laviero Ferraiuolo”</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-[#22D3EE] bg-[#172747] px-2.5 py-0.5 rounded-lg border border-[#334E77]">
            Microsoft Excel • Metodologia SENAI
          </span>
        </div>
      </footer>

    </div>
  );
};
