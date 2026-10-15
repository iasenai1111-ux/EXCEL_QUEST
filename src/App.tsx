import React, { useState, useEffect, useCallback } from 'react';
import { GameMode, StudentProfile, GameProgress, StageDefinition } from './types/game';
import { LEVEL_1_STAGES } from './data/stages';
import {
  loadStudentProfile,
  saveStudentProfile,
  loadGameProgress,
  saveGameProgress,
  resetGameProgress
} from './utils/storage';
import { generateStudentWorkbook } from './utils/xlsxGenerator';
import { soundManager } from './utils/audio';

// Components
import { Header } from './components/Header';
import { MainMenu } from './components/MainMenu';
import { GameCanvas } from './components/GameCanvas';
import { MiniExcelModal } from './components/MiniExcelModal';
import { RealExcelModal } from './components/RealExcelModal';
import { StudentIdModal } from './components/StudentIdModal';
import { SubmitWorkModal } from './components/SubmitWorkModal';
import { TeacherDashboardModal } from './components/TeacherDashboardModal';
import { AchievementsModal } from './components/AchievementsModal';
import { HowToPlayModal } from './components/HowToPlayModal';
import { StageCompleteModal } from './components/StageCompleteModal';
import { VictoryScreenModal } from './components/VictoryScreenModal';
import { WorldMapModal } from './components/WorldMapModal';
import { SettingsModal } from './components/SettingsModal';
import { GameOverModal } from './components/GameOverModal';
import { TrailerModal } from './components/TrailerModal';

import { FileSpreadsheet, Sparkles, Map, ChevronLeft, ChevronRight, Trophy, Play } from 'lucide-react';

export default function App() {
  // Game states
  const [gameMode, setGameMode] = useState<GameMode>('menu');
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [progress, setProgress] = useState<GameProgress>(loadGameProgress());
  const [currentStageId, setCurrentStageId] = useState<number>(1);
  const [stageRestartToken, setStageRestartToken] = useState(0);
  const [isRootGodMode, setIsRootGodMode] = useState<boolean>(false);

  // Modals state
  const [isStudentIdOpen, setIsStudentIdOpen] = useState(false);
  const [isMiniExcelOpen, setIsMiniExcelOpen] = useState(false);
  const [isRealExcelOpen, setIsRealExcelOpen] = useState(false);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [isTeacherDashboardOpen, setIsTeacherDashboardOpen] = useState(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);
  const [isStageCompleteOpen, setIsStageCompleteOpen] = useState(false);
  const [isVictoryOpen, setIsVictoryOpen] = useState(false);
  const [isWorldMapOpen, setIsWorldMapOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [youtubeVideoId, setYoutubeVideoId] = useState('');
  const [isGameOverOpen, setIsGameOverOpen] = useState(false);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  // Load profile on start
  useEffect(() => {
    const loadedProfile = loadStudentProfile();
    if (loadedProfile) {
      setProfile(loadedProfile);
    }
  }, []);

  // Save progress whenever it updates
  useEffect(() => {
    saveGameProgress(progress);
  }, [progress]);

  // Current stage definition
  const currentStage: StageDefinition =
    LEVEL_1_STAGES.find((s) => s.id === currentStageId) || LEVEL_1_STAGES[0];

  const isCurrentStageCompleted = progress.completedStages.includes(currentStageId);
  const isCurrentStageRealExcelDone = progress.realExcelConfirmedStages.includes(currentStageId);

  // Helper to award medals
  const grantMedal = (medalId: string, currentMedals: string[]): string[] => {
    if (currentMedals.includes(medalId)) return currentMedals;
    return [...currentMedals, medalId];
  };

  // Start game flow
  const handleStartGame = () => {
    if (!profile) {
      setIsStudentIdOpen(true);
      return;
    }
    setCurrentStageId(1);
    setGameMode('playing');
    if (!youtubeVideoId) soundManager.startGameplayBGM();
  };

  const handleContinueGame = () => {
    if (!profile) {
      setIsStudentIdOpen(true);
      return;
    }
    setCurrentStageId(progress.highestUnlockedStageId);
    setGameMode('playing');
    soundManager.startGameplayBGM();
  };

  const handleGoHome = () => {
    soundManager.stopBGM();
    setGameMode('menu');
  };

  // Game over reinicia a fase atual, sem apagar as fórmulas já resolvidas.
  const handleGameOver = () => {
    setIsGameOverOpen(true);
  };

  const handleSaveProfile = (newProfile: StudentProfile) => {
    setProfile(newProfile);
    saveStudentProfile(newProfile);
  };

  // Stage solved inside Mini-Excel
  const handleStageSuccess = (stageId: number, _formula: string, _value: number) => {
    setProgress((prev) => {
      const isAlreadyCompleted = prev.completedStages.includes(stageId);
      const nextCompleted = isAlreadyCompleted
        ? prev.completedStages
        : [...prev.completedStages, stageId];

      const nextStageId = stageId < LEVEL_1_STAGES.length ? stageId + 1 : stageId;
      const nextHighest = Math.max(prev.highestUnlockedStageId, nextStageId);
      const addedXp = isAlreadyCompleted ? 20 : 100;

      let nextMedals = [...prev.medals];
      // Medal for specific stages
      if (stageId === 1) nextMedals = grantMedal('addition_master', nextMedals);
      if (stageId === 2) nextMedals = grantMedal('subtraction_pro', nextMedals);
      if (stageId === 3) nextMedals = grantMedal('multiplication_champ', nextMedals);
      if (stageId === 4) nextMedals = grantMedal('average_guru', nextMedals);
      if (stageId === 5) nextMedals = grantMedal('boss_slayer', nextMedals);

      if (nextCompleted.length === LEVEL_1_STAGES.length) {
        nextMedals = grantMedal('senai_diploma', nextMedals);
      }

      return {
        ...prev,
        xp: prev.xp + addedXp,
        completedStages: nextCompleted,
        highestUnlockedStageId: nextHighest,
        medals: nextMedals,
      };
    });

    // Close Mini-Excel and trigger celebration modal
    setTimeout(() => {
      setIsMiniExcelOpen(false);
      setIsStageCompleteOpen(true);
    }, 900);
  };

  // Increment attempts counter for tiered smart hints
  const handleIncrementAttempt = (stageId: number) => {
    setProgress((prev) => {
      const currentAttempts = prev.attemptsPerStage[stageId] || 0;
      return {
        ...prev,
        attemptsPerStage: {
          ...prev.attemptsPerStage,
          [stageId]: currentAttempts + 1,
        },
      };
    });
  };

  // Coin collected in 2D canvas
  const handleCoinCollected = useCallback(() => {
    setProgress((prev) => {
      let nextMedals = grantMedal('first_steps', prev.medals);
      return {
        ...prev,
        coins: prev.coins + 1,
        xp: prev.xp + 10,
        medals: nextMedals,
      };
    });
  }, []);

  // Confirming practical work done in local Excel
  const handleConfirmRealExcelPractice = (stageId: number) => {
    setProgress((prev) => {
      if (prev.realExcelConfirmedStages.includes(stageId)) return prev;
      let nextMedals = grantMedal('excel_practitioner', prev.medals);
      return {
        ...prev,
        realExcelConfirmedStages: [...prev.realExcelConfirmedStages, stageId],
        xp: prev.xp + 50,
        medals: nextMedals,
      };
    });
  };

  // Navigating to next stage or victory
  const handleAdvanceStage = () => {
    setIsStageCompleteOpen(false);
    if (currentStageId < LEVEL_1_STAGES.length) {
      setCurrentStageId((prev) => prev + 1);
    } else {
      setIsVictoryOpen(true);
    }
  };

  // Importing portable progress code
  const handleImportProgress = (newProg: Partial<GameProgress>) => {
    setProgress((prev) => ({
      ...prev,
      ...newProg,
    }));
  };

  // Resetting progress
  const handleResetProgress = () => {
    const fresh = resetGameProgress();
    setProgress(fresh);
    setCurrentStageId(1);
    setGameMode('menu');
  };

  // Download XLSX helper
  const handleDownloadXlsx = () => {
    generateStudentWorkbook(profile);
  };

  return (
    <div className="min-h-screen bg-[#0b1329] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
      
      {/* Discreet Instructor Attribution Header Ribbon */}
      <div className="w-full bg-[#080d1e] border-b border-slate-800/80 px-3 py-1.5 text-center text-[11px] text-slate-400 flex items-center justify-center gap-2 select-none shadow-sm">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-semibold text-slate-200">
          Instrutor de Formação Profissional do SENAI-SP Rafael Pereira
        </span>
        <span className="text-slate-600 hidden sm:inline">•</span>
        <span className="text-slate-400 hidden sm:inline">Escola SENAI “Orlando Laviero Ferraiuolo”</span>
      </div>

      {/* Top Application Header */}
      <Header
        progress={progress}
        profile={profile}
        onOpenAchievements={() => setIsAchievementsOpen(true)}
        onOpenTeacherDashboard={() => setIsTeacherDashboardOpen(true)}
        onOpenSubmit={() => setIsSubmitOpen(true)}
        onOpenProfile={() => setIsStudentIdOpen(true)}
        onOpenMap={() => setIsWorldMapOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onGoHome={handleGoHome}
        onSelectStage={(id) => setCurrentStageId(id)}
        currentStageId={currentStageId}
        isInGame={gameMode === 'playing'}
      />

      {/* Main View Area */}
      <main className="flex-1 flex flex-col items-center justify-center">
        {gameMode === 'menu' ? (
          <MainMenu
            onPlay={handleStartGame}
            onContinue={handleContinueGame}
            onHowToPlay={() => setIsHowToPlayOpen(true)}
            onAchievements={() => setIsAchievementsOpen(true)}
            onTeacherDashboard={() => setIsTeacherDashboardOpen(true)}
            onOpenSubmit={() => setIsSubmitOpen(true)}
            onOpenProfile={() => setIsStudentIdOpen(true)}
            onOpenMap={() => setIsWorldMapOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenTrailer={() => setIsTrailerOpen(true)}
            progress={progress}
            profile={profile}
          />
        ) : (
          <div className="w-full max-w-6xl px-3 sm:px-6 py-4 flex flex-col items-center">
            
            {/* Stage Navigation / Breadcrumbs Bar */}
            <div className="w-full flex flex-wrap items-center justify-between gap-3 mb-3 p-3.5 bg-[#172747] rounded-2xl border border-[#334E77] shadow-lg">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    soundManager.playClick();
                    setGameMode('menu');
                  }}
                  className="px-3.5 py-2 btn-game btn-game-surface text-xs font-bold text-[#F8FAFC] flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4 text-[#22D3EE]" />
                  <span>Menu Principal</span>
                </button>

                <div className="h-5 w-px bg-[#334E77] mx-1 hidden sm:block" />

                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-[#F8FAFC] text-sm sm:text-base font-mono">
                    {currentStage.title}
                  </span>
                  <span className="text-xs text-[#22D3EE] font-mono hidden md:inline">
                    ({currentStage.subtitle})
                  </span>
                </div>
              </div>

              {/* Action shortcuts */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    soundManager.playTerminalOpen();
                    setIsMiniExcelOpen(true);
                  }}
                  className="px-3.5 py-2 btn-game btn-game-play text-xs flex items-center gap-1.5"
                >
                  <FileSpreadsheet className="w-4 h-4 text-white" />
                  <span>Terminal Mini-Excel</span>
                </button>

                <button
                  onClick={() => {
                    soundManager.playClick();
                    setIsRealExcelOpen(true);
                  }}
                  className="px-3.5 py-2 btn-game btn-game-continue text-xs flex items-center gap-1.5"
                >
                  <span>Excel Real (.xlsx)</span>
                </button>

                {/* Stage switcher navigation buttons */}
                {currentStageId > 1 && (
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setCurrentStageId((prev) => prev - 1);
                    }}
                    className="p-2 btn-game btn-game-surface text-[#CBD5E1]"
                    title="Fase Anterior"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                )}

                {currentStageId < LEVEL_1_STAGES.length &&
                  currentStageId < progress.highestUnlockedStageId && (
                    <button
                      onClick={() => {
                        soundManager.playClick();
                        setCurrentStageId((prev) => prev + 1);
                      }}
                      className="p-2 btn-game btn-game-surface text-[#CBD5E1]"
                      title="Próxima Fase Desbloqueada"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
              </div>
            </div>

            {/* The 2D Canvas Adventure Viewport */}
            <GameCanvas
              key={`${currentStageId}-${stageRestartToken}`}
              stage={currentStage}
              isStageCompleted={isCurrentStageCompleted}
              onOpenTerminal={() => setIsMiniExcelOpen(true)}
              onCoinCollected={handleCoinCollected}
              onGameOver={handleGameOver}
              isGodMode={isRootGodMode}
              onOpenSettings={() => setIsSettingsOpen(true)}
              onShowEnding={() => {
                soundManager.playVictory();
                setIsVictoryOpen(true);
              }}
              onOpenTeacherDashboard={() => {
                soundManager.playClick();
                setIsTeacherDashboardOpen(true);
              }}
              onReachExitPortal={() => {
                if (currentStageId < LEVEL_1_STAGES.length) {
                  setCurrentStageId((prev) => prev + 1);
                } else {
                  setIsVictoryOpen(true);
                }
              }}
            />

            {/* Quick Pedagogical Mission Brief Box below canvas */}
            <div className="w-full mt-4 p-4 bg-[#172747] border border-[#334E77] rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#22D3EE] font-bold">
                    Missão Atual:
                  </span>
                  <span className="font-bold text-[#F8FAFC] text-xs sm:text-sm">
                    {currentStage.challenge.instruction}
                  </span>
                </div>
                <p className="text-xs text-[#CBD5E1]">
                  {currentStage.storyIntro}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setIsMiniExcelOpen(true)}
                  className="px-4 py-2.5 btn-game btn-game-play text-xs flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#FFD166]" />
                  <span>Resolver Desafio</span>
                </button>
              </div>
            </div>

          </div>
        )}
      </main>

      {/* MODALS */}

      {/* 1. Student Identification */}
      <StudentIdModal
        isOpen={isStudentIdOpen}
        onClose={() => setIsStudentIdOpen(false)}
        currentProfile={profile}
        onSaveProfile={handleSaveProfile}
      />

      {/* 2. Interactive Mini-Excel (PRIORITY MAXIMUM) */}
      <MiniExcelModal
        stage={currentStage}
        isOpen={isMiniExcelOpen}
        onClose={() => setIsMiniExcelOpen(false)}
        onSuccess={handleStageSuccess}
        attemptsCount={progress.attemptsPerStage[currentStageId] || 0}
        onIncrementAttempt={handleIncrementAttempt}
      />

      {/* 3. Real Excel Practice & Download */}
      <RealExcelModal
        stage={currentStage}
        profile={profile}
        isOpen={isRealExcelOpen}
        onClose={() => setIsRealExcelOpen(false)}
        isConfirmed={isCurrentStageRealExcelDone}
        onConfirmPractice={handleConfirmRealExcelPractice}
        onNextStage={handleAdvanceStage}
      />

      {/* 4. Stage Complete Modal */}
      <StageCompleteModal
        stage={currentStage}
        isOpen={isStageCompleteOpen}
        onClose={() => setIsStageCompleteOpen(false)}
        onOpenRealExcel={() => {
          setIsStageCompleteOpen(false);
          setIsRealExcelOpen(true);
        }}
        onNextStage={handleAdvanceStage}
        hasNextStage={currentStageId < LEVEL_1_STAGES.length}
        isRealExcelDone={isCurrentStageRealExcelDone}
      />

      {/* 5. Final Victory Screen */}
      <VictoryScreenModal
        isOpen={isVictoryOpen}
        onClose={() => setIsVictoryOpen(false)}
        progress={progress}
        profile={profile}
        onOpenSubmit={() => {
          setIsVictoryOpen(false);
          setIsSubmitOpen(true);
        }}
        onDownloadWorkbook={handleDownloadXlsx}
      />

      {/* 6. Teacher Delivery Modal (Google Forms Checklist) */}
      <SubmitWorkModal
        isOpen={isSubmitOpen}
        onClose={() => setIsSubmitOpen(false)}
        profile={profile}
        completedStagesCount={progress.completedStages.length}
      />

      {/* 7. Teacher Dashboard Modal */}
      <TeacherDashboardModal
        isOpen={isTeacherDashboardOpen}
        onClose={() => setIsTeacherDashboardOpen(false)}
        isGodMode={isRootGodMode}
        onToggleGodMode={(val) => setIsRootGodMode(val)}
        onUnlockAllStages={() => {
          setProgress((prev) => ({
            ...prev,
            highestUnlockedStageId: LEVEL_1_STAGES.length,
            completedStages: LEVEL_1_STAGES.map((s) => s.id),
          }));
        }}
        onShowEnding={() => {
          setIsTeacherDashboardOpen(false);
          setIsVictoryOpen(true);
        }}
        onShowTrailer={() => {
          setIsTeacherDashboardOpen(false);
          setIsTrailerOpen(true);
        }}
        onCompleteGame={() => {
          setProgress((prev) => ({
            ...prev,
            highestUnlockedStageId: LEVEL_1_STAGES.length,
            completedStages: LEVEL_1_STAGES.map((s) => s.id),
            coins: 300,
            xp: 1500,
            medals: ['ouro_excel', 'mestre_formulas', 'senai_pro', 'speedrunner_excel'],
          }));
          setCurrentStageId(LEVEL_1_STAGES.length);
          setIsTeacherDashboardOpen(false);
          setIsVictoryOpen(true);
          soundManager.playVictory();
        }}
        onJumpToStage={(stageId) => {
          setCurrentStageId(stageId);
          setIsTeacherDashboardOpen(false);
          setGameMode('playing');
        }}
        currentStageId={currentStageId}
      />

      {/* 8. Achievements & Portable Sync Modal */}
      <AchievementsModal
        isOpen={isAchievementsOpen}
        onClose={() => setIsAchievementsOpen(false)}
        progress={progress}
        onImportProgress={handleImportProgress}
        onResetProgress={handleResetProgress}
      />

      {/* 9. How to Play Instructions Modal */}
      <HowToPlayModal
        isOpen={isHowToPlayOpen}
        onClose={() => setIsHowToPlayOpen(false)}
      />

      {/* 10. Super Mario Style World Map Modal */}
      <WorldMapModal
        isOpen={isWorldMapOpen}
        onClose={() => setIsWorldMapOpen(false)}
        progress={progress}
        currentStageId={currentStageId}
        onSelectStage={(id) => {
          setCurrentStageId(id);
          setGameMode('playing');
        }}
      />

      {/* 11. Audio & Gameplay Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onYoutubeVideoChange={(id) => {
          setYoutubeVideoId(id);
          if (id) soundManager.stopBGM();
        }}
      />
      {youtubeVideoId && (
        <aside className="fixed bottom-4 right-4 z-[60] w-[min(340px,calc(100vw-24px))] rounded-xl border border-red-400/60 bg-[#101B35] p-2 shadow-2xl" aria-label="Player de música do YouTube">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-white">▶ Música YouTube • durante o jogo</span>
            <button type="button" className="rounded bg-red-600 px-2 py-1 text-xs text-white" onClick={() => { setYoutubeVideoId(''); soundManager.startGameplayBGM(); }}>Parar e fechar</button>
          </div>
          <iframe className="aspect-video w-full rounded-lg" title="Player de áudio e vídeo do YouTube" src={`https://www.youtube-nocookie.com/embed/${youtubeVideoId}?rel=0`} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
          <p className="text-[10px] text-slate-300">O vídeo permanece visível para permitir os controles oficiais. Pressione reproduzir no player.</p>
        </aside>
      )}

      {/* 12. Game Over Modal (Resets to Stage 1 & locks other stages) */}
      <GameOverModal
        isOpen={isGameOverOpen}
        stageNumber={currentStageId}
        onRestartAtStage1={() => {
          setIsGameOverOpen(false);
          setStageRestartToken(value => value + 1);
          setGameMode('playing');
          if (!youtubeVideoId) soundManager.startGameplayBGM();
        }}
        onGoToMenu={() => {
          setIsGameOverOpen(false);
          setGameMode('menu');
          soundManager.stopBGM();
        }}
      />

      {/* 13. Game Trailer Modal with 8-bit Carry on Wayward Son */}
      <TrailerModal
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
        onPlayGame={() => {
          setIsTrailerOpen(false);
          handleStartGame();
        }}
      />

    </div>
  );
}
