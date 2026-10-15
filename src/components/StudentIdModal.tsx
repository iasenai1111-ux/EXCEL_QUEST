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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#0e172e] border-2 border-cyan-500/60 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-900 via-cyan-900 to-slate-900 border-b border-cyan-500/40 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-950 rounded-xl border border-cyan-400/50">
              <ShieldCheck className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-cyan-300">
                Identificação do Aluno SENAI
              </span>
              <h2 className="text-lg font-bold">Credencial do Aventureiro</h2>
            </div>
          </div>
          {currentProfile && (
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm text-slate-200">
          
          <div className="p-3 bg-cyan-950/30 border border-cyan-500/30 rounded-xl text-xs text-cyan-200">
            Seus dados são salvos com privacidade apenas no seu navegador e servem para personalizar o arquivo oficial de exercícios (.xlsx) e o certificado de conclusão!
          </div>

          {/* Mode Selection: Individual vs Dupla */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Modalidade de Prática:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setMode('individual');
                }}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition ${
                  mode === 'individual'
                    ? 'bg-cyan-950/70 border-cyan-400 text-cyan-200 shadow-md ring-1 ring-cyan-400'
                    : 'bg-slate-900/60 border-slate-700 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <User className="w-5 h-5 text-cyan-400" />
                <span className="font-bold text-xs">Individual</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setMode('dupla');
                }}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition ${
                  mode === 'dupla'
                    ? 'bg-cyan-950/70 border-cyan-400 text-cyan-200 shadow-md ring-1 ring-cyan-400'
                    : 'bg-slate-900/60 border-slate-700 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <Users className="w-5 h-5 text-teal-400" />
                <span className="font-bold text-xs">Em Dupla</span>
              </button>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
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
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition"
            />
          </div>

          {/* Class */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
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
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition"
            />
          </div>

          {/* Partner Name if Dupla */}
          {mode === 'dupla' && (
            <div className="animate-fadeIn">
              <label className="block text-xs font-semibold text-teal-300 uppercase tracking-wider mb-1.5">
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
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-teal-600/70 focus:border-teal-400 rounded-xl text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 transition"
              />
            </div>
          )}

          {error && (
            <div className="p-2.5 bg-red-950/60 border border-red-700 text-red-200 text-xs rounded-xl font-medium">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-extrabold text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 transition active:scale-95"
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
