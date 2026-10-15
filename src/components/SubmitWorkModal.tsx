import React, { useState } from 'react';
import { StudentProfile } from '../types/game';
import { soundManager } from '../utils/audio';
import { CheckSquare, Square, ExternalLink, AlertTriangle, FileSpreadsheet, X, Send } from 'lucide-react';

interface SubmitWorkModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile | null;
  completedStagesCount: number;
}

const GOOGLE_FORMS_URL = 'https://forms.gle/g1E3pyj2e5XSVwBi9';

export const SubmitWorkModal: React.FC<SubmitWorkModalProps> = ({
  isOpen,
  onClose,
  profile,
  completedStagesCount
}) => {
  const [checkedItems, setCheckedItems] = useState({
    nameInSheet: false,
    classCorrect: false,
    exercisesDone: false,
    fileSaved: false,
    readyToSend: false,
  });

  const [hasOpenedForm, setHasOpenedForm] = useState(false);

  if (!isOpen) return null;

  const toggleCheck = (key: keyof typeof checkedItems) => {
    soundManager.playClick();
    setCheckedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const allChecked = Object.values(checkedItems).every(Boolean);

  const handleOpenGoogleForms = () => {
    soundManager.playSuccess();
    setHasOpenedForm(true);
    // Safe link open
    window.open(GOOGLE_FORMS_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-[#0e172e] border-2 border-emerald-500/60 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 border-b border-emerald-500/40 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-950 rounded-xl border border-emerald-400/50">
              <Send className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-emerald-300">
                Entrega Oficial SENAI
              </span>
              <h2 className="text-lg font-bold">Entregar Atividade ao Professor</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-sm text-slate-200 overflow-y-auto max-h-[75vh]">
          
          {/* Student details summary */}
          <div className="p-3 bg-slate-900 border border-slate-700 rounded-xl flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-400 block">Aluno Identificado:</span>
              <strong className="text-white text-sm">{profile?.name || 'Não identificado'}</strong>
              <span className="text-cyan-300 block font-mono">{profile?.className || 'Sem turma'}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block">Fases no Jogo:</span>
              <span className="font-mono font-bold text-emerald-400 text-sm">
                {completedStagesCount} / 5 Concluídas
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Antes de abrir o formulário de entrega oficial, verifique todos os itens abaixo para garantir que sua nota seja lançada com sucesso pelo professor do SENAI:
          </p>

          {/* Checklist */}
          <div className="space-y-2.5">
            <label
              onClick={() => toggleCheck('nameInSheet')}
              className="flex items-center gap-3 p-3 bg-[#131f3b] hover:bg-[#18284c] border border-slate-700/80 rounded-xl cursor-pointer transition select-none"
            >
              {checkedItems.nameInSheet ? (
                <CheckSquare className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : (
                <Square className="w-5 h-5 text-slate-500 shrink-0" />
              )}
              <span className={checkedItems.nameInSheet ? 'text-emerald-200 font-medium' : 'text-slate-300'}>
                Meu nome está preenchido na planilha baixada
              </span>
            </label>

            <label
              onClick={() => toggleCheck('classCorrect')}
              className="flex items-center gap-3 p-3 bg-[#131f3b] hover:bg-[#18284c] border border-slate-700/80 rounded-xl cursor-pointer transition select-none"
            >
              {checkedItems.classCorrect ? (
                <CheckSquare className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : (
                <Square className="w-5 h-5 text-slate-500 shrink-0" />
              )}
              <span className={checkedItems.classCorrect ? 'text-emerald-200 font-medium' : 'text-slate-300'}>
                Minha turma do SENAI está correta
              </span>
            </label>

            <label
              onClick={() => toggleCheck('exercisesDone')}
              className="flex items-center gap-3 p-3 bg-[#131f3b] hover:bg-[#18284c] border border-slate-700/80 rounded-xl cursor-pointer transition select-none"
            >
              {checkedItems.exercisesDone ? (
                <CheckSquare className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : (
                <Square className="w-5 h-5 text-slate-500 shrink-0" />
              )}
              <span className={checkedItems.exercisesDone ? 'text-emerald-200 font-medium' : 'text-slate-300'}>
                Fiz os exercícios nas abas correspondentes no Excel
              </span>
            </label>

            <label
              onClick={() => toggleCheck('fileSaved')}
              className="flex items-center gap-3 p-3 bg-[#131f3b] hover:bg-[#18284c] border border-slate-700/80 rounded-xl cursor-pointer transition select-none"
            >
              {checkedItems.fileSaved ? (
                <CheckSquare className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : (
                <Square className="w-5 h-5 text-slate-500 shrink-0" />
              )}
              <span className={checkedItems.fileSaved ? 'text-emerald-200 font-medium' : 'text-slate-300'}>
                Salvei o arquivo .xlsx no meu computador
              </span>
            </label>

            <label
              onClick={() => toggleCheck('readyToSend')}
              className="flex items-center gap-3 p-3 bg-[#131f3b] hover:bg-[#18284c] border border-slate-700/80 rounded-xl cursor-pointer transition select-none"
            >
              {checkedItems.readyToSend ? (
                <CheckSquare className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : (
                <Square className="w-5 h-5 text-slate-500 shrink-0" />
              )}
              <span className={checkedItems.readyToSend ? 'text-emerald-200 font-medium' : 'text-slate-300'}>
                Estou pronto para enviar e anexar meu arquivo
              </span>
            </label>
          </div>

          {/* Transparent Notice */}
          <div className="p-3 bg-amber-950/40 border border-amber-500/40 rounded-xl text-xs text-amber-200 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong>Importante:</strong> Ao clicar no botão abaixo, o formulário oficial do Google será aberto em uma nova aba. Você deve <u>anexar sua planilha XLSX salva</u> no campo de upload do formulário. A abertura do formulário não substitui o envio do arquivo!
            </div>
          </div>

          {hasOpenedForm && (
            <div className="p-3 bg-cyan-950/50 border border-cyan-500/50 rounded-xl text-xs text-cyan-200 flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>O Google Formulários foi aberto em uma nova aba. Lembre-se de concluir o envio lá!</span>
            </div>
          )}

          {/* Action button */}
          <div className="pt-2">
            <button
              onClick={handleOpenGoogleForms}
              disabled={!allChecked}
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-extrabold text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 transition active:scale-95"
            >
              <span>Abrir Formulário de Envio</span>
              <ExternalLink className="w-4 h-4" />
            </button>
            {!allChecked && (
              <p className="text-center text-[11px] text-slate-400 mt-2">
                Marque todos os 5 itens do checklist acima para habilitar o envio.
              </p>
            )}
          </div>

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
