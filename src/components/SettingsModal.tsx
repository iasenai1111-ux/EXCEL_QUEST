import React, { useState, useEffect } from 'react';
import { soundManager } from '../utils/audio';
import {
  Settings,
  Volume2,
  VolumeX,
  Volume1,
  Music,
  Sparkles,
  RotateCcw,
  X,
  Sliders,
  CheckCircle2,
  Play,
  Pause,
  Disc3,
  Award
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [masterVol, setMasterVol] = useState<number>(soundManager.getMasterVolume());
  const [bgmVol, setBgmVol] = useState<number>(soundManager.getBGMVolume());
  const [sfxVol, setSfxVol] = useState<number>(soundManager.getSFXVolume());
  const [isMuted, setIsMuted] = useState<boolean>(soundManager.getMuted());
  const [bgmEnabled, setBgmEnabled] = useState<boolean>(soundManager.isBGMEnabled());
  const [sfxEnabled, setSfxEnabled] = useState<boolean>(soundManager.isSFXEnabled());
  const [isBgmPlaying, setIsBgmPlaying] = useState<boolean>(soundManager.isBGMPlaying());

  // Subscribe to changes in soundManager
  useEffect(() => {
    const syncState = () => {
      setMasterVol(soundManager.getMasterVolume());
      setBgmVol(soundManager.getBGMVolume());
      setSfxVol(soundManager.getSFXVolume());
      setIsMuted(soundManager.getMuted());
      setBgmEnabled(soundManager.isBGMEnabled());
      setSfxEnabled(soundManager.isSFXEnabled());
      setIsBgmPlaying(soundManager.isBGMPlaying());
    };

    const unsubscribe = soundManager.subscribe(syncState);
    syncState();
    return () => unsubscribe();
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleMasterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setMasterVol(val);
    soundManager.setMasterVolume(val);
    if (isMuted && val > 0) {
      soundManager.setMuted(false);
    }
  };

  const handleBgmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setBgmVol(val);
    soundManager.setBGMVolume(val);
  };

  const handleSfxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setSfxVol(val);
    soundManager.setSFXVolume(val);
  };

  const handleToggleMute = () => {
    const next = soundManager.toggleMute();
    setIsMuted(next);
  };

  const handleToggleBgm = () => {
    const next = !bgmEnabled;
    soundManager.setBGMEnabled(next);
    setBgmEnabled(next);
    if (next && !isBgmPlaying) {
      soundManager.startBGM();
    }
  };

  const handleToggleSfx = () => {
    const next = !sfxEnabled;
    soundManager.setSFXEnabled(next);
    setSfxEnabled(next);
    if (next) {
      soundManager.playClick();
    }
  };

  const handleToggleBgmPlayback = () => {
    soundManager.initCtx();
    const next = soundManager.toggleBGM();
    setIsBgmPlaying(next);
  };

  const handleTestSFX = () => {
    soundManager.playCoin();
  };

  const handleResetDefaults = () => {
    soundManager.setMuted(false);
    soundManager.setMasterVolume(0.8);
    soundManager.setBGMVolume(0.7);
    soundManager.setSFXVolume(0.85);
    soundManager.setBGMEnabled(true);
    soundManager.setSFXEnabled(true);
    soundManager.playSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-[#0e172f] via-[#090f23] to-[#060a19] border-2 border-cyan-500/50 rounded-3xl shadow-2xl overflow-hidden p-5 sm:p-7 text-white">
        
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-32 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="relative flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-950/80 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-lg">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-wide flex items-center gap-2">
                <span>CONFIGURAÇÕES DE ÁUDIO</span>
              </h2>
              <span className="text-[11px] text-cyan-300 font-mono block">
                EXCEL QUEST • SENAIZINHO
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
            title="Fechar Configurações"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Soundtrack Feature Banner: "Carry on Wayward Son" */}
        <div className="mt-4 p-3.5 bg-gradient-to-r from-amber-950/40 via-purple-950/30 to-blue-950/40 border border-amber-500/40 rounded-2xl flex items-center justify-between gap-3 shadow-inner">
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center text-white shadow-md shadow-amber-950 shrink-0">
              <Disc3 className={`w-6 h-6 ${isBgmPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.2 rounded font-bold">
                  Trilha Sonora Oficial
                </span>
                {isBgmPlaying && (
                  <span className="flex items-center gap-0.5 h-3">
                    <span className="w-1 h-3 bg-emerald-400 animate-pulse rounded-full" />
                    <span className="w-1 h-2 bg-emerald-400 animate-pulse delay-75 rounded-full" />
                    <span className="w-1 h-3.5 bg-emerald-400 animate-pulse delay-150 rounded-full" />
                  </span>
                )}
              </div>
              <strong className="block text-xs sm:text-sm text-white font-extrabold truncate">
                Carry on Wayward Son
              </strong>
              <span className="text-[11px] text-slate-300 block">
                Kansas (Arranjo 8-Bit Chiptune em Loop)
              </span>
            </div>
          </div>

          <button
            onClick={handleToggleBgmPlayback}
            className={`px-3 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition active:scale-95 shadow-md ${
              isBgmPlaying
                ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40'
            }`}
            title={isBgmPlaying ? 'Pausar Trilha' : 'Reproduzir Trilha'}
          >
            {isBgmPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>PAUSAR</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>TOCAR</span>
              </>
            )}
          </button>
        </div>

        {/* Audio Sliders List */}
        <div className="mt-5 space-y-4">
          
          {/* 1. MASTER VOLUME */}
          <div className="p-3.5 bg-slate-900/70 border border-slate-800 rounded-2xl">
            <div className="flex items-center justify-between text-xs font-bold text-white mb-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleMute}
                  className="p-1 rounded-lg hover:bg-slate-800 text-cyan-400 transition"
                  title={isMuted ? 'Desmutar Geral' : 'Mutar Geral'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
                </button>
                <span>Volume Geral (Master)</span>
              </div>
              <span className="font-mono text-cyan-300 text-xs px-2 py-0.5 bg-slate-950 rounded-md border border-slate-700">
                {isMuted ? 'MUDO (0%)' : `${Math.round(masterVol * 100)}%`}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : masterVol}
              onChange={handleMasterChange}
              className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none"
            />
          </div>

          {/* 2. BGM MUSIC VOLUME */}
          <div className="p-3.5 bg-slate-900/70 border border-slate-800 rounded-2xl">
            <div className="flex items-center justify-between text-xs font-bold text-white mb-2">
              <div className="flex items-center gap-2">
                <Music className="w-4 h-4 text-amber-400" />
                <span>Música de Fundo (BGM Gameplay)</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleBgm}
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-bold transition border ${
                    bgmEnabled
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
                      : 'bg-rose-950 text-rose-300 border-rose-500/50'
                  }`}
                >
                  {bgmEnabled ? 'LIGADA' : 'DESLIGADA'}
                </button>
                <span className="font-mono text-amber-300 text-xs px-2 py-0.5 bg-slate-950 rounded-md border border-slate-700">
                  {bgmEnabled ? `${Math.round(bgmVol * 100)}%` : '0%'}
                </span>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              disabled={!bgmEnabled}
              value={bgmEnabled ? bgmVol : 0}
              onChange={handleBgmChange}
              className="w-full accent-amber-400 cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none disabled:opacity-40"
            />
            <p className="text-[10px] text-slate-400 mt-1.5 font-mono">
              Loop contínuo de Carry on Wayward Son durante as missões de plataforma e resolução das fórmulas.
            </p>
          </div>

          {/* 3. SOUND EFFECTS (SFX) VOLUME */}
          <div className="p-3.5 bg-slate-900/70 border border-slate-800 rounded-2xl">
            <div className="flex items-center justify-between text-xs font-bold text-white mb-2">
              <div className="flex items-center gap-2">
                <Volume1 className="w-4 h-4 text-emerald-400" />
                <span>Efeitos Sonoros (Pulos, Moedas & Dano)</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleSfx}
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-bold transition border ${
                    sfxEnabled
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
                      : 'bg-rose-950 text-rose-300 border-rose-500/50'
                  }`}
                >
                  {sfxEnabled ? 'LIGADOS' : 'DESLIGADOS'}
                </button>
                <span className="font-mono text-emerald-300 text-xs px-2 py-0.5 bg-slate-950 rounded-md border border-slate-700">
                  {sfxEnabled ? `${Math.round(sfxVol * 100)}%` : '0%'}
                </span>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              disabled={!sfxEnabled}
              value={sfxEnabled ? sfxVol : 0}
              onChange={handleSfxChange}
              className="w-full accent-emerald-400 cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none disabled:opacity-40"
            />
            <div className="mt-2 flex items-center justify-end">
              <button
                onClick={handleTestSFX}
                disabled={!sfxEnabled}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 rounded-lg text-[10px] font-bold flex items-center gap-1 transition active:scale-95 disabled:opacity-40"
              >
                <span>🪙 Testar Efeito Sonoro</span>
              </button>
            </div>
          </div>

        </div>

        {/* Pedagogical Instructor Attribution Credit */}
        <div className="mt-4 p-3 bg-[#0a1126] border border-slate-800 rounded-xl flex items-center justify-between text-[11px] text-slate-300">
          <div className="space-y-0.5">
            <span className="font-bold text-white block">
              Instrutor de Formação Profissional do SENAI-SP Rafael Pereira
            </span>
            <span className="text-slate-400 block text-[10px]">
              Escola SENAI “Orlando Laviero Ferraiuolo”
            </span>
          </div>
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
            SENAI 2026
          </span>
        </div>

        {/* Modal Actions */}
        <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={handleResetDefaults}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition active:scale-95 border border-slate-700"
            title="Restaurar volumes padrão"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar Padrões</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition active:scale-95"
          >
            Salvar & Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
