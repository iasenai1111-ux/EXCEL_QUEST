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
    window.open(GOOGLE_FORMS_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#101B35]/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-[#101B35] border-2 border-[#334E77] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#172747] via-[#213556] to-[#172747] border-b border-[#334E77] text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#22C55E]/20 rounded-xl border border-[#22C55E]/50">
              <Send className="w-6 h-6 text-[#22C55E]" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#22D3EE] font-bold">
                Entrega Oficial SENAI
              </span>
              <h2 className="text-lg font-bold text-[#F8FAFC]">Entregar Atividade ao Professor</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#CBD5E1] hover:text-white rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-sm text-[#CBD5E1] overflow-y-auto max-h-[75vh]">
          
          {/* Student details summary */}
          <div className="p-3.5 bg-[#172747] border border-[#334E77] rounded-2xl flex items-center justify-between text-xs">
            <div>
              <span className="text-[#CBD5E1] block">Aluno Identificado:</span>
              <strong className="text-[#F8FAFC] text-sm">{profile?.name || 'Não identificado'}</strong>
              <span className="text-[#22D3EE] block font-mono">{profile?.className || 'Sem turma'}</span>
            </div>
            <div className="text-right">
              <span className="text-[#CBD5E1] block">Fases no Jogo:</span>
              <span className="font-mono font-bold text-[#22C55E] text-sm">
                {completedStagesCount} / 10 Concluídas
              </span>
            </div>
          </div>

          <p className="text-xs text-[#CBD5E1] leading-relaxed">
            Antes de abrir o formulário de entrega oficial, verifique todos os itens abaixo para garantir que sua nota seja lançada com sucesso pelo professor do SENAI:
          </p>

          {/* Checklist */}
          <div className="space-y-2.5">
            <label
              onClick={() => toggleCheck('nameInSheet')}
              className="flex items-center gap-3 p-3 bg-[#172747] hover:bg-[#213556] border border-[#334E77] rounded-2xl cursor-pointer transition select-none"
            >
              {checkedItems.nameInSheet ? (
                <CheckSquare className="w-5 h-5 text-[#22C55E] shrink-0" />
              ) : (
                <Square className="w-5 h-5 text-slate-500 shrink-0" />
              )}
              <span className={checkedItems.nameInSheet ? 'text-[#22C55E] font-medium' : 'text-[#CBD5E1]'}>
                Meu nome está preenchido na planilha baixada
              </span>
            </label>

            <label
              onClick={() => toggleCheck('classCorrect')}
              className="flex items-center gap-3 p-3 bg-[#172747] hover:bg-[#213556] border border-[#334E77] rounded-2xl cursor-pointer transition select-none"
            >
              {checkedItems.classCorrect ? (
                <CheckSquare className="w-5 h-5 text-[#22C55E] shrink-0" />
              ) : (
                <Square className="w-5 h-5 text-slate-500 shrink-0" />
              )}
              <span className={checkedItems.classCorrect ? 'text-[#22C55E] font-medium' : 'text-[#CBD5E1]'}>
                Minha turma do SENAI está correta
              </span>
            </label>

            <label
              onClick={() => toggleCheck('exercisesDone')}
              className="flex items-center gap-3 p-3 bg-[#172747] hover:bg-[#213556] border border-[#334E77] rounded-2xl cursor-pointer transition select-none"
            >
              {checkedItems.exercisesDone ? (
                <CheckSquare className="w-5 h-5 text-[#22C55E] shrink-0" />
              ) : (
                <Square className="w-5 h-5 text-slate-500 shrink-0" />
              )}
              <span className={checkedItems.exercisesDone ? 'text-[#22C55E] font-medium' : 'text-[#CBD5E1]'}>
                Fiz os exercícios nas abas correspondentes no Excel
              </span>
            </label>

            <label
              onClick={() => toggleCheck('fileSaved')}
              className="flex items-center gap-3 p-3 bg-[#172747] hover:bg-[#213556] border border-[#334E77] rounded-2xl cursor-pointer transition select-none"
            >
              {checkedItems.fileSaved ? (
                <CheckSquare className="w-5 h-5 text-[#22C55E] shrink-0" />
              ) : (
                <Square className="w-5 h-5 text-slate-500 shrink-0" />
              )}
              <span className={checkedItems.fileSaved ? 'text-[#22C55E] font-medium' : 'text-[#CBD5E1]'}>
                Salvei o arquivo .xlsx no meu computador
              </span>
            </label>

            <label
              onClick={() => toggleCheck('readyToSend')}
              className="flex items-center gap-3 p-3 bg-[#172747] hover:bg-[#213556] border border-[#334E77] rounded-2xl cursor-pointer transition select-none"
            >
              {checkedItems.readyToSend ? (
                <CheckSquare className="w-5 h-5 text-[#22C55E] shrink-0" />
              ) : (
                <Square className="w-5 h-5 text-slate-500 shrink-0" />
              )}
              <span className={checkedItems.readyToSend ? 'text-[#22C55E] font-medium' : 'text-[#CBD5E1]'}>
                Estou pronto para enviar e anexar meu arquivo
              </span>
            </label>
          </div>

          {/* Notice */}
          <div className="p-3.5 bg-[#FF9F1C]/15 border border-[#FF9F1C]/40 rounded-2xl text-xs text-[#FFD166] flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-[#FF9F1C] shrink-0 mt-0.5" />
            <div>
              <strong>Importante:</strong> Ao clicar no botão abaixo, o formulário oficial do Google será aberto em uma nova aba. Você deve <u>anexar sua planilha XLSX salva</u> no campo de upload do formulário. A abertura do formulário não substitui o envio do arquivo!
            </div>
          </div>

          {hasOpenedForm && (
            <div className="p-3.5 bg-[#22D3EE]/20 border border-[#22D3EE]/50 rounded-2xl text-xs text-[#22D3EE] flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-[#22D3EE] shrink-0" />
              <span>O Google Formulários foi aberto em uma nova aba. Lembre-se de concluir o envio lá!</span>
            </div>
          )}

          {/* Action button */}
          <div className="pt-2">
            <button
              onClick={handleOpenGoogleForms}
              disabled={!allChecked}
              className="w-full py-3.5 btn-game btn-game-play text-sm flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span>Abrir Formulário de Envio</span>
              <ExternalLink className="w-4 h-4" />
            </button>
            {!allChecked && (
              <p className="text-center text-[11px] text-slate-400 mt-2 font-mono">
                Marque todos os 5 itens do checklist acima para habilitar o envio.
              </p>
            )}
          </div>

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
