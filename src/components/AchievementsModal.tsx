import React, { useState } from 'react';
import { GameProgress, Medal } from '../types/game';
import { GAME_MEDALS } from '../data/stages';
import { generateExportSaveCode, parseImportSaveCode } from '../utils/storage';
import { soundManager } from '../utils/audio';
import { Award, Trophy, Copy, Check, Upload, RefreshCw, X, Shield, Sparkles } from 'lucide-react';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: GameProgress;
  onImportProgress: (newProgress: Partial<GameProgress>) => void;
  onResetProgress: () => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  isOpen,
  onClose,
  progress,
  onImportProgress,
  onResetProgress
}) => {
  const [activeTab, setActiveTab] = useState<'medals' | 'sync'>('medals');
  const [copied, setCopied] = useState(false);
  const [importCodeInput, setImportCodeInput] = useState('');
  const [importFeedback, setImportFeedback] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: ''
  });

  if (!isOpen) return null;

  const exportCode = generateExportSaveCode(progress);

  const handleCopyCode = () => {
    soundManager.playClick();
    navigator.clipboard.writeText(exportCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleImport = () => {
    soundManager.playClick();
    if (!importCodeInput.trim()) {
      setImportFeedback({ type: 'error', message: 'Cole um código de salvamento válido.' });
      return;
    }

    const imported = parseImportSaveCode(importCodeInput);
    if (!imported) {
      soundManager.playError();
      setImportFeedback({
        type: 'error',
        message: 'Código inválido ou corrompido! Verifique o formato EXQ-...'
      });
      return;
    }

    soundManager.playSuccess();
    onImportProgress(imported);
    setImportFeedback({
      type: 'success',
      message: 'Progresso restaurado com sucesso no laboratório!'
    });
    setImportCodeInput('');
  };

  const handleReset = () => {
    if (window.confirm('Tem certeza que deseja reiniciar todo o progresso do jogo? Esta ação não pode ser desfeita.')) {
      soundManager.playClick();
      onResetProgress();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#0e172e] border-2 border-amber-500/60 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-amber-700 via-orange-800 to-slate-900 border-b border-amber-500/40 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-950 rounded-xl border border-amber-400/50">
              <Trophy className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-amber-300">
                Conquistas & Sincronização
              </span>
              <h2 className="text-lg font-bold">Galeria de Medalhas & Backup</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 px-6 pt-3 bg-[#091024] border-b border-slate-800 text-xs">
          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('medals');
            }}
            className={`pb-2.5 px-3 font-semibold transition border-b-2 flex items-center gap-1.5 ${
              activeTab === 'medals'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Medalhas ({progress.medals.length}/{GAME_MEDALS.length})</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('sync');
            }}
            className={`pb-2.5 px-3 font-semibold transition border-b-2 flex items-center gap-1.5 ${
              activeTab === 'sync'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            <span>Mudar de PC (Exportar/Importar)</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-sm text-slate-200 flex-1">
          
          {/* TAB 1: MEDALS */}
          {activeTab === 'medals' && (
            <div className="space-y-4">
              
              {/* Quick stats strip */}
              <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                  <span className="text-slate-400 block mb-0.5">Pontuação XP</span>
                  <strong className="text-emerald-400 font-mono text-base">{progress.xp} XP</strong>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                  <span className="text-slate-400 block mb-0.5">Moedas de Dados</span>
                  <strong className="text-amber-400 font-mono text-base">{progress.coins} 🪙</strong>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                  <span className="text-slate-400 block mb-0.5">Fases Concluídas</span>
                  <strong className="text-cyan-400 font-mono text-base">
                    {progress.completedStages.length} / 5
                  </strong>
                </div>
              </div>

              {/* Medals Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {GAME_MEDALS.map((medal: Medal) => {
                  const isUnlocked = progress.medals.includes(medal.id);

                  return (
                    <div
                      key={medal.id}
                      className={`p-3.5 rounded-xl border flex items-start gap-3 transition ${
                        isUnlocked
                          ? 'bg-amber-950/30 border-amber-500/50 shadow-md'
                          : 'bg-slate-900/50 border-slate-800 opacity-60'
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                          isUnlocked
                            ? 'bg-amber-900/60 border border-amber-400/50 shadow-inner'
                            : 'bg-slate-800 text-slate-500 grayscale'
                        }`}
                      >
                        {medal.icon}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className={`font-bold text-xs truncate ${isUnlocked ? 'text-amber-300' : 'text-slate-400'}`}>
                            {medal.title}
                          </h4>
                          {isUnlocked ? (
                            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-500/30">
                              DESBLOQUEADA
                            </span>
                          ) : (
                            <span className="text-[10px] font-mono text-slate-500">
                              BLOQUEADA
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                          {medal.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: SYNC (EXPORT / IMPORT) */}
          {activeTab === 'sync' && (
            <div className="space-y-4">
              
              <div className="p-3 bg-cyan-950/40 border border-cyan-500/40 rounded-xl flex items-start gap-2.5 text-xs text-cyan-200">
                <Shield className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <strong>Troca Segura de Máquinas no Laboratório SENAI:</strong>
                  <p className="mt-0.5 text-slate-300">
                    Este código armazena apenas suas fases desbloqueadas, moedas, XP e medalhas conquistadas. Por respeito à sua privacidade, <u>ele não contém seu nome nem dados pessoais</u>.
                  </p>
                </div>
              </div>

              {/* Export Block */}
              <div className="p-4 bg-slate-900 border border-slate-700/80 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Seu Código de Progresso Atual:
                  </span>
                  <button
                    onClick={handleCopyCode}
                    className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 transition active:scale-95"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copiado!' : 'Copiar Código'}</span>
                  </button>
                </div>

                <div className="p-2.5 bg-black rounded-lg border border-slate-800 font-mono text-xs text-amber-300 break-all select-all">
                  {exportCode}
                </div>
                <p className="text-[11px] text-slate-400">
                  Guarde este texto no Bloco de Notas ou e-mail para retomar exatamente de onde parou em outra máquina!
                </p>
              </div>

              {/* Import Block */}
              <div className="p-4 bg-slate-900 border border-slate-700/80 rounded-xl space-y-2.5">
                <span className="text-xs font-bold text-white uppercase tracking-wider block">
                  Restaurar Progresso em Outro Computador:
                </span>
                
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={importCodeInput}
                    onChange={(e) => setImportCodeInput(e.target.value)}
                    placeholder="Cole aqui o código EXQ-..."
                    className="flex-1 px-3 py-2 bg-black border border-slate-700 focus:border-amber-400 rounded-lg text-xs font-mono text-white focus:outline-none"
                  />
                  <button
                    onClick={handleImport}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 transition active:scale-95 shrink-0"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Carregar Salvo</span>
                  </button>
                </div>

                {importFeedback.type !== 'idle' && (
                  <p className={`text-xs font-medium ${importFeedback.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {importFeedback.message}
                  </p>
                )}
              </div>

              {/* Reset Game Button */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleReset}
                  className="text-xs text-red-400 hover:text-red-300 underline underline-offset-2 transition"
                >
                  Reiniciar todo o progresso do jogo
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-[#091024] border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
