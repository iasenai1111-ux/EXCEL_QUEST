import React from 'react';
import { GameProgress, StudentProfile } from '../types/game';
import { LEVEL_1_STAGES } from '../data/stages';
import { soundManager } from '../utils/audio';
import { Play, RotateCcw, HelpCircle, Trophy, GraduationCap, Send, ShieldCheck, Sparkles, MapPin, CheckCircle2, Settings, Film, Music } from 'lucide-react';

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
  profile
}) => {
  const hasSavedProgress = progress.completedStages.length > 0 || progress.xp > 0;

  return (
    <div className="relative min-h-[calc(100vh-60px)] flex flex-col items-center justify-center p-4 sm:p-6 text-center select-none overflow-hidden">
      
      {/* Background Decor Ambient Lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Hero Container */}
      <div className="relative z-10 max-w-2xl w-full flex flex-col items-center">
        
        {/* SENAI Institutional Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-blue-950 to-cyan-950 border border-cyan-500/40 rounded-full text-xs text-cyan-300 font-mono shadow-md mb-4">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>SENAI • EDUCAÇÃO PROFISSIONAL & TECNOLÓGICA</span>
        </div>

        {/* Game Title */}
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-cyan-400 drop-shadow-md">
          EXCEL QUEST
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl font-bold text-amber-400 mt-2 tracking-wide font-sans">
          A Aventura das Fórmulas
        </p>

        <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-lg leading-relaxed">
          O primeiro videogame interativo que ensina planilhas na prática: explore mundos 2D, decifre terminais com fórmulas reais e domine o Microsoft Excel!
        </p>

        {/* Student Credential Pill */}
        <div className="mt-5 p-3 bg-slate-900/80 backdrop-blur border border-slate-700/80 rounded-2xl flex items-center justify-between gap-4 w-full max-w-md shadow-lg">
          <div className="flex items-center gap-2.5 text-left">
            <div className="p-2 bg-cyan-950 rounded-xl border border-cyan-500/40 text-cyan-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                Aluno Conectado:
              </span>
              <strong className="text-xs text-white">
                {profile?.name || 'Aventureiro não identificado'}
              </strong>
              <span className="text-[11px] text-cyan-300 block font-mono">
                {profile?.className || 'Clique para definir turma'}
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onOpenProfile();
            }}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl text-xs font-semibold text-slate-200 transition shrink-0"
          >
            {profile ? 'Alterar' : 'Identificar'}
          </button>
        </div>

        {/* Main Action Buttons */}
        <div className="w-full max-w-md space-y-3 mt-6">
          
          {/* JOGAR */}
          <button
            onClick={() => {
              soundManager.playSuccess();
              onPlay();
            }}
            className="w-full py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-base sm:text-lg rounded-2xl shadow-xl shadow-emerald-950/50 flex items-center justify-center gap-3 transition transform active:scale-95 border-2 border-emerald-400/50 group"
          >
            <Play className="w-6 h-6 fill-white group-hover:scale-110 transition" />
            <span>JOGAR NOVO JOGO</span>
          </button>

          {/* CONTINUAR */}
          {hasSavedProgress && (
            <button
              onClick={() => {
                soundManager.playSuccess();
                onContinue();
              }}
              className="w-full py-3.5 bg-gradient-to-r from-cyan-700 via-blue-700 to-cyan-800 hover:from-cyan-600 hover:to-blue-600 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-lg border border-cyan-400/50 flex items-center justify-center gap-2.5 transition active:scale-95"
            >
              <RotateCcw className="w-5 h-5 text-cyan-200" />
              <span>CONTINUAR (Fase {progress.highestUnlockedStageId} • {progress.xp} XP)</span>
            </button>
          )}

          {/* MAPA DOS MUNDOS */}
          {onOpenMap && (
            <button
              onClick={() => {
                soundManager.playClick();
                onOpenMap();
              }}
              className="w-full py-3 bg-gradient-to-r from-blue-900 to-indigo-900 hover:from-blue-800 hover:to-indigo-800 text-cyan-200 font-bold text-xs sm:text-sm rounded-xl border border-cyan-500/40 flex items-center justify-center gap-2 transition active:scale-95 shadow-md"
            >
              <MapPin className="w-4 h-4 text-cyan-400" />
              <span>MAPA DOS MUNDOS (SUPER MARIO STYLE)</span>
            </button>
          )}

          {/* Secondary Buttons Row */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              onClick={() => {
                soundManager.playClick();
                onHowToPlay();
              }}
              className="py-3 px-3 bg-slate-800/90 hover:bg-slate-700 border border-slate-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition active:scale-95"
            >
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              <span>COMO JOGAR</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                onAchievements();
              }}
              className="py-3 px-3 bg-slate-800/90 hover:bg-slate-700 border border-slate-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition active:scale-95"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>MINHAS CONQUISTAS</span>
            </button>
          </div>

          {/* Teacher and Delivery Bar */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              onClick={() => {
                soundManager.playClick();
                onTeacherDashboard();
              }}
              className="py-2.5 px-3 bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-500/40 text-indigo-200 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition"
            >
              <GraduationCap className="w-4 h-4 text-indigo-400" />
              <span>PAINEL DO PROFESSOR</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                onOpenSubmit();
              }}
              className="py-2.5 px-3 bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/40 text-emerald-200 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition"
            >
              <Send className="w-4 h-4 text-emerald-400" />
              <span>ENTREGAR ATIVIDADE</span>
            </button>
          </div>

          {/* Audio Settings & Trailer Bar */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            {onOpenSettings && (
              <button
                onClick={() => {
                  soundManager.playClick();
                  onOpenSettings();
                }}
                className="py-2.5 px-3 bg-slate-800/80 hover:bg-slate-700 border border-cyan-500/40 text-cyan-200 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition active:scale-95 shadow-sm"
              >
                <Settings className="w-4 h-4 text-cyan-400" />
                <span>CONFIGURAÇÕES DE ÁUDIO</span>
              </button>
            )}

            {onOpenTrailer && (
              <button
                onClick={() => {
                  soundManager.playClick();
                  onOpenTrailer();
                }}
                className="py-2.5 px-3 bg-purple-950/60 hover:bg-purple-900/80 border border-purple-500/40 text-purple-200 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition active:scale-95 shadow-sm"
              >
                <Film className="w-4 h-4 text-purple-400" />
                <span>TRAILER DO JOGO</span>
              </button>
            )}
          </div>

        </div>

        {/* 5 Stages Preview Strip */}
        <div className="mt-8 pt-6 border-t border-slate-800 w-full">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest block mb-3">
            Nível 1 — Roteiro das 5 Missões:
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-left">
            {LEVEL_1_STAGES.map((st) => {
              const isDone = progress.completedStages.includes(st.id);

              return (
                <div
                  key={st.id}
                  className={`p-2.5 rounded-xl border text-xs space-y-1 transition ${
                    isDone
                      ? 'bg-emerald-950/30 border-emerald-500/50'
                      : 'bg-slate-900/40 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-slate-400 font-bold">FASE {st.id}</span>
                    {isDone ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <span className="text-[9px] text-slate-500 font-mono">100 XP</span>
                    )}
                  </div>
                  <strong className="block text-slate-200 font-bold truncate text-[11px]">
                    {st.title.split('—')[1]?.trim() || st.title}
                  </strong>
                  <span className="text-[10px] text-cyan-400 block font-mono">
                    {st.challenge.operationName}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Discreet Instructor Attribution Credit */}
        <div className="mt-8 pt-4 border-t border-slate-800/80 w-full flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-slate-300 font-medium">
              Instrutor de Formação Profissional do SENAI-SP Rafael Pereira
            </span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="text-slate-400">Escola SENAI “Orlando Laviero Ferraiuolo”</span>
          </div>
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/30">
            Metodologia Ativa SENAI
          </span>
        </div>

      </div>

    </div>
  );
};
