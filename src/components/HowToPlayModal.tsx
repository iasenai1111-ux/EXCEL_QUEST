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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#101B35]/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#101B35] border-2 border-[#334E77] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#172747] via-[#213556] to-[#172747] border-b border-[#334E77] text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#2563EB]/30 rounded-xl border border-[#2563EB]">
              <HelpCircle className="w-6 h-6 text-[#22D3EE]" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#FFD166] font-bold">
                Manual do Aventureiro SENAI • Super Mario Style
              </span>
              <h2 className="text-lg font-black text-[#F8FAFC] tracking-wide">Como Jogar SUPER SENAI BROS: EXCEL WORLD</h2>
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
        <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-[#CBD5E1]">
          
          {/* Step 1: Controls */}
          <div className="p-4 bg-[#172747] border border-[#334E77] rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-[#22D3EE] font-bold">
              <span className="w-5 h-5 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-xs">1</span>
              <span>Movimentação e Coleta</span>
            </div>
            <p className="text-[#CBD5E1] text-xs">
              Use as <strong>Setas do Teclado</strong> ou as teclas <strong>WASD</strong> (ou os botões na tela) para caminhar, correr com <strong>Shift</strong> e pular pelas plataformas. Colete as moedas de dados douradas espalhadas para ganhar XP adicional!
            </p>
          </div>

          {/* Step 2: Terminals */}
          <div className="p-4 bg-[#172747] border border-[#334E77] rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-[#22C55E] font-bold">
              <span className="w-5 h-5 rounded-full bg-[#22C55E]/30 border border-[#22C55E] text-[#22C55E] flex items-center justify-center text-xs">2</span>
              <span>Terminais de Fórmulas</span>
            </div>
            <p className="text-[#CBD5E1] text-xs">
              Caminhe até o pedestal com a tela brilhante e aperte <strong>[E]</strong>, <strong>[Enter]</strong> ou clique no botão para abrir o mini-Excel interativo.
            </p>
          </div>

          {/* Step 3: Mini-Excel Mechanics */}
          <div className="p-4 bg-[#213556] border border-[#22D3EE]/40 rounded-2xl space-y-2.5">
            <div className="flex items-center gap-2 text-[#FFD166] font-bold">
              <span className="w-5 h-5 rounded-full bg-[#FF9F1C] text-[#0F172A] flex items-center justify-center text-xs">3</span>
              <span>Como Resolver no Mini-Excel</span>
            </div>
            <div className="text-xs text-[#CBD5E1] space-y-1.5 pl-2">
              <p>• <strong>Regra de Ouro do Excel:</strong> Toda fórmula DEVE começar com o sinal de igual (<strong>=</strong>).</p>
              <p>• <strong>Referencie as células:</strong> Clique ou digite os nomes das células (ex: <strong>B2</strong>, <strong>C2</strong>) em vez de somar números avulsos.</p>
              <p>• <strong>Dois modos fáceis de preenchimento:</strong></p>
              <div className="p-3 bg-[#101B35] rounded-xl space-y-1 font-mono text-[11px] text-[#22D3EE] border border-[#334E77]">
                <div>a) <strong>Por cliques:</strong> Clique em D2 → clique em = → clique em B2 → clique em + → clique em C2 → aperte Enter!</div>
                <div>b) <strong>Por digitação direta:</strong> Digite <code>=B2+C2</code> ou <code>=SOMA(B2:C2)</code> e aperte Enter no teclado!</div>
              </div>
            </div>
          </div>

          {/* Step 4: Smart Hints */}
          <div className="p-4 bg-[#172747] border border-[#334E77] rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-[#8B5CF6] font-bold">
              <span className="w-5 h-5 rounded-full bg-[#8B5CF6]/30 border border-[#8B5CF6] text-[#8B5CF6] flex items-center justify-center text-xs">4</span>
              <span>Dicas Inteligentes em 3 Níveis</span>
            </div>
            <p className="text-[#CBD5E1] text-xs">
              Não se preocupe em errar! Na 1ª tentativa você recebe uma dica conceitual; na 2ª tentativa as células necessárias começam a piscar em azul; e na 3ª você ganha um exemplo guiado passo a passo.
            </p>
          </div>

          {/* Step 5: Real Excel Practice */}
          <div className="p-4 bg-[#172747] border border-[#334E77] rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-[#22D3EE] font-bold">
              <span className="w-5 h-5 rounded-full bg-[#0284C7] text-white flex items-center justify-center text-xs">5</span>
              <span>Prática no Excel Real & Entrega</span>
            </div>
            <p className="text-[#CBD5E1] text-xs">
              Baixe a planilha oficial personalizada, abra no Excel do seu computador do laboratório, repita as fórmulas nas abas correspondentes e envie pelo botão oficial com Google Formulários!
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-[#172747] border-t border-[#334E77] flex justify-end">
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="px-6 py-2.5 btn-game btn-game-play text-xs"
          >
            Entendi, Vamos Jogar!
          </button>
        </div>

      </div>
    </div>
  );
};
