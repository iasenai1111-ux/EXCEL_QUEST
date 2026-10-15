import React from 'react';
import { soundManager } from '../utils/audio';
import { HelpCircle, Monitor, ArrowRight, X, Sparkles, CheckCircle2 } from 'lucide-react';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#0e172e] border-2 border-cyan-500/60 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-900 via-cyan-900 to-slate-900 border-b border-cyan-500/40 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-950 rounded-xl border border-cyan-400/50">
              <HelpCircle className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-yellow-300 font-bold">
                Manual do Aventureiro SENAI • Super Mario Style
              </span>
              <h2 className="text-lg font-black text-white tracking-wide">Como Jogar SUPER SENAI BROS: EXCEL WORLD</h2>
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
        <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-200">
          
          {/* Step 1: Controls */}
          <div className="p-4 bg-slate-900/90 border border-slate-700/80 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-cyan-300 font-bold">
              <span className="w-5 h-5 rounded-full bg-cyan-900 text-cyan-200 flex items-center justify-center text-xs">1</span>
              <span>Movimentação e Coleta</span>
            </div>
            <p className="text-slate-300 text-xs">
              Use as <strong>Setas do Teclado</strong> ou as teclas <strong>WASD</strong> (ou os botões na tela) para caminhar e pular pelas plataformas. Colete as moedas de dados douradas espalhadas para ganhar XP adicional!
            </p>
          </div>

          {/* Step 2: Terminals */}
          <div className="p-4 bg-slate-900/90 border border-slate-700/80 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-emerald-300 font-bold">
              <span className="w-5 h-5 rounded-full bg-emerald-900 text-emerald-200 flex items-center justify-center text-xs">2</span>
              <span>Terminais de Fórmulas</span>
            </div>
            <p className="text-slate-300 text-xs">
              Caminhe até o pedestal com a tela brilhante e aperte <strong>[E]</strong>, <strong>[Enter]</strong> ou clique no botão para abrir o mini-Excel interativo.
            </p>
          </div>

          {/* Step 3: Mini-Excel Mechanics */}
          <div className="p-4 bg-[#111f3d] border border-cyan-500/40 rounded-xl space-y-2.5">
            <div className="flex items-center gap-2 text-amber-300 font-bold">
              <span className="w-5 h-5 rounded-full bg-amber-900 text-amber-200 flex items-center justify-center text-xs">3</span>
              <span>Como Resolver no Mini-Excel</span>
            </div>
            <div className="text-xs text-slate-300 space-y-1.5 pl-2">
              <p>• <strong>Regra de Ouro do Excel:</strong> Toda fórmula DEVE começar com o sinal de igual (<strong>=</strong>).</p>
              <p>• <strong>Referencie as células:</strong> Clique ou digite os nomes das células (ex: <strong>B2</strong>, <strong>C2</strong>) em vez de somar números avulsos.</p>
              <p>• <strong>Dois modos fáceis de preenchimento:</strong></p>
              <div className="p-2.5 bg-slate-950 rounded-lg space-y-1 font-mono text-[11px] text-cyan-200">
                <div>a) <strong>Por cliques:</strong> Clique em D2 → clique em = → clique em B2 → clique em + → clique em C2 → aperte Enter!</div>
                <div>b) <strong>Por digitação direta:</strong> Digite <code>=B2+C2</code> ou <code>=SOMA(B2:C2)</code> e aperte Enter no teclado!</div>
              </div>
            </div>
          </div>

          {/* Step 4: Smart Hints */}
          <div className="p-4 bg-slate-900/90 border border-slate-700/80 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-purple-300 font-bold">
              <span className="w-5 h-5 rounded-full bg-purple-900 text-purple-200 flex items-center justify-center text-xs">4</span>
              <span>Dicas Inteligentes em 3 Níveis</span>
            </div>
            <p className="text-slate-300 text-xs">
              Não se preocupe em errar! Na 1ª tentativa você recebe uma dica conceitual; na 2ª tentativa as células necessárias começam a piscar em azul; e na 3ª você ganha um exemplo guiado passo a passo.
            </p>
          </div>

          {/* Step 5: Real Excel Practice */}
          <div className="p-4 bg-slate-900/90 border border-slate-700/80 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-teal-300 font-bold">
              <span className="w-5 h-5 rounded-full bg-teal-900 text-teal-200 flex items-center justify-center text-xs">5</span>
              <span>Prática no Excel Real & Entrega</span>
            </div>
            <p className="text-slate-300 text-xs">
              Baixe a planilha oficial personalizada, abra no Excel do seu computador do laboratório, repita as fórmulas nas abas correspondentes e envie pelo botão oficial com Google Formulários!
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-[#091024] border-t border-slate-800 flex justify-end">
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl shadow-lg transition active:scale-95"
          >
            Entendi, Vamos Jogar!
          </button>
        </div>

      </div>
    </div>
  );
};
