import React, { useState } from 'react';
import { GameProgress, Medal } from '../types/game';
import { GAME_MEDALS, LEVEL_1_STAGES } from '../data/stages';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#101B35]/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#101B35] border-2 border-[#8B5CF6]/60 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        
        {/* Header - Purple & Gold Aesthetic */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#7C3AED] via-[#8B5CF6] to-[#172747] border-b border-[#A78BFA]/40 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#4C1D95] rounded-xl border border-[#FFD166]/50 shadow-inner">
              <Trophy className="w-6 h-6 text-[#FFD166]" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#FFD166] font-bold">
                Conquistas & Sincronização • SENAI
              </span>
              <h2 className="text-lg font-bold text-[#F8FAFC]">Galeria de Medalhas & Backup</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#CBD5E1] hover:text-white rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 px-6 pt-3 bg-[#172747] border-b border-[#334E77] text-xs">
          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('medals');
            }}
            className={`pb-2.5 px-3 font-bold transition border-b-2 flex items-center gap-1.5 ${
              activeTab === 'medals'
                ? 'border-[#8B5CF6] text-[#FFD166]'
                : 'border-transparent text-[#CBD5E1] hover:text-white'
            }`}
          >
            <Award className="w-4 h-4 text-[#FFD166]" />
            <span>Medalhas ({progress.medals.length}/{GAME_MEDALS.length})</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('sync');
            }}
            className={`pb-2.5 px-3 font-bold transition border-b-2 flex items-center gap-1.5 ${
              activeTab === 'sync'
                ? 'border-[#8B5CF6] text-[#FFD166]'
                : 'border-transparent text-[#CBD5E1] hover:text-white'
            }`}
          >
            <RefreshCw className="w-4 h-4 text-[#22D3EE]" />
            <span>Mudar de PC (Exportar/Importar)</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-sm text-[#CBD5E1] flex-1">
          
          {/* TAB 1: MEDALS */}
          {activeTab === 'medals' && (
            <div className="space-y-4">
              
              {/* Quick stats strip */}
              <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
                <div className="p-3 bg-[#172747] border border-[#334E77] rounded-2xl shadow-sm">
                  <span className="text-[#CBD5E1] block mb-0.5">Pontuação XP</span>
                  <strong className="text-[#22D3EE] font-mono text-base">{progress.xp} XP</strong>
                </div>
                <div className="p-3 bg-[#172747] border border-[#FFD166]/40 rounded-2xl shadow-sm">
                  <span className="text-[#CBD5E1] block mb-0.5">Moedas Coletadas</span>
                  <strong className="text-[#FFD166] font-mono text-base">{progress.coins} 🪙</strong>
                </div>
                <div className="p-3 bg-[#172747] border border-[#334E77] rounded-2xl shadow-sm">
                  <span className="text-[#CBD5E1] block mb-0.5">Fases Concluídas</span>
                  <strong className="text-[#22C55E] font-mono text-base">
                    {progress.completedStages.length} / {LEVEL_1_STAGES.length}
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
                      className={`p-3.5 rounded-2xl border flex items-start gap-3 transition ${
                        isUnlocked
                          ? 'bg-[#213556] border-[#8B5CF6] shadow-lg shadow-[#8B5CF6]/15'
                          : 'bg-[#172747]/60 border-[#334E77] opacity-60'
                      }`}
                    >
                      <div
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${
                          isUnlocked
                            ? 'bg-[#4C1D95] border border-[#FFD166] shadow-inner'
                            : 'bg-[#101B35] text-slate-500 grayscale'
                        }`}
                      >
                        {medal.icon}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className={`font-bold text-xs truncate ${isUnlocked ? 'text-[#FFD166]' : 'text-[#CBD5E1]'}`}>
                            {medal.title}
                          </h4>
                          {isUnlocked ? (
                            <span className="text-[10px] font-mono text-[#22C55E] bg-[#101B35] px-1.5 py-0.5 rounded border border-[#22C55E]/40 font-bold">
                              CONQUISTADA
                            </span>
                          ) : (
                            <span className="text-[10px] font-mono text-slate-500">
                              BLOQUEADA
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#CBD5E1] mt-1 leading-snug">
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
              
              <div className="p-3 bg-[#172747] border border-[#22D3EE]/40 rounded-2xl flex items-start gap-2.5 text-xs text-[#22D3EE]">
                <Shield className="w-5 h-5 text-[#22D3EE] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#F8FAFC]">Troca Segura de Máquinas no Laboratório SENAI:</strong>
                  <p className="mt-0.5 text-[#CBD5E1]">
                    Este código armazena apenas suas fases desbloqueadas, moedas, XP e medalhas conquistadas. Por respeito à sua privacidade, <u>ele não contém seu nome nem dados pessoais</u>.
                  </p>
                </div>
              </div>

              {/* Export Block */}
              <div className="p-4 bg-[#172747] border border-[#334E77] rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#F8FAFC] uppercase tracking-wider">
                    Seu Código de Progresso Atual:
                  </span>
                  <button
                    onClick={handleCopyCode}
                    className="px-3 py-1.5 btn-game btn-game-achievements text-xs flex items-center gap-1.5"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copiado!' : 'Copiar Código'}</span>
                  </button>
                </div>

                <div className="p-3 bg-[#101B35] rounded-xl border border-[#334E77] font-mono text-xs text-[#FFD166] break-all select-all shadow-inner">
                  {exportCode}
                </div>
                <p className="text-[11px] text-[#CBD5E1]">
                  Guarde este texto no Bloco de Notas ou envie por e-mail para retomar exatamente de onde parou em outro computador do SENAI!
                </p>
              </div>

              {/* Import Block */}
              <div className="p-4 bg-[#172747] border border-[#334E77] rounded-2xl space-y-2.5">
                <span className="text-xs font-bold text-[#F8FAFC] uppercase tracking-wider block">
                  Restaurar Progresso em Outro Computador:
                </span>
                
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={importCodeInput}
                    onChange={(e) => setImportCodeInput(e.target.value)}
                    placeholder="Cole aqui o código EXQ-..."
                    className="flex-1 px-3.5 py-2.5 bg-[#101B35] border border-[#334E77] focus:border-[#8B5CF6] rounded-xl text-xs font-mono text-[#F8FAFC] focus:outline-none"
                  />
                  <button
                    onClick={handleImport}
                    className="px-5 py-2.5 btn-game btn-game-play text-xs flex items-center justify-center gap-1.5 shrink-0"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Carregar Salvo</span>
                  </button>
                </div>

                {importFeedback.type !== 'idle' && (
                  <p className={`text-xs font-medium ${importFeedback.type === 'success' ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                    {importFeedback.message}
                  </p>
                )}
              </div>

              {/* Reset Game Button */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleReset}
                  className="text-xs text-[#EF4444] hover:text-red-300 underline underline-offset-2 transition"
                >
                  Reiniciar todo o progresso do jogo
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-[#172747] border-t border-[#334E77] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 btn-game btn-game-surface text-xs"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
