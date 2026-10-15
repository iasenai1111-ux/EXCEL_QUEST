import React, { useState } from 'react';
import { LEVEL_1_STAGES } from '../data/stages';
import { soundManager } from '../utils/audio';
import { GraduationCap, Clock, CheckCircle2, BookOpen, Layers, Award, X, Sparkles, AlertCircle, Lock, KeyRound, Unlock } from 'lucide-react';

interface TeacherDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  isGodMode: boolean;
  onToggleGodMode: (enabled: boolean) => void;
  onUnlockAllStages: () => void;
  onShowEnding: () => void;
  onShowTrailer: () => void;
}

export const TeacherDashboardModal: React.FC<TeacherDashboardModalProps> = ({
  isOpen,
  onClose,
  isGodMode,
  onToggleGodMode,
  onUnlockAllStages,
  onShowEnding,
  onShowTrailer,
}) => {
  const [activeTab, setActiveTab] = useState<'stages' | 'methodology' | 'rubric' | 'future' | 'root'>('stages');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');

  if (!isOpen) return null;

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = passwordInput.trim();
    if (clean === 'senai123' || clean === 'prof2026' || clean === 'senai' || clean === 'root') {
      soundManager.playSuccess();
      setIsAuthenticated(true);
      setPasswordError('');
      setPasswordInput('');
    } else {
      soundManager.playError();
      setPasswordError('Senha incorreta! O acesso é exclusivo para professores do SENAI.');
    }
  };

  // If not authenticated, render the secure password challenge screen
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
        <div className="relative w-full max-w-md bg-[#0c1429] border-2 border-indigo-500/60 rounded-3xl shadow-2xl overflow-hidden p-6 text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 bg-indigo-950 border-2 border-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-4 text-indigo-300 shadow-xl">
            <Lock className="w-7 h-7" />
          </div>

          <span className="text-[10px] font-mono tracking-widest uppercase text-indigo-400 font-bold block">
            Área Restrita aos Professores
          </span>
          <h2 className="text-xl font-bold text-white mt-1">Painel do Docente</h2>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            Este painel contém os gabaritos oficiais das 10 fases e critérios de avaliação. Alunos não possuem permissão de acesso.
          </p>

          <form onSubmit={handlePasswordSubmit} className="mt-5 space-y-3">
            <div className="text-left">
              <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Senha de Acesso do Professor:
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  autoFocus
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (passwordError) setPasswordError('');
                  }}
                  placeholder="Digite a senha docente..."
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 focus:border-indigo-400 rounded-xl text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition"
                />
                <KeyRound className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {passwordError && (
              <div className="p-2.5 bg-red-950/80 border border-red-700 text-red-200 text-xs rounded-xl font-medium animate-fadeIn">
                {passwordError}
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 transition active:scale-95"
              >
                <Unlock className="w-4 h-4" />
                <span>Desbloquear Painel do Professor</span>
              </button>
            </div>

            <p className="text-[10px] font-mono text-slate-500 pt-1">
              (Senha padrão de laboratório: <strong>senai123</strong>)
            </p>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#0c1429] border-2 border-indigo-500/60 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-indigo-900 via-blue-900 to-slate-900 border-b border-indigo-500/40 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-950 rounded-xl border border-indigo-400/50">
              <GraduationCap className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-indigo-300">
                Área Pedagógica SENAI
              </span>
              <h2 className="text-lg font-bold">Painel do Docente • Guia Didático</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 bg-[#091024] border-b border-slate-800 text-xs overflow-x-auto">
          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('stages');
            }}
            className={`pb-2.5 px-3 font-semibold transition border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'stages'
                ? 'border-indigo-400 text-indigo-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Fases & Gabaritos</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('methodology');
            }}
            className={`pb-2.5 px-3 font-semibold transition border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'methodology'
                ? 'border-indigo-400 text-indigo-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Condução da Aula & Tempos</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('rubric');
            }}
            className={`pb-2.5 px-3 font-semibold transition border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'rubric'
                ? 'border-indigo-400 text-indigo-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Critérios de Avaliação</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('future');
            }}
            className={`pb-2.5 px-3 font-semibold transition border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'future'
                ? 'border-indigo-400 text-indigo-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Arquitetura de Expansão (Níveis 2 & 3)</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('root');
            }}
            className={`pb-2.5 px-3 font-semibold transition border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'root'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Modo ROOT (Imortal & Demonstração)</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-200 flex-1">
          
          {/* TAB 1: STAGES & GABARITOS */}
          {activeTab === 'stages' && (
            <div className="space-y-4">
              <div className="p-3 bg-indigo-950/40 border border-indigo-500/40 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <BookOpen className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white text-xs block">Guia Curricular das 10 Fases • Aventuras do SENAIZINHO</strong>
                    <p className="text-xs text-indigo-200">
                      Gabaritos pedagógicos oficiais, células de entrada e fórmulas aceitas para cada um dos 10 mundos industriais.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {LEVEL_1_STAGES.map((st) => (
                  <div
                    key={st.id}
                    className="p-4 bg-[#121c38] border border-slate-700/80 rounded-xl space-y-2 shadow-sm"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-700/60 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-indigo-900 text-indigo-200 font-bold flex items-center justify-center text-xs">
                          {st.id}
                        </span>
                        <h4 className="font-bold text-white text-sm">{st.title}</h4>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                        {st.challenge.operationName}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
                      <div className="p-2.5 bg-slate-900 rounded-lg">
                        <span className="text-slate-400 block mb-0.5 font-semibold">Célula Alvo:</span>
                        <strong className="text-amber-400 font-mono text-sm">{st.challenge.targetCell}</strong>
                      </div>
                      <div className="p-2.5 bg-slate-900 rounded-lg">
                        <span className="text-slate-400 block mb-0.5 font-semibold">Resultado Esperado:</span>
                        <strong className="text-emerald-400 font-mono text-sm">{st.challenge.expectedValue}</strong>
                      </div>
                      <div className="p-2.5 bg-slate-900 rounded-lg">
                        <span className="text-slate-400 block mb-0.5 font-semibold">Células Referenciadas:</span>
                        <span className="text-cyan-300 font-mono text-xs">{st.challenge.requiredCells.join(', ')}</span>
                      </div>
                    </div>

                    <div className="p-2.5 bg-slate-950 rounded-lg text-xs space-y-1">
                      <span className="text-slate-400 block font-semibold">Fórmulas Aceitas no Gabarito:</span>
                      <code className="text-emerald-300 font-mono font-bold block bg-emerald-950/60 px-2 py-1 rounded">
                        {st.challenge.acceptedFormulasDescription}
                      </code>
                    </div>

                    <p className="text-[11px] text-slate-400 italic">
                      Objetivo Pedagógico: {st.learningGoal}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: METHODOLOGY & TIMING */}
          {activeTab === 'methodology' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-blue-950/40 border border-blue-500/40 rounded-xl flex items-start gap-2.5">
                <Clock className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-200">
                  Planejamento de aula sugerido para blocos de <strong>50 min a 100 min</strong> em laboratório de informática SENAI.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 bg-[#121c38] border border-slate-700/80 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between">
                    <strong className="text-cyan-300 text-sm">Etapa 1: Sensibilização & Conceituação</strong>
                    <span className="px-2 py-0.5 rounded bg-blue-900 text-blue-200 text-xs font-mono">10 min</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    O professor introduz a lógica de fórmulas no Excel: o significado do caractere "=", operadores básicos (+, -, *, /) e a diferença entre digitar números fixos e referenciar células dinâmicas.
                  </p>
                </div>

                <div className="p-3.5 bg-[#121c38] border border-slate-700/80 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between">
                    <strong className="text-cyan-300 text-sm">Etapa 2: Exploração no Jogo (Excel Quest)</strong>
                    <span className="px-2 py-0.5 rounded bg-blue-900 text-blue-200 text-xs font-mono">25 a 30 min</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Os alunos realizam o login individual ou em dupla, exploram os 5 cenários 2D, coletam as moedas de dados e resolvem os terminais interativos com o sistema inteligente de dicas em 3 tentativas.
                  </p>
                </div>

                <div className="p-3.5 bg-[#121c38] border border-slate-700/80 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between">
                    <strong className="text-cyan-300 text-sm">Etapa 3: Prática no Software Excel Real (.xlsx)</strong>
                    <span className="px-2 py-0.5 rounded bg-blue-900 text-blue-200 text-xs font-mono">30 min</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    O aluno faz o download do arquivo oficial padronizado gerado pelo jogo, abre no Microsoft Excel local, preenche as células amarelas das 5 abas e confere os resultados.
                  </p>
                </div>

                <div className="p-3.5 bg-[#121c38] border border-slate-700/80 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between">
                    <strong className="text-cyan-300 text-sm">Etapa 4: Checklist & Envio ao Google Formulários</strong>
                    <span className="px-2 py-0.5 rounded bg-blue-900 text-blue-200 text-xs font-mono">15 min</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Os alunos conferem o checklist de 5 itens obrigatórios e acessam o link oficial para anexar a planilha finalizada.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: RUBRIC */}
          {activeTab === 'rubric' && (
            <div className="space-y-4">
              <div className="p-3 bg-purple-950/40 border border-purple-500/40 rounded-xl flex items-start gap-2.5">
                <Award className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                <p className="text-xs text-purple-200">
                  Matriz de rubrica para atribuição de notas e competências pedagógicas (Padrão SENAI de Avaliação Formativa).
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 bg-[#121c38] border border-slate-700 rounded-xl space-y-2">
                  <strong className="text-emerald-400 block text-sm">1. Domínio de Sintaxe (25%)</strong>
                  <p className="text-slate-300">
                    O aluno inicia todas as fórmulas com "=" e compreende o uso correto dos operadores aritméticos (+, -, *, /) e parênteses.
                  </p>
                </div>

                <div className="p-3.5 bg-[#121c38] border border-slate-700 rounded-xl space-y-2">
                  <strong className="text-cyan-400 block text-sm">2. Referenciação Relativa (25%)</strong>
                  <p className="text-slate-300">
                    O aluno referencia as células (ex: B2, C2) ao invés de digitar constantes fixas, garantindo dinamismo e automação da planilha.
                  </p>
                </div>

                <div className="p-3.5 bg-[#121c38] border border-slate-700 rounded-xl space-y-2">
                  <strong className="text-amber-400 block text-sm">3. Funções Nativas SOMA e MÉDIA (25%)</strong>
                  <p className="text-slate-300">
                    O aluno aplica a notação de intervalo (ex: B2:D2) e compreende o funcionamento estatístico da função MÉDIA.
                  </p>
                </div>

                <div className="p-3.5 bg-[#121c38] border border-slate-700 rounded-xl space-y-2">
                  <strong className="text-indigo-400 block text-sm">4. Prática no Excel Real & Entrega (25%)</strong>
                  <p className="text-slate-300">
                    O aluno salva a planilha .xlsx no computador do laboratório com seu nome e anexa com sucesso no formulário de entrega.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: FUTURE EXPANSION */}
          {activeTab === 'future' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-slate-900 border border-slate-700 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold">
                  <Sparkles className="w-4 h-4" />
                  <span>Roadmap de Expansão Curricular (Preparação Arquitetural)</span>
                </div>
                <p className="text-xs text-slate-300">
                  O projeto foi construído com arquitetura modular desacoplada (<code className="text-cyan-300">src/data/stages.ts</code>, <code className="text-cyan-300">src/utils/formulaParser.ts</code> e <code className="text-cyan-300">src/types/game.ts</code>) pronta para receber novos níveis sem refatoração do motor:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 bg-[#131f3b] border border-cyan-500/40 rounded-xl space-y-2">
                  <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono font-bold text-[10px]">
                    EXPANSÃO PLANEJADA
                  </span>
                  <h4 className="font-bold text-white text-sm">Nível 2 — Intermediário</h4>
                  <ul className="list-disc pl-4 space-y-1 text-slate-300 text-[11px]">
                    <li>Função condicional <strong>=SE(teste; se_verdadeiro; se_falso)</strong></li>
                    <li>Contagem condicional <strong>=CONT.SE()</strong> e <strong>=SOMASE()</strong></li>
                    <li>Fixação e referências absolutas <strong>$A$1</strong></li>
                    <li>Classificação e filtros de tabela dinâmica</li>
                  </ul>
                </div>

                <div className="p-3.5 bg-[#131f3b] border border-purple-500/40 rounded-xl space-y-2">
                  <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 font-mono font-bold text-[10px]">
                    EXPANSÃO PLANEJADA
                  </span>
                  <h4 className="font-bold text-white text-sm">Nível 3 — Avançado</h4>
                  <ul className="list-disc pl-4 space-y-1 text-slate-300 text-[11px]">
                    <li>Pesquisa vertical moderna <strong>=PROCV()</strong> e <strong>=PROCX()</strong></li>
                    <li>Modelagem com <strong>Tabelas Dinâmicas</strong></li>
                    <li>Gráficos executivos interativos de barras e linhas</li>
                    <li>Análise de dados industriais e dashboards SENAI</li>
                  </ul>
                </div>
              </div>

              {/* Integration Note */}
              <div className="p-3 bg-slate-900/90 border border-slate-700 rounded-xl flex items-start gap-2.5 text-xs text-slate-400">
                <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <p>
                  <strong>Estrutura de Integração do Google Formulários:</strong> O sistema não inventa listas de alunos fictícias nem simula respostas falsas. Para integração autorizada futura com relatórios reais de entrega, a arquitetura está preparada para receber consultas seguras à planilha vinculada ao formulário.
                </p>
              </div>
            </div>
          )}

          {/* TAB 5: MODO ROOT / PROFESSOR (IMORTAL & DEMONSTRAÇÃO) */}
          {activeTab === 'root' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 bg-gradient-to-r from-amber-950/60 via-slate-900 to-indigo-950/60 border-2 border-amber-500/50 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-amber-300 font-bold uppercase">
                      CONTROLES ROOT DO PROFESSOR
                    </span>
                    <h3 className="text-base font-black text-white">
                      Modo Deus (Imortal) & Demonstração para a Turma
                    </h3>
                  </div>
                  <div className="px-3 py-1 bg-amber-500/20 border border-amber-400/40 rounded-xl text-xs font-bold text-amber-300 font-mono">
                    ACESSO SUPERUSER
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Como professor e usuário ROOT, você pode navegar livremente por todas as fases sem morrer, atravessar obstáculos e abrir a tela de encerramento estilo Street Fighter para demonstrar aos alunos no projetor.
                </p>
              </div>

              {/* Master Control Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* God Mode Toggle */}
                <div className="p-4 bg-slate-900 border border-slate-700 rounded-2xl flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="font-extrabold text-white text-sm block">
                      🛡️ Senaizinho Imortal (God Mode)
                    </span>
                    <span className="text-[11px] text-slate-400 block">
                      Vidas infinitas, sem dano por robôs ou buracos
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      soundManager.playPowerUp();
                      onToggleGodMode(!isGodMode);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition active:scale-95 ${
                      isGodMode
                        ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/30'
                        : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-600'
                    }`}
                  >
                    {isGodMode ? 'ATIVADO' : 'DESATIVADO'}
                  </button>
                </div>

                {/* Unlock All Stages */}
                <div className="p-4 bg-slate-900 border border-slate-700 rounded-2xl flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="font-extrabold text-white text-sm block">
                      🔓 Desbloquear 10 Fases
                    </span>
                    <span className="text-[11px] text-slate-400 block">
                      Libera acesso instantâneo a todas as fases
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      soundManager.playSuccess();
                      onUnlockAllStages();
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition active:scale-95"
                  >
                    Desbloquear
                  </button>
                </div>

                {/* Show Street Fighter Ending */}
                <div className="p-4 bg-slate-900 border border-slate-700 rounded-2xl flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="font-extrabold text-white text-sm block">
                      🥊 Exibir Final Street Fighter
                    </span>
                    <span className="text-[11px] text-slate-400 block">
                      Mostra a tela arcade de zeramento do jogo
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      onClose();
                      onShowEnding();
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white rounded-xl text-xs font-bold transition active:scale-95"
                  >
                    Ver Final
                  </button>
                </div>

                {/* Show Trailer */}
                <div className="p-4 bg-slate-900 border border-slate-700 rounded-2xl flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="font-extrabold text-white text-sm block">
                      🎬 Reproduzir Trailer 8-Bit
                    </span>
                    <span className="text-[11px] text-slate-400 block">
                      Trailer com música Carry on Wayward Son
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      onClose();
                      onShowTrailer();
                    }}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition active:scale-95"
                  >
                    Ver Trailer
                  </button>
                </div>
              </div>

              {/* Attribution Signature Box */}
              <div className="p-4 bg-[#091124] border border-slate-700/80 rounded-2xl flex items-center justify-between text-xs text-slate-300">
                <div className="space-y-0.5">
                  <div className="font-bold text-white">
                    Instrutor de Formação Profissional do SENAI-SP Rafael Pereira
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    Escola SENAI “Orlando Laviero Ferraiuolo” • Metodologia Ativa de Ensino com Games
                  </div>
                </div>
                <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 px-2.5 py-1 rounded-lg border border-cyan-500/40">
                  SENAI-SP 2026
                </span>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-[#091024] border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition"
          >
            Fechar Painel
          </button>
        </div>

      </div>
    </div>
  );
};
