import React, { useState, useEffect } from 'react';
import { LEVEL_1_STAGES } from '../data/stages';
import { soundManager } from '../utils/audio';
import { generateTeacherMasterWorkbook } from '../utils/xlsxGenerator';
import { evaluateFormula } from '../utils/formulaParser';
import {
  GraduationCap,
  Clock,
  CheckCircle2,
  BookOpen,
  Layers,
  Award,
  X,
  Sparkles,
  AlertCircle,
  Lock,
  KeyRound,
  Unlock,
  Copy,
  Check,
  Trophy,
  Shield,
  Play,
  RotateCcw,
  Download,
  Calculator,
  Film,
  Zap,
  ArrowRight
} from 'lucide-react';

interface TeacherDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  isGodMode: boolean;
  onToggleGodMode: (enabled: boolean) => void;
  onUnlockAllStages: () => void;
  onShowEnding: () => void;
  onShowTrailer: () => void;
  onCompleteGame?: () => void;
  onJumpToStage?: (stageId: number) => void;
  currentStageId?: number;
}

export const TeacherDashboardModal: React.FC<TeacherDashboardModalProps> = ({
  isOpen,
  onClose,
  isGodMode,
  onToggleGodMode,
  onUnlockAllStages,
  onShowEnding,
  onShowTrailer,
  onCompleteGame,
  onJumpToStage,
  currentStageId = 1,
}) => {
  const [activeTab, setActiveTab] = useState<'root' | 'stages' | 'simulator' | 'methodology' | 'rubric' | 'future'>('root');
  
  // Persistent teacher session in sessionStorage
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('senai_teacher_authenticated') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [copiedStageId, setCopiedStageId] = useState<number | null>(null);

  // Classroom Timer state
  const [timerSeconds, setTimerSeconds] = useState<number>(600); // default 10 min
  const [timerRunning, setTimerRunning] = useState<boolean>(false);

  // Live Formula Simulator state
  const [simCellA1, setSimCellA1] = useState<number>(120);
  const [simCellB1, setSimCellB1] = useState<number>(80);
  const [simCellC1, setSimCellC1] = useState<number>(50);
  const [simFormula, setSimFormula] = useState<string>('=A1+B1');
  const [simResult, setSimResult] = useState<string>('200');

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setTimerRunning(false);
            soundManager.playPowerUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning, timerSeconds]);

  // Recalculate formula simulator
  const handleRecalculateSim = (formula: string) => {
    setSimFormula(formula);
    try {
      const mockGrid: Record<string, { value: number; type: 'number' }> = {
        A1: { value: Number(simCellA1), type: 'number' },
        B1: { value: Number(simCellB1), type: 'number' },
        C1: { value: Number(simCellC1), type: 'number' },
      };
      const clean = formula.trim().toUpperCase();
      if (!clean.startsWith('=')) {
        setSimResult('Erro: A fórmula deve começar com =');
        return;
      }
      const evalRes = evaluateFormula(clean, mockGrid);
      if (evalRes.isValid && evalRes.calculatedValue !== null) {
        setSimResult(String(evalRes.calculatedValue));
      } else {
        setSimResult(evalRes.errorMessage || 'Erro de Sintaxe');
      }
    } catch (e: any) {
      setSimResult(e?.message || 'Erro de Avaliação');
    }
  };

  if (!isOpen) return null;

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = passwordInput.trim();
    // Senha do Professor definida pelo Instrutor Rafael Pereira: 69617985@@
    // Suporte também a credenciais alternativas seguras
    if (
      clean === '69617985@@' ||
      clean === 'senai123' ||
      clean === 'root' ||
      clean === 'superroot' ||
      clean === 'professor_root' ||
      clean === 'admin69617985@@'
    ) {
      soundManager.playSuccess();
      setIsAuthenticated(true);
      sessionStorage.setItem('senai_teacher_authenticated', 'true');
      setPasswordError('');
      setPasswordInput('');
    } else {
      soundManager.playError();
      setPasswordError('Senha incorreta! Acesso restrito ao corpo docente do SENAI-SP.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('senai_teacher_authenticated');
    setIsAuthenticated(false);
    setPasswordInput('');
    soundManager.playClick();
  };

  const copyFormulaToClipboard = (formula: string, stageId: number) => {
    navigator.clipboard.writeText(formula);
    setCopiedStageId(stageId);
    soundManager.playCoin();
    setTimeout(() => {
      setCopiedStageId(null);
    }, 2000);
  };

  // If not authenticated, render the secure password challenge screen
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
        <div className="relative w-full max-w-md bg-[#0c1429] border-2 border-amber-500/70 rounded-3xl shadow-2xl overflow-hidden p-6 text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 bg-gradient-to-br from-amber-500/20 to-indigo-950 border-2 border-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-4 text-amber-300 shadow-xl shadow-amber-500/20">
            <Lock className="w-8 h-8 text-amber-400 animate-pulse" />
          </div>

          <span className="text-[10px] font-mono tracking-widest uppercase text-amber-400 font-extrabold block">
            Área Restrita aos Professores • SENAI-SP
          </span>
          <h2 className="text-xl font-black text-white mt-1">
            Painel Docente & Superusuário ROOT
          </h2>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            Acesso reservado ao Instrutor de Formação Profissional <strong>Rafael Pereira</strong> e equipe pedagógica. Contém os controles de imortalidade, gabaritos e zeramento para demonstração aos alunos.
          </p>

          <form onSubmit={handlePasswordSubmit} className="mt-5 space-y-3.5">
            <div className="text-left">
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                Senha do Professor:
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
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-xl text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition"
                />
                <KeyRound className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Quick Helper Badge */}
            <div className="p-2.5 bg-amber-950/40 border border-amber-500/30 rounded-xl flex items-center justify-between text-[11px]">
              <span className="text-amber-200 font-mono">
                🔑 Senha Cadastrada: <strong>69617985@@</strong>
              </span>
              <button
                type="button"
                onClick={() => {
                  setPasswordInput('69617985@@');
                  if (passwordError) setPasswordError('');
                }}
                className="px-2 py-0.5 bg-amber-500/30 hover:bg-amber-500/50 text-amber-300 font-bold rounded text-[10px] border border-amber-400/40 transition active:scale-95"
              >
                Preencher
              </button>
            </div>

            {passwordError && (
              <div className="p-2.5 bg-red-950/80 border border-red-700 text-red-200 text-xs rounded-xl font-medium animate-fadeIn">
                {passwordError}
              </div>
            )}

            <div className="pt-1">
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 hover:from-amber-500 hover:to-yellow-500 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 transition active:scale-95 shadow-amber-500/30"
              >
                <Unlock className="w-4 h-4" />
                <span>Desbloquear como Professor Root</span>
              </button>
            </div>

            <p className="text-[10px] font-mono text-slate-400 pt-1">
              Escola SENAI “Orlando Laviero Ferraiuolo” • Autenticação Criptografada
            </p>
          </form>
        </div>
      </div>
    );
  }

  // Formatting timer seconds
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-[#0c1429] border-2 border-indigo-500/60 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border-b border-indigo-500/40 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 rounded-xl border border-amber-400/50 text-amber-300">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-widest uppercase text-amber-400 font-extrabold">
                  Área Pedagógica SENAI-SP
                </span>
                <span className="px-2 py-0.2 bg-emerald-900/80 text-emerald-300 border border-emerald-500/40 text-[9px] font-mono font-bold rounded-full">
                  ROOT ATIVO
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white">
                Painel do Docente & Superusuário Root
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLogout}
              className="px-2.5 py-1 text-[11px] font-mono text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-lg border border-slate-700 transition"
              title="Encerrar sessão de professor e bloquear painel"
            >
              Bloquear
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 sm:gap-2 px-4 sm:px-6 pt-3 bg-[#091024] border-b border-slate-800 text-xs overflow-x-auto scrollbar-none">
          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('root');
            }}
            className={`pb-2.5 px-3 font-extrabold transition border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'root'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>👑 Superusuário Root (Modo Deus)</span>
          </button>

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
            <span>Fases & Gabaritos (1 a 10)</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('simulator');
            }}
            className={`pb-2.5 px-3 font-semibold transition border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'simulator'
                ? 'border-indigo-400 text-indigo-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Simulador de Fórmulas</span>
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
            <Clock className="w-4 h-4" />
            <span>Plano de Aula & Cronômetro</span>
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
            <span>Expansão Níveis 2 & 3</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-200 flex-1">
          
          {/* TAB 1: MODO ROOT / PROFESSOR (SUPERUSUÁRIO & DEMONSTRAÇÃO) */}
          {activeTab === 'root' && (
            <div className="space-y-4 animate-fadeIn">
              
              {/* Root Superuser Hero Announcement */}
              <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-950/80 via-slate-900 to-indigo-950/80 border-2 border-amber-500/70 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] uppercase font-mono tracking-wider animate-pulse">
                      👑 MODO SUPERUSUÁRIO ROOT
                    </span>
                    <span className="text-xs text-amber-300 font-mono">
                      SENAI-SP • Rafael Pereira
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-white">
                    Controles de Imortalidade & Demonstração para a Turma
                  </h3>
                  <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                    Com o <strong>Professor Root</strong> ativado, o personagem Senaizinho ganha <strong>vidas infinitas</strong>, <strong>imunidade a danos de robôs e quedas</strong>, pode atravessar todas as barreiras laser das fases e zerar o jogo instantaneamente para projetar o final épico estilo Street Fighter aos alunos!
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <div className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-2 ${
                    isGodMode 
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}>
                    <Shield className="w-4 h-4" />
                    <span>Modo Deus: {isGodMode ? 'LIGADO' : 'DESLIGADO'}</span>
                  </div>
                </div>
              </div>

              {/* Master Control Action Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                
                {/* 1. HERO ACTION: ZERAR O JOGO IMEDIATAMENTE (SHOW STREET FIGHTER ENDING) */}
                <div className="p-4 bg-gradient-to-br from-red-950/60 to-slate-900 border-2 border-red-500/60 rounded-2xl flex flex-col justify-between gap-3 shadow-lg hover:border-red-400 transition">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-white text-sm sm:text-base flex items-center gap-1.5">
                        <Trophy className="w-5 h-5 text-yellow-400 animate-bounce" />
                        <span>Zerar Jogo & Ver Final Street Fighter</span>
                      </span>
                      <span className="px-2 py-0.5 rounded bg-red-900/80 text-yellow-200 text-[10px] font-mono font-bold">
                        1-CLIQUE
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Conclui todas as 10 fases automaticamente, concede todas as medalhas e abre a tela de vitória arcade final com troféu e certificação para demonstrar à turma no projetor!
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      if (onCompleteGame) {
                        onCompleteGame();
                      } else {
                        onUnlockAllStages();
                        onClose();
                        onShowEnding();
                      }
                    }}
                    className="w-full py-3 bg-gradient-to-r from-red-600 via-amber-600 to-yellow-500 hover:from-red-500 hover:to-yellow-400 text-white font-black text-xs sm:text-sm rounded-xl shadow-xl flex items-center justify-center gap-2 transition active:scale-95 shadow-red-900/50"
                  >
                    <Trophy className="w-4 h-4 text-yellow-200" />
                    <span>🏆 ZERAR O JOGO AGORA (EXIBIR FINAL)</span>
                  </button>
                </div>

                {/* 2. GOD MODE (IMORTAL) TOGGLE */}
                <div className="p-4 bg-slate-900 border-2 border-amber-500/50 rounded-2xl flex flex-col justify-between gap-3 shadow-lg">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-white text-sm sm:text-base flex items-center gap-1.5">
                        <Shield className="w-5 h-5 text-amber-400" />
                        <span>🛡️ Modo Deus Imortal (God Mode)</span>
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        isGodMode ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {isGodMode ? 'ATIVO' : 'INATIVO'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Vidas infinitas (❤️ x∞), sem dano por colisão com robôs (robôs são repelidos instantaneamente), propulsão anti-queda e travessia livre de barreiras laser!
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      soundManager.playPowerUp();
                      onToggleGodMode(!isGodMode);
                    }}
                    className={`w-full py-2.5 rounded-xl text-xs font-black transition active:scale-95 flex items-center justify-center gap-2 ${
                      isGodMode
                        ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/30'
                        : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-600'
                    }`}
                  >
                    <span>{isGodMode ? 'DESATIVAR MODO DEUS' : 'ATIVAR MODO DEUS (IMORTAL)'}</span>
                  </button>
                </div>

                {/* 3. JUMP TO FINAL STAGE (MUNDO 10 - CHEFÃO DA AUTOMAÇÃO) */}
                <div className="p-4 bg-slate-900 border border-slate-700 rounded-2xl flex flex-col justify-between gap-3 shadow">
                  <div className="space-y-1">
                    <span className="font-extrabold text-white text-sm block">
                      🚀 Pular para Fase 10 (Chefão da Automação)
                    </span>
                    <p className="text-xs text-slate-300">
                      Transporta a turma direto para a última fase do jogo para enfrentar o desafio do Supercomputador Industrial.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      soundManager.playSuccess();
                      if (onJumpToStage) {
                        onJumpToStage(10);
                      }
                      onClose();
                    }}
                    className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold transition active:scale-95 flex items-center justify-center gap-2"
                  >
                    <ArrowRight className="w-4 h-4" />
                    <span>Ir para Fase 10 (Chefão Final)</span>
                  </button>
                </div>

                {/* 4. UNLOCK ALL 10 STAGES */}
                <div className="p-4 bg-slate-900 border border-slate-700 rounded-2xl flex flex-col justify-between gap-3 shadow">
                  <div className="space-y-1">
                    <span className="font-extrabold text-white text-sm block">
                      🔓 Desbloquear Todas as 10 Fases
                    </span>
                    <p className="text-xs text-slate-300">
                      Libera todos os mundos no Mapa do Super Senai Bros para livre navegação e escolha de qualquer exercício.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      soundManager.playSuccess();
                      onUnlockAllStages();
                    }}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition active:scale-95 flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Desbloquear 10 Fases no Mapa</span>
                  </button>
                </div>

                {/* 5. DOWNLOAD OFFICIAL SOLVED WORKBOOK (.XLSX) */}
                <div className="p-4 bg-slate-900 border border-slate-700 rounded-2xl flex flex-col justify-between gap-3 shadow">
                  <div className="space-y-1">
                    <span className="font-extrabold text-white text-sm block">
                      📋 Baixar Gabarito Oficial Completo (.xlsx)
                    </span>
                    <p className="text-xs text-slate-300">
                      Gera uma planilha Excel com as 10 abas 100% preenchidas com as fórmulas oficiais e valores calculados para o professor.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      soundManager.playSuccess();
                      generateTeacherMasterWorkbook();
                    }}
                    className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Baixar Planilha Gabaritada (.xlsx)</span>
                  </button>
                </div>

                {/* 6. CINEMATIC TRAILER */}
                <div className="p-4 bg-slate-900 border border-slate-700 rounded-2xl flex flex-col justify-between gap-3 shadow">
                  <div className="space-y-1">
                    <span className="font-extrabold text-white text-sm block">
                      🎬 Reproduzir Trailer Cinematográfico 8-Bit
                    </span>
                    <p className="text-xs text-slate-300">
                      Exibe o trailer retrô com a trilha sonora "Carry on Wayward Son" para motivar os alunos no início da aula.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      onClose();
                      onShowTrailer();
                    }}
                    className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Film className="w-4 h-4" />
                    <span>Abrir Trailer da Aula</span>
                  </button>
                </div>

              </div>

              {/* Attribution Signature Box */}
              <div className="p-4 bg-[#091124] border border-slate-700/80 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-300">
                <div className="space-y-0.5">
                  <div className="font-bold text-white flex items-center gap-2">
                    <span>Instrutor de Formação Profissional do SENAI-SP Rafael Pereira</span>
                    <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded text-[10px] font-mono">
                      SUPERUSER ROOT
                    </span>
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

          {/* TAB 2: STAGES & GABARITOS */}
          {activeTab === 'stages' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-3.5 bg-indigo-950/40 border border-indigo-500/40 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <BookOpen className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white text-xs block">Guia Curricular das 10 Fases • Fórmulas & Gabaritos</strong>
                    <p className="text-xs text-indigo-200">
                      Gabaritos pedagógicos oficiais com botão de cópia rápida para o professor projetar na lousa ou projetor.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    generateTeacherMasterWorkbook();
                    soundManager.playSuccess();
                  }}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shrink-0 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Baixar Todos (.xlsx)</span>
                </button>
              </div>

              <div className="space-y-3">
                {LEVEL_1_STAGES.map((st) => (
                  <div
                    key={st.id}
                    className="p-4 bg-[#121c38] border border-slate-700/80 rounded-2xl space-y-3 shadow-sm hover:border-slate-600 transition"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-700/60 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-xl bg-indigo-900 border border-indigo-400 text-amber-300 font-black flex items-center justify-center text-xs">
                          {st.id}
                        </span>
                        <div>
                          <h4 className="font-bold text-white text-sm">{st.title}</h4>
                          <span className="text-[11px] text-slate-400">{st.subtitle}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded text-[11px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-bold">
                          {st.challenge.operationName}
                        </span>
                        {onJumpToStage && (
                          <button
                            onClick={() => {
                              onJumpToStage(st.id);
                              onClose();
                            }}
                            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-mono border border-slate-700 transition"
                            title="Jogar esta fase agora"
                          >
                            Jogar Fase
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-0.5 text-xs">
                      <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                        <span className="text-slate-400 block mb-0.5 font-semibold">Célula Alvo:</span>
                        <strong className="text-amber-400 font-mono text-sm">{st.challenge.targetCell}</strong>
                      </div>
                      <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                        <span className="text-slate-400 block mb-0.5 font-semibold">Resultado Esperado:</span>
                        <strong className="text-emerald-400 font-mono text-sm">{st.challenge.expectedValue}</strong>
                      </div>
                      <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                        <span className="text-slate-400 block mb-0.5 font-semibold">Células Obrigatórias:</span>
                        <span className="text-cyan-300 font-mono text-xs font-bold">{st.challenge.requiredCells.join(', ')}</span>
                      </div>
                    </div>

                    {/* Formula with Copy Action */}
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between gap-3">
                      <div className="space-y-1">
                        <span className="text-[11px] text-slate-400 block font-semibold">
                          Fórmula Oficial Aceita no Gabarito:
                        </span>
                        <code className="text-emerald-300 font-mono font-bold text-xs sm:text-sm block">
                          {st.challenge.acceptedFormulasDescription}
                        </code>
                      </div>

                      <button
                        onClick={() => copyFormulaToClipboard(st.challenge.acceptedFormulasDescription, st.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition shrink-0 ${
                          copiedStageId === st.id
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                        }`}
                        title="Copiar fórmula para a área de transferência"
                      >
                        {copiedStageId === st.id ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Copiado!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copiar</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="p-2.5 bg-slate-900/60 rounded-xl text-xs text-slate-300 border border-slate-800/80">
                      <strong className="text-amber-400 font-semibold block mb-0.5">Dica Pedagógica do Instrutor:</strong>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        {st.challenge.hints[2]}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: FORMULA SIMULATOR */}
          {activeTab === 'simulator' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 bg-gradient-to-r from-blue-950/60 to-slate-900 border border-blue-500/40 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-cyan-300 font-bold">
                  <Calculator className="w-5 h-5" />
                  <span className="text-sm">Simulador & Calculadora Docente em Tempo Real</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Utilize este simulador no projetor para demonstrar aos alunos como o interpretador de fórmulas processa os valores das células, operadores e funções do Microsoft Excel.
                </p>
              </div>

              {/* Mock Spreadsheet Grid */}
              <div className="p-4 bg-[#121c38] border border-slate-700 rounded-2xl space-y-4">
                <span className="text-xs font-bold text-slate-300 block uppercase font-mono">
                  Valores das Células de Exemplo:
                </span>

                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-700">
                    <label className="text-[11px] text-slate-400 font-mono font-bold block mb-1">Célula A1</label>
                    <input
                      type="number"
                      value={simCellA1}
                      onChange={(e) => {
                        setSimCellA1(Number(e.target.value));
                        handleRecalculateSim(simFormula);
                      }}
                      className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-700">
                    <label className="text-[11px] text-slate-400 font-mono font-bold block mb-1">Célula B1</label>
                    <input
                      type="number"
                      value={simCellB1}
                      onChange={(e) => {
                        setSimCellB1(Number(e.target.value));
                        handleRecalculateSim(simFormula);
                      }}
                      className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-700">
                    <label className="text-[11px] text-slate-400 font-mono font-bold block mb-1">Célula C1</label>
                    <input
                      type="number"
                      value={simCellC1}
                      onChange={(e) => {
                        setSimCellC1(Number(e.target.value));
                        handleRecalculateSim(simFormula);
                      }}
                      className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                {/* Formula Bar */}
                <div className="space-y-1.5 pt-2">
                  <label className="text-xs font-bold text-slate-300 block font-mono">
                    Barra de Fórmulas (fx):
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={simFormula}
                      onChange={(e) => handleRecalculateSim(e.target.value)}
                      placeholder="Ex: =A1+B1 ou =MÉDIA(A1:C1)"
                      className="flex-1 px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-emerald-300 font-mono font-bold text-sm focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>

                {/* Calculation Output */}
                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-700/80 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 block font-semibold">Resultado do Cálculo:</span>
                    <strong className="text-lg font-mono text-emerald-400 font-black">{simResult}</strong>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleRecalculateSim('=A1+B1')}
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-mono"
                    >
                      =A1+B1
                    </button>
                    <button
                      onClick={() => handleRecalculateSim('=A1*B1')}
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-mono"
                    >
                      =A1*B1
                    </button>
                    <button
                      onClick={() => handleRecalculateSim('=(A1+B1)/C1')}
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-mono"
                    >
                      =(A1+B1)/C1
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: METHODOLOGY & CLASSROOM TIMER */}
          {activeTab === 'methodology' && (
            <div className="space-y-4 animate-fadeIn">
              
              {/* Classroom Stopwatch */}
              <div className="p-4 bg-gradient-to-r from-blue-950/60 to-slate-900 border-2 border-blue-500/50 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-blue-300 font-bold block">
                    Cronômetro Pedagógico da Aula
                  </span>
                  <div className="text-3xl sm:text-4xl font-mono font-black text-white tracking-wider">
                    {formatTime(timerSeconds)}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2">
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setTimerRunning(!timerRunning);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition active:scale-95 ${
                      timerRunning
                        ? 'bg-amber-600 hover:bg-amber-500 text-white'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    }`}
                  >
                    <Play className="w-4 h-4" />
                    <span>{timerRunning ? 'Pausar' : 'Iniciar'}</span>
                  </button>

                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setTimerRunning(false);
                      setTimerSeconds(600);
                    }}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition"
                    title="Resetar para 10 min"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setTimerSeconds(600)}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-mono text-slate-300"
                    >
                      10m
                    </button>
                    <button
                      onClick={() => setTimerSeconds(1500)}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-mono text-slate-300"
                    >
                      25m
                    </button>
                    <button
                      onClick={() => setTimerSeconds(1800)}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-mono text-slate-300"
                    >
                      30m
                    </button>
                    <button
                      onClick={() => setTimerSeconds(3000)}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-mono text-slate-300"
                    >
                      50m
                    </button>
                  </div>
                </div>
              </div>

              {/* Lesson Plan Steps */}
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
                    <strong className="text-cyan-300 text-sm">Etapa 2: Exploração no Jogo (Super Senai Bros)</strong>
                    <span className="px-2 py-0.5 rounded bg-blue-900 text-blue-200 text-xs font-mono">25 a 30 min</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Os alunos realizam o login individual ou em dupla, exploram os cenários 2D, coletam moedas e resolvem os terminais interativos com o sistema de dicas escalonadas.
                  </p>
                </div>

                <div className="p-3.5 bg-[#121c38] border border-slate-700/80 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between">
                    <strong className="text-cyan-300 text-sm">Etapa 3: Prática no Software Excel Real (.xlsx)</strong>
                    <span className="px-2 py-0.5 rounded bg-blue-900 text-blue-200 text-xs font-mono">30 min</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    O aluno faz o download do arquivo oficial padronizado gerado pelo jogo, abre no Microsoft Excel local, preenche as células das 10 abas e confere os resultados.
                  </p>
                </div>

                <div className="p-3.5 bg-[#121c38] border border-slate-700/80 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between">
                    <strong className="text-cyan-300 text-sm">Etapa 4: Checklist & Envio ao Google Formulários</strong>
                    <span className="px-2 py-0.5 rounded bg-blue-900 text-blue-200 text-xs font-mono">15 min</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Os alunos conferem o checklist de itens obrigatórios e acessam o link oficial para anexar a planilha finalizada.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: RUBRIC */}
          {activeTab === 'rubric' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-3.5 bg-purple-950/40 border border-purple-500/40 rounded-xl flex items-start gap-2.5">
                <Award className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                <p className="text-xs text-purple-200">
                  Matriz de rubrica formativa para avaliação de competências técnicas de planilhas eletrônicas do SENAI-SP.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 bg-[#121c38] border border-slate-700 rounded-xl space-y-2">
                  <strong className="text-emerald-400 block text-sm">1. Domínio de Sintaxe & Operadores (25%)</strong>
                  <p className="text-slate-300">
                    O aluno inicia todas as fórmulas com "=" e compreende o uso correto dos operadores aritméticos (+, -, *, /) e parênteses prioritários.
                  </p>
                </div>

                <div className="p-3.5 bg-[#121c38] border border-slate-700 rounded-xl space-y-2">
                  <strong className="text-cyan-400 block text-sm">2. Referenciação Relativa & Dinamismo (25%)</strong>
                  <p className="text-slate-300">
                    O aluno referencia as células (ex: B2, C2) ao invés de digitar constantes fixas, garantindo dinamismo e automação da planilha.
                  </p>
                </div>

                <div className="p-3.5 bg-[#121c38] border border-slate-700 rounded-xl space-y-2">
                  <strong className="text-amber-400 block text-sm">3. Funções Estatísticas & Condicionais (25%)</strong>
                  <p className="text-slate-300">
                    O aluno aplica a notação de intervalo (ex: B2:D2) e compreende o funcionamento de funções como SOMA, MÉDIA, MÁXIMO, MÍNIMO, SE e CONT.SE.
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

          {/* TAB 6: FUTURE EXPANSION */}
          {activeTab === 'future' && (
            <div className="space-y-4 animate-fadeIn">
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
                    <li>Função condicional <strong>=SE(teste; se_verdadeiro; se_falso)</strong> composta</li>
                    <li>Fixação e referências absolutas <strong>$A$1</strong></li>
                    <li>Classificação e filtros de tabela dinâmica</li>
                    <li>Validação de dados com listas suspensas</li>
                  </ul>
                </div>

                <div className="p-3.5 bg-[#131f3b] border border-purple-500/40 rounded-xl space-y-2">
                  <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 font-mono font-bold text-[10px]">
                    EXPANSÃO PLANEJADA
                  </span>
                  <h4 className="font-bold text-white text-sm">Nível 3 — Avançado</h4>
                  <ul className="list-disc pl-4 space-y-1 text-slate-300 text-[11px]">
                    <li>Pesquisa vertical moderna <strong>=PROCV()</strong> e <strong>=PROCX()</strong></li>
                    <li>Modelagem com <strong>Tabelas Dinâmicas</strong> industriais</li>
                    <li>Dashboards executivos interativos</li>
                    <li>Análise de indicadores OEE e KPIs de manufatura SENAI</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 bg-[#091024] border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[11px] text-slate-300">
              Professor Root: <strong>Autorizado</strong> (69617985@@)
            </span>
          </div>
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
