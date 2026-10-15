import React, { useState, useEffect } from 'react';
import { soundManager } from '../utils/audio';
import { Play, Pause, ChevronRight, ChevronLeft, Film, Sparkles, X, Volume2, Monitor, Trophy, Swords, CheckCircle2 } from 'lucide-react';

interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlayGame: () => void;
}

interface TrailerScene {
  id: number;
  tagline: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  badge: string;
  gradient: string;
  features: string[];
}

const TRAILER_SCENES: TrailerScene[] = [
  {
    id: 1,
    tagline: 'O DESAFIO COMEÇA NO SENAI',
    title: 'SUPER SENAI BROS: EXCEL WORLD',
    subtitle: 'Um videogame Super Mario style para dominar planilhas!',
    description: 'No laboratório do SENAI, o banco de dados industrial foi desconfigurado. O SENAIZINHO foi convocado para uma missão épica de exploração e cálculos automatizados!',
    icon: '⚡',
    badge: 'MISSÃO SENAI',
    gradient: 'from-blue-900 via-indigo-950 to-slate-950',
    features: ['Gráficos 2D retrô', 'Personagem SENAIZINHO original', 'Trilha sonora Carry on Wayward Son (8-Bit & Original)']
  },
  {
    id: 2,
    tagline: 'JOGABILIDADE DINÂMICA TIPO SUPER MARIO',
    title: 'Corra, Salte e Supere Obstáculos!',
    subtitle: 'Ação de plataforma 2D em 60 FPS direto no navegador',
    description: 'Controle o SENAIZINHO com WASD ou Setas. Corra segurando Shift, esmague robôs defeituosos com pulos estilo Mario, cabeceie blocos de interrogação [?] e desvie de buracos perigosos!',
    icon: '🍄',
    badge: 'AÇÃO DE PLATAFORMA',
    gradient: 'from-amber-900 via-red-950 to-slate-950',
    features: ['Sistema de 3 Vidas (Cuidado para não dar Game Over!)', 'Tubos verdes e blocos misteriosos', 'Checkpoints de respawn']
  },
  {
    id: 3,
    tagline: 'PRIORIDADE MÁXIMA PEDAGÓGICA',
    title: 'Mini-Excel Interativo nos Terminais',
    subtitle: 'Aprenda fórmulas clicando ou digitando',
    description: 'Ao encontrar o terminal de cada fase, resolva a planilha real com validação matemática instantânea. Suporta fórmulas por clique nas células ou digitação direta!',
    icon: '📊',
    badge: 'MINI-EXCEL REAL',
    gradient: 'from-emerald-900 via-teal-950 to-slate-950',
    features: ['SOMA, SUBTRAÇÃO, MULTIPLICAÇÃO', 'Função =MÉDIA(), =SE() e Fórmulas Compostas', 'Dicas inteligentes em 3 níveis']
  },
  {
    id: 4,
    tagline: 'DIFICULDADE PROGRESSIVA REAL',
    title: '10 Fases com Desafios em Escala',
    subtitle: 'Fase 1 = 1 questão, até Fase 10 com 10 cálculos!',
    description: 'Conforme você avança pelos 10 mundos industriais do SENAI, o número de células a resolver aumenta: 1 na primeira fase, 2 na segunda... até o Supercomputador Central com 10 questões!',
    icon: '🏭',
    badge: '10 FASES COMPLETAS',
    gradient: 'from-cyan-900 via-blue-950 to-slate-950',
    features: ['Mercado, Depósito, Fábrica, Usina e Supercomputador', 'Bloqueio estrito de fases sem respostas certas', 'Geração de XLSX compatível com Excel do laboratório']
  },
  {
    id: 5,
    tagline: 'O GRANDE CLÍMAX ARCADE',
    title: 'Final Épico Estilo Street Fighter!',
    subtitle: 'YOU WIN! PERFECT! Conquiste seu Diploma SENAI',
    description: 'Ao zerar todas as 10 fases, encare a tela de vitória arcade com a icônica frase de lutador do SENAIZINHO, relatório completo de XP, download da planilha final e entrega direta via Google Forms!',
    icon: '🥊',
    badge: 'STREET FIGHTER ENDING',
    gradient: 'from-red-900 via-amber-950 to-slate-950',
    features: ['Retrato de lutador do SENAIZINHO', 'Frase de vitória lendária', 'Certificado oficial da Escola SENAI “Orlando Laviero Ferraiuolo”']
  }
];

export const TrailerModal: React.FC<TrailerModalProps> = ({
  isOpen,
  onClose,
  onPlayGame
}) => {
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Auto-advance scenes when playing
  useEffect(() => {
    if (!isOpen || !isPlaying) return;
    const timer = setInterval(() => {
      setCurrentSceneIdx((prev) => (prev + 1) % TRAILER_SCENES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [isOpen, isPlaying]);

  // Start BGM when trailer opens
  useEffect(() => {
    if (isOpen) {
      soundManager.startBGM();
    }
    return () => {
      // Don't kill audio if student continues to play
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const currentScene = TRAILER_SCENES[currentSceneIdx];

  const handleNext = () => {
    soundManager.playClick();
    setCurrentSceneIdx((prev) => (prev + 1) % TRAILER_SCENES.length);
  };

  const handlePrev = () => {
    soundManager.playClick();
    setCurrentSceneIdx((prev) => (prev - 1 + TRAILER_SCENES.length) % TRAILER_SCENES.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/95 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-gradient-to-b from-slate-900 via-slate-950 to-black border-4 border-amber-400 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Cinema Marquee Header */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-red-700 via-amber-600 to-red-700 text-white flex items-center justify-between border-b-2 border-amber-300">
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-yellow-300 animate-pulse" />
            <span className="font-mono text-xs sm:text-sm font-black tracking-widest uppercase">
              TRAILER OFICIAL • SUPER SENAI BROS: EXCEL WORLD
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono bg-black/40 px-2 py-0.5 rounded text-amber-200">
              CENA {currentSceneIdx + 1} DE {TRAILER_SCENES.length}
            </span>
            <button
              onClick={onClose}
              className="p-1 text-white/80 hover:text-white rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Cinematic Display Screen */}
        <div className={`p-6 sm:p-10 bg-gradient-to-br ${currentScene.gradient} relative min-h-[380px] sm:min-h-[440px] flex flex-col justify-between overflow-hidden transition-all duration-700`}>
          
          {/* Retro CRT Scanlines & Vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(0,0,0,0.7)_100%)] pointer-events-none" />
          <div className="absolute inset-0 bg-repeat bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none opacity-30" />

          {/* Top Tag & Badge */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="inline-block px-3 py-1 bg-amber-500/20 border border-amber-400/50 rounded-full text-xs font-mono font-bold tracking-widest text-amber-300 uppercase shadow-lg">
              {currentScene.badge}
            </div>

            <div className="flex items-center gap-1.5 text-xs text-cyan-300 font-mono bg-black/50 px-3 py-1 rounded-full border border-cyan-500/40">
              <Volume2 className="w-3.5 h-3.5" />
              <span>8-Bit Carry on Wayward Son</span>
            </div>
          </div>

          {/* Center Cinematic Content */}
          <div className="relative z-10 my-4 space-y-3">
            <div className="text-4xl sm:text-5xl drop-shadow-md">
              {currentScene.icon}
            </div>

            <span className="text-xs sm:text-sm font-mono tracking-widest text-amber-300 font-bold uppercase block">
              {currentScene.tagline}
            </span>

            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight drop-shadow-lg font-sans">
              {currentScene.title}
            </h2>

            <p className="text-sm sm:text-base font-semibold text-cyan-200">
              {currentScene.subtitle}
            </p>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-2xl bg-black/40 backdrop-blur-sm p-4 rounded-xl border border-white/10 shadow-inner">
              {currentScene.description}
            </p>

            {/* Feature Bullets */}
            <div className="flex flex-wrap gap-2 pt-2">
              {currentScene.features.map((feat, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 bg-white/10 border border-white/20 rounded-lg text-[11px] font-semibold text-white flex items-center gap-1.5"
                >
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  <span>{feat}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Scene Progress Indicators */}
          <div className="relative z-10 flex items-center justify-between pt-4 border-t border-white/10">
            <div className="flex items-center gap-2">
              {TRAILER_SCENES.map((sc, idx) => (
                <button
                  key={sc.id}
                  onClick={() => {
                    soundManager.playClick();
                    setCurrentSceneIdx(idx);
                  }}
                  className={`h-2.5 rounded-full transition-all ${
                    idx === currentSceneIdx
                      ? 'w-8 bg-amber-400'
                      : 'w-2.5 bg-white/30 hover:bg-white/60'
                  }`}
                  title={`Cena ${idx + 1}`}
                />
              ))}
            </div>

            {/* Trailer Playback Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="p-2 bg-black/60 hover:bg-black/90 text-white rounded-xl border border-white/20 transition active:scale-95"
                title="Cena Anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 bg-black/60 hover:bg-black/90 text-white rounded-xl border border-white/20 transition active:scale-95"
                title={isPlaying ? 'Pausar Trailer' : 'Reproduzir Trailer'}
              >
                {isPlaying ? <Pause className="w-4 h-4 text-amber-300" /> : <Play className="w-4 h-4 text-emerald-300" />}
              </button>

              <button
                onClick={handleNext}
                className="p-2 bg-black/60 hover:bg-black/90 text-white rounded-xl border border-white/20 transition active:scale-95"
                title="Próxima Cena"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Trailer Footer Actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-400 text-center sm:text-left">
            <span>Desenvolvido para alunos do <strong>SENAI-SP</strong> • Instrutor Rafael Pereira</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition"
            >
              Fechar Trailer
            </button>

            <button
              onClick={() => {
                soundManager.playSuccess();
                onClose();
                onPlayGame();
              }}
              className="flex-1 sm:flex-none px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 transition active:scale-95"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>JOGAR O SUPER SENAI BROS AGORA</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
