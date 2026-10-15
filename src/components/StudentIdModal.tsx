import React, { useState } from 'react';
import { StudentProfile, StudentMode } from '../types/game';
import { soundManager } from '../utils/audio';
import { User, Users, ShieldCheck, ArrowRight, X } from 'lucide-react';

interface StudentIdModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: StudentProfile | null;
  onSaveProfile: (profile: StudentProfile) => void;
}

export const StudentIdModal: React.FC<StudentIdModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onSaveProfile
}) => {
  const [name, setName] = useState<string>(currentProfile?.name || '');
  const [className, setClassName] = useState<string>(currentProfile?.className || '');
  const [mode, setMode] = useState<StudentMode>(currentProfile?.mode || 'individual');
  const [partnerName, setPartnerName] = useState<string>(currentProfile?.partnerName || '');
  const [error, setError] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Por favor, informe seu nome completo.');
      return;
    }
    if (!className.trim()) {
      setError('Por favor, informe sua turma do SENAI.');
      return;
    }
    if (mode === 'dupla' && !partnerName.trim()) {
      setError('Por favor, informe o nome do seu colega de dupla.');
      return;
    }

    soundManager.playSuccess();
    const profile: StudentProfile = {
      name: name.trim(),
      className: className.trim(),
      mode,
      partnerName: mode === 'dupla' ? partnerName.trim() : undefined,
      createdAt: currentProfile?.createdAt || new Date().toISOString()
    };

    onSaveProfile(profile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#101B35]/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#101B35] border-2 border-[#334E77] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#172747] via-[#213556] to-[#172747] border-b border-[#334E77] text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#2563EB]/30 rounded-xl border border-[#2563EB]">
              <ShieldCheck className="w-6 h-6 text-[#22D3EE]" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#22D3EE] font-bold">
                Identificação do Aluno SENAI
              </span>
              <h2 className="text-lg font-bold text-[#F8FAFC]">Credencial do Aventureiro</h2>
            </div>
          </div>
          {currentProfile && (
            <button
              onClick={onClose}
              className="p-1.5 text-[#CBD5E1] hover:text-white rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm text-[#CBD5E1]">
          
          <div className="p-3 bg-[#172747] border border-[#334E77] rounded-2xl text-xs text-[#22D3EE]">
            Seus dados são salvos com segurança localmente no seu navegador para personalizar os arquivos oficiais de exercícios (.xlsx) e certificados!
          </div>

          {/* Mode Selection: Individual vs Dupla */}
          <div>
            <label className="block text-xs font-semibold text-[#CBD5E1] uppercase tracking-wider mb-2">
              Modalidade de Prática:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setMode('individual');
                }}
                className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition ${
                  mode === 'individual'
                    ? 'bg-[#2563EB]/30 border-[#2563EB] text-[#F8FAFC] shadow-md ring-2 ring-[#22D3EE]/50'
                    : 'bg-[#172747] border-[#334E77] text-[#CBD5E1] hover:bg-[#213556]'
                }`}
              >
                <User className="w-5 h-5 text-[#22D3EE]" />
                <span className="font-bold text-xs">Individual</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setMode('dupla');
                }}
                className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition ${
                  mode === 'dupla'
                    ? 'bg-[#2563EB]/30 border-[#2563EB] text-[#F8FAFC] shadow-md ring-2 ring-[#22D3EE]/50'
                    : 'bg-[#172747] border-[#334E77] text-[#CBD5E1] hover:bg-[#213556]'
                }`}
              >
                <Users className="w-5 h-5 text-[#22C55E]" />
                <span className="font-bold text-xs">Em Dupla</span>
              </button>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-[#CBD5E1] uppercase tracking-wider mb-1.5">
              Nome Completo do Aluno:
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              placeholder="Ex: Lucas Henrique da Silva"
              className="w-full px-4 py-2.5 bg-[#172747] border border-[#334E77] focus:border-[#22D3EE] rounded-xl text-[#F8FAFC] font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#22D3EE]/30 transition"
            />
          </div>

          {/* Class */}
          <div>
            <label className="block text-xs font-semibold text-[#CBD5E1] uppercase tracking-wider mb-1.5">
              Turma SENAI:
            </label>
            <input
              type="text"
              required
              value={className}
              onChange={(e) => {
                setClassName(e.target.value);
                if (error) setError('');
              }}
              placeholder="Ex: TI-2026-A / Mecatrônica 1º Semestre"
              className="w-full px-4 py-2.5 bg-[#172747] border border-[#334E77] focus:border-[#22D3EE] rounded-xl text-[#F8FAFC] font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#22D3EE]/30 transition"
            />
          </div>

          {/* Partner Name if Dupla */}
          {mode === 'dupla' && (
            <div className="animate-fadeIn">
              <label className="block text-xs font-semibold text-[#22C55E] uppercase tracking-wider mb-1.5">
                Nome do Colega de Dupla:
              </label>
              <input
                type="text"
                required
                value={partnerName}
                onChange={(e) => {
                  setPartnerName(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Ex: Mariana Costa dos Santos"
                className="w-full px-4 py-2.5 bg-[#172747] border border-[#22C55E]/60 focus:border-[#22C55E] rounded-xl text-[#F8FAFC] font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E]/30 transition"
              />
            </div>
          )}

          {error && (
            <div className="p-3 bg-[#EF4444]/20 border border-[#EF4444] text-[#F8FAFC] text-xs rounded-xl font-medium">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 btn-game btn-game-play text-sm flex items-center justify-center gap-2"
            >
              <span>Confirmar e Continuar Aventura</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
