import React, { useRef, useEffect, useState, useCallback } from 'react';
import { StageDefinition } from '../types/game';
import { soundManager } from '../utils/audio';
import {
  checkAABBCollision,
  checkHeadbuttBlock,
  checkStompEnemy,
  QuestionBlock,
  EnemyBot,
  EntityBox
} from '../engine';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Zap,
  Monitor,
  Heart,
  Sparkles,
  Flag,
  ShieldAlert,
  Info,
  Settings
} from 'lucide-react';

interface GameCanvasProps {
  stage: StageDefinition;
  isStageCompleted: boolean;
  onOpenTerminal: () => void;
  onCoinCollected: () => void;
  onReachExitPortal: () => void;
  onGameOver: () => void;
  isGodMode?: boolean;
  onOpenSettings?: () => void;
  onShowEnding?: () => void;
  onOpenTeacherDashboard?: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  size: number;
}

interface FloatingCoin {
  id: number;
  x: number;
  y: number;
  vy: number;
  alpha: number;
}

interface Pipe {
  x: number;
  y: number;
  w: number;
  h: number;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  stage,
  isStageCompleted,
  onOpenTerminal,
  onCoinCollected,
  onReachExitPortal,
  onGameOver,
  isGodMode = false,
  onOpenSettings,
  onShowEnding,
  onOpenTeacherDashboard,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Lives & dynamic stats
  const [lives, setLives] = useState(3);
  const [defeatedEnemies, setDefeatedEnemies] = useState(0);
  const [isSprinting, setIsSprinting] = useState(false);
  const [isNearTerminal, setIsNearTerminal] = useState(false);
  const [isNearFlag, setIsNearFlag] = useState(false);
  const [checkpointX, setCheckpointX] = useState(60);

  // Level dimensions
  const LEVEL_WIDTH = 2700;
  const VIEW_WIDTH = 960;
  const VIEW_HEIGHT = 480;
  const GROUND_Y = 410;

  // Player state ref (for 60fps loop without React re-render lag)
  const playerRef = useRef({
    x: 60,
    y: 350,
    w: 30,
    h: 42,
    vx: 0,
    vy: 0,
    speed: 4.4,
    sprintSpeed: 7.6,
    jumpPower: -12.4,
    isGrounded: false,
    facing: 'right' as 'left' | 'right',
    animFrame: 0,
    animTimer: 0,
    invulnerableTimer: 0,
    isClimbingFlag: false,
    flagSlideY: 0
  });

  // Camera X ref
  const cameraXRef = useRef(0);

  // Level entities refs
  const blocksRef = useRef<QuestionBlock[]>([]);
  const enemiesRef = useRef<EnemyBot[]>([]);
  const pipesRef = useRef<Pipe[]>([]);
  const groundSegmentsRef = useRef<{ x: number; w: number }[]>([]);
  const floatingCoinsRef = useRef<FloatingCoin[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const keysDownRef = useRef<Record<string, boolean>>({});
  const animationFrameIdRef = useRef<number>(0);

  // Key locations in scrolling world
  const terminalPos = { x: 1720, y: 350, w: 54, h: 60 };
  const laserGateX = 1860;
  const flagpolePos = { x: 2520, y: 130, w: 20, h: 280 };

  // Setup level layout based on stage theme & difficulty
  useEffect(() => {
    // Reset player position & camera
    playerRef.current.x = 60;
    playerRef.current.y = 350;
    playerRef.current.vx = 0;
    playerRef.current.vy = 0;
    playerRef.current.isClimbingFlag = false;
    cameraXRef.current = 0;
    setLives(3);
    setDefeatedEnemies(0);

    // Ground segments with pits
    groundSegmentsRef.current = [
      { x: 0, w: 680 },       // Start section
      { x: 780, w: 620 },     // Mid section 1 (pit at 680-780)
      { x: 1500, w: 650 },    // Terminal section (pit at 1400-1500)
      { x: 2240, w: 500 }     // Flagpole finish zone (pit at 2150-2240)
    ];

    // Warp Pipes (Tubos Verdes)
    pipesRef.current = [
      { x: 340, y: GROUND_Y - 48, w: 52, h: 48 },
      { x: 600, y: GROUND_Y - 70, w: 52, h: 70 },
      { x: 1050, y: GROUND_Y - 55, w: 52, h: 55 },
      { x: 1960, y: GROUND_Y - 80, w: 54, h: 80 },
      { x: 2360, y: GROUND_Y - 60, w: 52, h: 60 },
    ];

    // Mystery Question Blocks [?] & Bricks
    blocksRef.current = [
      { id: 1, x: 200, y: 270, w: 34, h: 34, type: 'question', hitOffset: 0, hasCoin: true },
      { id: 2, x: 234, y: 270, w: 34, h: 34, type: 'brick', hitOffset: 0, hasCoin: false },
      { id: 3, x: 268, y: 270, w: 34, h: 34, type: 'question', hitOffset: 0, hasCoin: true },
      { id: 4, x: 480, y: 250, w: 34, h: 34, type: 'question', hitOffset: 0, hasCoin: true },
      // Elevated stairs blocks
      { id: 5, x: 860, y: 280, w: 34, h: 34, type: 'brick', hitOffset: 0, hasCoin: false },
      { id: 6, x: 894, y: 246, w: 34, h: 34, type: 'question', hitOffset: 0, hasCoin: true },
      { id: 7, x: 928, y: 212, w: 34, h: 34, type: 'brick', hitOffset: 0, hasCoin: false },
      // Above pit floating blocks
      { id: 8, x: 1420, y: 290, w: 34, h: 34, type: 'brick', hitOffset: 0, hasCoin: false },
      { id: 9, x: 1454, y: 290, w: 34, h: 34, type: 'question', hitOffset: 0, hasCoin: true },
      // Terminal hint blocks
      { id: 10, x: 1650, y: 260, w: 34, h: 34, type: 'question', hitOffset: 0, hasCoin: true },
      { id: 11, x: 2180, y: 280, w: 34, h: 34, type: 'question', hitOffset: 0, hasCoin: true },
    ];

    // Enemies (BugBots de Sintaxe)
    enemiesRef.current = [
      { id: 1, x: 440, y: GROUND_Y - 30, w: 30, h: 30, vx: -1.3, isAlive: true, squashTimer: 0, patrolMinX: 380, patrolMaxX: 580, name: 'Glitch-01' },
      { id: 2, x: 950, y: GROUND_Y - 30, w: 30, h: 30, vx: 1.4, isAlive: true, squashTimer: 0, patrolMinX: 820, patrolMaxX: 1020, name: 'SyntaxError' },
      { id: 3, x: 1200, y: GROUND_Y - 30, w: 30, h: 30, vx: -1.5, isAlive: true, squashTimer: 0, patrolMinX: 1100, patrolMaxX: 1360, name: 'RefBug' },
      { id: 4, x: 1620, y: GROUND_Y - 30, w: 30, h: 30, vx: 1.6, isAlive: true, squashTimer: 0, patrolMinX: 1540, patrolMaxX: 1700, name: 'CalcBot' },
      { id: 5, x: 2040, y: GROUND_Y - 30, w: 30, h: 30, vx: -1.8, isAlive: true, squashTimer: 0, patrolMinX: 2000, patrolMaxX: 2140, name: 'Guardião' }
    ];

    floatingCoinsRef.current = [];
    particlesRef.current = [];
  }, [stage.id]);

  // Particle explosion helper
  const addParticles = useCallback((x: number, y: number, color: string, count = 8) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 1;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        alpha: 1,
        color,
        size: Math.random() * 3 + 2
      });
    }
  }, []);

  // Keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(e.key)) {
        e.preventDefault();
      }
      keysDownRef.current[k] = true;
      if (e.shiftKey) {
        keysDownRef.current['shift'] = true;
      }

      // Jump press trigger
      if (['arrowup', 'w', ' '].includes(k)) {
        const p = playerRef.current;
        if (p.isGrounded && !p.isClimbingFlag) {
          const sprintBonus = Math.abs(p.vx) > 5 ? -1.5 : 0;
          p.vy = p.jumpPower + sprintBonus;
          p.isGrounded = false;
          soundManager.playJump();
          addParticles(p.x + p.w / 2, p.y + p.h, 'rgba(255,255,255,0.7)', 4);
        }
      }

      // Interact trigger (E / Enter)
      if (['e', 'enter'].includes(k)) {
        const p = playerRef.current;
        const distTerm = Math.hypot(p.x + p.w / 2 - (terminalPos.x + terminalPos.w / 2), p.y + p.h / 2 - (terminalPos.y + terminalPos.h / 2));
        if (distTerm < 80) {
          soundManager.playTerminalOpen();
          onOpenTerminal();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      keysDownRef.current[k] = false;
      if (!e.shiftKey) {
        keysDownRef.current['shift'] = false;
      }

      // Variable jump height cut when releasing button early (Mario jump cut)
      if (['arrowup', 'w', ' '].includes(k)) {
        const p = playerRef.current;
        if (p.vy < -4) {
          p.vy = -3;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [onOpenTerminal, addParticles]);

  // Handle life loss (pit fall or enemy collision)
  const handleLifeLoss = useCallback(() => {
    if (isGodMode) {
      // In God Mode (Teacher / Root User), player is immortal!
      playerRef.current.x = checkpointX;
      playerRef.current.y = 300;
      playerRef.current.vx = 0;
      playerRef.current.vy = 0;
      playerRef.current.invulnerableTimer = 90;
      soundManager.playPowerUp();
      return;
    }
    setLives(prev => {
      const nextLives = prev - 1;
      if (nextLives <= 0) {
        // Game Over! Stop player, play Game Over, notify parent
        playerRef.current.vx = 0;
        playerRef.current.vy = 0;
        playerRef.current.invulnerableTimer = 180;
        soundManager.playGameOver();
        onGameOver();
        return 0;
      } else {
        // Lost a life, but still has lives remaining
        soundManager.playDamage();
        playerRef.current.x = checkpointX;
        playerRef.current.y = 300;
        playerRef.current.vx = 0;
        playerRef.current.vy = 0;
        playerRef.current.invulnerableTimer = 90; // 1.5 seconds flash
        return nextLives;
      }
    });
  }, [checkpointX, onGameOver, isGodMode]);

  // Main 60fps Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = VIEW_WIDTH;
    canvas.height = VIEW_HEIGHT;

    let tick = 0;

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);

      const p = playerRef.current;
      const keys = keysDownRef.current;

      // --- 1. FLAGPOLE VICTORY ANIMATION SEQUENCE ---
      if (p.isClimbingFlag) {
        p.vx = 0;
        if (p.y < GROUND_Y - p.h) {
          p.y += 3.5;
        } else {
          // Finished sliding down pole, walk right into vault
          p.x += 2.5;
          if (p.x > flagpolePos.x + 120) {
            onReachExitPortal();
            return;
          }
        }
      } else {
        // --- 2. PLAYER INPUT & SPRINT PHYSICS ---
        const sprinting = keys['shift'] || isSprinting;
        const currentSpeed = sprinting ? p.sprintSpeed : p.speed;
        const accel = p.isGrounded ? 0.9 : 0.45;
        const friction = p.isGrounded ? 0.82 : 0.92;

        if (keys['arrowleft'] || keys['a']) {
          p.vx -= accel;
          if (p.vx < -currentSpeed) p.vx = -currentSpeed;
          p.facing = 'left';
        } else if (keys['arrowright'] || keys['d']) {
          p.vx += accel;
          if (p.vx > currentSpeed) p.vx = currentSpeed;
          p.facing = 'right';
        } else {
          p.vx *= friction;
          if (Math.abs(p.vx) < 0.1) p.vx = 0;
        }

        // Gravity
        p.vy += 0.54;
        if (p.vy > 13) p.vy = 13;

        p.x += p.vx;
        p.y += p.vy;

        // Invulnerability timer
        if (p.invulnerableTimer > 0) {
          p.invulnerableTimer--;
        }

        // Level boundary
        if (p.x < 10) {
          p.x = 10;
          p.vx = 0;
        }

        // Checkpoint update
        if (p.x > 1500 && checkpointX < 1500) {
          setCheckpointX(1500);
        }

        // --- 3. PLATFORM & GROUND COLLISIONS ---
        p.isGrounded = false;

        // Ground segments collision
        groundSegmentsRef.current.forEach(seg => {
          if (p.x + p.w > seg.x && p.x < seg.x + seg.w) {
            if (p.y + p.h >= GROUND_Y && p.y + p.h - p.vy <= GROUND_Y + 14 && p.vy >= 0) {
              p.y = GROUND_Y - p.h;
              p.vy = 0;
              p.isGrounded = true;
            }
          }
        });

        // Pit Fall Check
        if (p.y > VIEW_HEIGHT + 40) {
          if (isGodMode) {
            // Professor Root Superuser: anti-gravity rocket leap back onto the ground!
            p.x = checkpointX;
            p.y = GROUND_Y - p.h - 10;
            p.vy = -11;
            p.isGrounded = false;
            addParticles(p.x + p.w / 2, p.y + p.h, '#fbbf24', 24);
            soundManager.playPowerUp();
          } else {
            handleLifeLoss();
          }
        }

        // Pipes collision
        pipesRef.current.forEach(pipe => {
          // Landing on pipe top
          if (p.x + p.w > pipe.x && p.x < pipe.x + pipe.w) {
            if (p.y + p.h >= pipe.y && p.y + p.h - p.vy <= pipe.y + 14 && p.vy >= 0) {
              p.y = pipe.y - p.h;
              p.vy = 0;
              p.isGrounded = true;
            }
          }
          // Lateral pipe collision
          if (p.y + p.h > pipe.y + 6 && p.y < pipe.y + pipe.h) {
            if (p.x + p.w >= pipe.x && p.x < pipe.x && p.vx > 0) {
              p.x = pipe.x - p.w;
              p.vx = 0;
            } else if (p.x <= pipe.x + pipe.w && p.x + p.w > pipe.x + pipe.w && p.vx < 0) {
              p.x = pipe.x + pipe.w;
              p.vx = 0;
            }
          }
        });

        // --- 4. QUESTION BLOCKS & BRICKS HEADBUTT (MARIO HEADBUTT) ---
        blocksRef.current.forEach(block => {
          // Restore bounce offset
          if (block.hitOffset > 0) {
            block.hitOffset -= 1.8;
            if (block.hitOffset < 0) block.hitOffset = 0;
          }

          // Landing on block top
          if (p.x + p.w > block.x + 2 && p.x < block.x + block.w - 2) {
            if (p.y + p.h >= block.y && p.y + p.h - p.vy <= block.y + 12 && p.vy >= 0) {
              p.y = block.y - p.h;
              p.vy = 0;
              p.isGrounded = true;
            }
          }

          // Headbutt from bottom
          if (checkHeadbuttBlock(p, block)) {
            p.y = block.y + block.h + 2;
            p.vy = 2; // bounce down
            block.hitOffset = 8;
            soundManager.playBlockHit();

            if (block.hasCoin && block.type === 'question') {
              block.type = 'used';
              soundManager.playCoin();
              onCoinCollected();
              floatingCoinsRef.current.push({
                id: Date.now(),
                x: block.x + block.w / 2,
                y: block.y - 10,
                vy: -6,
                alpha: 1
              });
              addParticles(block.x + block.w / 2, block.y, '#facc15', 10);
            } else if (block.type === 'brick') {
              addParticles(block.x + block.w / 2, block.y, '#f97316', 6);
            }
          }
        });

        // --- 5. LASER GATE BARRIER CHECK (Before Formula Solution) ---
        if (!isStageCompleted && !isGodMode) {
          if (p.x + p.w > laserGateX && p.x < laserGateX + 24) {
            p.x = laserGateX - p.w;
            p.vx = 0;
          }
        }

        // --- 6. ENEMIES AI & MARIO STOMP COLLISION ---
        enemiesRef.current.forEach(enemy => {
          if (!enemy.isAlive) {
            if (enemy.squashTimer > 0) enemy.squashTimer--;
            return;
          }

          // Enemy patrol
          enemy.x += enemy.vx;
          if (enemy.x <= enemy.patrolMinX || enemy.x >= enemy.patrolMaxX) {
            enemy.vx = -enemy.vx;
          }

          // Check Stomp from above (Mario Stomp)
          if (checkStompEnemy(p, enemy)) {
            enemy.isAlive = false;
            enemy.squashTimer = 40;
            p.vy = -9.2; // Super Mario bounce on stomp!
            soundManager.playStomp();
            setDefeatedEnemies(prev => prev + 1);
            onCoinCollected();
            addParticles(enemy.x + enemy.w / 2, enemy.y + enemy.h / 2, '#38bdf8', 12);
            return;
          }

          // Check side/bottom damage
          if (checkAABBCollision(p, enemy) && p.invulnerableTimer === 0) {
            if (isGodMode) {
              // Root Superuser: defeats enemy on contact with golden burst!
              enemy.isAlive = false;
              enemy.squashTimer = 40;
              p.vy = -7.5;
              soundManager.playStomp();
              setDefeatedEnemies(prev => prev + 1);
              onCoinCollected();
              addParticles(enemy.x + enemy.w / 2, enemy.y + enemy.h / 2, '#fbbf24', 20);
            } else {
              p.invulnerableTimer = 90;
              p.vy = -6;
              p.vx = p.x < enemy.x ? -6 : 6;
              addParticles(p.x + p.w / 2, p.y + p.h / 2, '#ef4444', 8);
              handleLifeLoss();
            }
          }
        });

        // --- 7. FLAGPOLE TOUCH (MARIO LEVEL CLEAR) ---
        if (p.x + p.w >= flagpolePos.x && p.x <= flagpolePos.x + flagpolePos.w + 10) {
          p.isClimbingFlag = true;
          soundManager.playFlagpole();
        }
      }

      // --- 8. SMOOTH CAMERA SCROLLING TRACKING PLAYER ---
      const targetCamX = p.x - VIEW_WIDTH * 0.38;
      const clampedCamX = Math.max(0, Math.min(LEVEL_WIDTH - VIEW_WIDTH, targetCamX));
      cameraXRef.current += (clampedCamX - cameraXRef.current) * 0.12;
      const camX = cameraXRef.current;

      // Update proximity state
      const distTerm = Math.hypot(p.x + p.w / 2 - (terminalPos.x + terminalPos.w / 2), p.y + p.h / 2 - (terminalPos.y + terminalPos.h / 2));
      setIsNearTerminal(distTerm < 80);
      setIsNearFlag(p.x > flagpolePos.x - 140);

      // --- 9. DRAW SCENERY WITH PARALLAX ---
      ctx.save();
      drawMarioParallax(ctx, VIEW_WIDTH, VIEW_HEIGHT, camX, stage.theme, tick);

      // Apply camera translate for world entities
      ctx.translate(-camX, 0);

      // Ground & Pits
      drawGroundSegments(ctx, groundSegmentsRef.current, GROUND_Y, VIEW_HEIGHT, stage.theme);

      // Pipes
      pipesRef.current.forEach(pipe => drawPipe(ctx, pipe));

      // Blocks
      blocksRef.current.forEach(block => drawBlock(ctx, block, tick));

      // Floating pop coins
      floatingCoinsRef.current.forEach((fc, idx) => {
        fc.y += fc.vy;
        fc.vy += 0.4;
        fc.alpha -= 0.03;
        if (fc.alpha <= 0) {
          floatingCoinsRef.current.splice(idx, 1);
        } else {
          ctx.save();
          ctx.globalAlpha = Math.max(0, fc.alpha);
          drawCoinSprite(ctx, fc.x, fc.y, tick);
          ctx.restore();
        }
      });

      // Terminal Pedestal
      drawTerminalStation(ctx, terminalPos, isStageCompleted, tick);

      // Laser Gate Barrier
      drawLaserGate(ctx, laserGateX, GROUND_Y, isStageCompleted, tick);

      // Flagpole Finish
      drawFlagpole(ctx, flagpolePos, p.isClimbingFlag, tick);

      // Enemies
      enemiesRef.current.forEach(enemy => drawEnemy(ctx, enemy, tick));

      // Player
      if (p.invulnerableTimer === 0 || Math.floor(tick / 4) % 2 === 0) {
        drawMarioPlayer(ctx, p, tick);
      }

      // Particles
      particlesRef.current.forEach((pt, index) => {
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.alpha -= 0.028;
        if (pt.alpha <= 0) {
          particlesRef.current.splice(index, 1);
          return;
        }
        ctx.save();
        ctx.globalAlpha = Math.max(0, pt.alpha);
        ctx.fillStyle = pt.color;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      ctx.restore();

      animationFrameIdRef.current = requestAnimationFrame(render);
    };

    animationFrameIdRef.current = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(animationFrameIdRef.current);
    };
  }, [stage, isStageCompleted, onCoinCollected, onReachExitPortal, handleLifeLoss, isSprinting]);

  const [isBgmOn, setIsBgmOn] = useState(soundManager.isBGMPlaying());

  // Start gameplay BGM in loop on mount / stage start and sync with soundManager
  useEffect(() => {
    soundManager.startGameplayBGM();

    const unsubscribe = soundManager.subscribe(() => {
      setIsBgmOn(soundManager.isBGMPlaying());
    });

    return () => {
      unsubscribe();
    };
  }, [stage.id]);

  const handleToggleMusic = () => {
    const nextState = soundManager.toggleBGM();
    setIsBgmOn(nextState);
  };

  return (
    <div className="relative w-full flex flex-col items-center select-none">
      
      {/* Viewport Frame */}
      <div className="relative w-full max-w-5xl rounded-2xl overflow-hidden border-2 border-slate-700/80 shadow-2xl bg-[#090f21]">
        
        {/* Retro Mario-Style HUD Bar */}
        <div className="absolute top-2.5 left-3 right-3 z-30 flex items-center justify-between text-xs font-mono font-bold text-white bg-slate-950/85 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700/70 shadow-lg">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="px-2 py-0.5 bg-blue-900/90 text-cyan-200 border border-cyan-400/50 rounded-lg text-[10px] font-black tracking-wider">
              SENAIZINHO
            </span>
            {isGodMode && (
              <span className="px-2 py-0.5 bg-amber-500 text-slate-950 font-black rounded-lg text-[10px] animate-pulse">
                🛡️ ROOT IMORTAL
              </span>
            )}
            <span className="flex items-center gap-1 text-red-400 font-extrabold" title="Vidas Restantes">
              <Heart className="w-4 h-4 fill-red-500 animate-pulse" />
              <span>x{lives}</span>
            </span>
            <span className="text-slate-500">•</span>
            <span className="flex items-center gap-1 text-cyan-300">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>DERROTADOS: {defeatedEnemies}</span>
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* 8-bit Carry on Wayward Son Music button */}
            <button
              onClick={handleToggleMusic}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition active:scale-95 border ${
                isBgmOn
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 animate-pulse shadow-sm shadow-amber-500/30'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
              title="Música 8-Bit: Carry on Wayward Son (Kansas) - Clique para Ligar/Desligar"
            >
              <span>🎸 Carry on Wayward Son</span>
              <span className="font-mono text-[9px] px-1 rounded bg-black/40">
                {isBgmOn ? 'TOCANDO' : 'PAUSADA'}
              </span>
            </button>

            {/* Quick Settings / Volume Modal Button */}
            {onOpenSettings && (
              <button
                onClick={() => {
                  soundManager.playClick();
                  onOpenSettings();
                }}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 hover:text-white transition active:scale-95"
                title="Ajustar Volume & Configurações de Áudio"
              >
                <Settings className="w-3.5 h-3.5" />
              </button>
            )}

            <span className="text-amber-300 flex items-center gap-1 font-extrabold">
              <span>FASE {stage.id}-1</span>
            </span>
            <span className="text-slate-500 hidden sm:inline">•</span>
            <span className={`hidden sm:inline ${isStageCompleted ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}`}>
              {isStageCompleted ? '🔓 BARREIRA LIBERADA' : '🔒 RESOLVA O TERMINAL'}
            </span>
          </div>
        </div>

        {/* Floating Action Prompts */}
        {isNearTerminal && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-12 z-30 animate-bounce">
            <button
              onClick={() => {
                soundManager.playTerminalOpen();
                onOpenTerminal();
              }}
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm rounded-xl shadow-2xl border-2 border-emerald-300 flex items-center gap-2 cursor-pointer transition active:scale-95"
            >
              <Monitor className="w-4 h-4 text-emerald-200" />
              <span>[E] ABRIR TERMINAL DE FÓRMULAS</span>
            </button>
          </div>
        )}

        {/* The Game Canvas */}
        <canvas
          ref={canvasRef}
          className="w-full h-auto aspect-[2/1] block cursor-crosshair"
          onClick={() => {
            if (isNearTerminal) {
              soundManager.playTerminalOpen();
              onOpenTerminal();
            }
          }}
        />

        {/* Bottom Game Canvas Status Strip */}
        <div className="px-4 py-2 bg-[#080d1c] border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-medium">
              <Info className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Pule embaixo dos blocos <strong>[?]</strong>, esmague os robôs pulando por cima e segure <strong>Shift</strong> para correr!</span>
              <span className="sm:hidden">Corra, salte nos robôs e cabeceie os blocos!</span>
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
            <span>Terminal em x=1720</span>
            <span>•</span>
            <span>Bandeira em x=2520</span>
          </div>
        </div>
      </div>

      {/* On-Screen Touch / Mouse Controls for School PCs & Tablets */}
      <div className="mt-3 flex items-center justify-between w-full max-w-5xl px-2 gap-2">
        {/* Direction Arrows */}
        <div className="flex items-center gap-2">
          <button
            onMouseDown={() => (keysDownRef.current['arrowleft'] = true)}
            onMouseUp={() => (keysDownRef.current['arrowleft'] = false)}
            onTouchStart={() => (keysDownRef.current['arrowleft'] = true)}
            onTouchEnd={() => (keysDownRef.current['arrowleft'] = false)}
            className="w-12 h-12 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 border border-slate-600 rounded-xl flex items-center justify-center text-slate-200 shadow select-none active:scale-95 transition"
            aria-label="Mover para esquerda"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <button
            onMouseDown={() => (keysDownRef.current['arrowright'] = true)}
            onMouseUp={() => (keysDownRef.current['arrowright'] = false)}
            onTouchStart={() => (keysDownRef.current['arrowright'] = true)}
            onTouchEnd={() => (keysDownRef.current['arrowright'] = false)}
            className="w-12 h-12 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 border border-slate-600 rounded-xl flex items-center justify-center text-slate-200 shadow select-none active:scale-95 transition"
            aria-label="Mover para direita"
          >
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>

        {/* Action Buttons: Sprint, Jump, Terminal */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSprinting(!isSprinting)}
            className={`px-3 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 shadow select-none transition active:scale-95 ${
              isSprinting
                ? 'bg-amber-500 text-slate-950 border-amber-300 ring-2 ring-amber-300'
                : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-600'
            }`}
            title="Segurar Shift no teclado também ativa corrida"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>{isSprinting ? 'CORRENDO (DASH)' : 'CORRER (SHIFT)'}</span>
          </button>

          <button
            onMouseDown={() => {
              const p = playerRef.current;
              if (p.isGrounded && !p.isClimbingFlag) {
                p.vy = p.jumpPower;
                p.isGrounded = false;
                soundManager.playJump();
              }
            }}
            onTouchStart={() => {
              const p = playerRef.current;
              if (p.isGrounded && !p.isClimbingFlag) {
                p.vy = p.jumpPower;
                p.isGrounded = false;
                soundManager.playJump();
              }
            }}
            className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700 text-white font-extrabold text-xs rounded-xl shadow border border-cyan-400 flex items-center gap-1.5 select-none transition active:scale-95"
          >
            <ArrowUp className="w-5 h-5" />
            <span>PULAR</span>
          </button>

          <button
            onClick={() => {
              soundManager.playTerminalOpen();
              onOpenTerminal();
            }}
            className="px-3 py-2.5 bg-emerald-700/90 hover:bg-emerald-600 active:bg-emerald-800 text-white text-xs font-bold rounded-xl border border-emerald-500/50 flex items-center gap-1.5 shadow select-none transition active:scale-95"
          >
            <Monitor className="w-4 h-4 text-emerald-300" />
            <span>Terminal</span>
          </button>
        </div>
      </div>

    </div>
  );
};

/* =========================================================================
   SUPER MARIO BROS CANAVAS RENDERERS
   ========================================================================= */

function drawMarioParallax(
  ctx: CanvasRenderingContext2D,
  viewW: number,
  viewH: number,
  camX: number,
  theme: StageDefinition['theme'],
  tick: number
) {
  // Sky Gradient
  const skyGrad = ctx.createLinearGradient(0, 0, 0, viewH);
  if (theme === 'market') {
    skyGrad.addColorStop(0, '#1a365d');
    skyGrad.addColorStop(0.7, '#2b6cb0');
    skyGrad.addColorStop(1, '#1e3a8a');
  } else if (theme === 'warehouse') {
    skyGrad.addColorStop(0, '#062020');
    skyGrad.addColorStop(0.7, '#0f3e3e');
    skyGrad.addColorStop(1, '#082525');
  } else if (theme === 'factory') {
    skyGrad.addColorStop(0, '#2d1b09');
    skyGrad.addColorStop(0.7, '#4a2d11');
    skyGrad.addColorStop(1, '#1c1308');
  } else if (theme === 'arena') {
    skyGrad.addColorStop(0, '#1f0d38');
    skyGrad.addColorStop(0.7, '#3b186b');
    skyGrad.addColorStop(1, '#170929');
  } else {
    // Boss
    skyGrad.addColorStop(0, '#380a18');
    skyGrad.addColorStop(0.7, '#591126');
    skyGrad.addColorStop(1, '#21060e');
  }
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, viewW, viewH);

  // Distant Mountains / Hills (Parallax layer 1: factor 0.15)
  ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
  const hillOffset = (camX * 0.15) % 360;
  for (let x = -hillOffset - 360; x < viewW + 360; x += 180) {
    ctx.beginPath();
    ctx.arc(x, 410, 140, Math.PI, 0);
    ctx.fill();
  }

  // Midground Clouds / City Skylines (Parallax layer 2: factor 0.35)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  const cloudOffset = (camX * 0.35 + tick * 0.2) % 400;
  for (let x = -cloudOffset - 400; x < viewW + 400; x += 220) {
    ctx.beginPath();
    ctx.arc(x, 110, 24, 0, Math.PI * 2);
    ctx.arc(x + 22, 100, 32, 0, Math.PI * 2);
    ctx.arc(x + 48, 110, 26, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawGroundSegments(
  ctx: CanvasRenderingContext2D,
  segments: { x: number; w: number }[],
  groundY: number,
  viewH: number,
  _theme: StageDefinition['theme']
) {
  segments.forEach(seg => {
    // Top Grass / Tech Grid border
    ctx.fillStyle = '#107c41'; // Classic Excel Green Turf
    ctx.fillRect(seg.x, groundY, seg.w, 14);

    // Turf highlight line
    ctx.fillStyle = '#4ade80';
    ctx.fillRect(seg.x, groundY, seg.w, 3);

    // Deep subterranean earth / tech stone blocks
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(seg.x, groundY + 14, seg.w, viewH - groundY);

    // Brick pattern lines
    ctx.fillStyle = '#334155';
    for (let x = seg.x; x < seg.x + seg.w; x += 28) {
      ctx.fillRect(x, groundY + 16, 2, viewH - groundY);
    }
    for (let y = groundY + 14; y < viewH; y += 20) {
      ctx.fillRect(seg.x, y, seg.w, 2);
    }
  });
}

function drawPipe(ctx: CanvasRenderingContext2D, pipe: Pipe) {
  ctx.save();
  // Pipe rim top
  const rimH = 16;
  const rimW = pipe.w + 6;
  const rimX = pipe.x - 3;
  const rimY = pipe.y;

  // Green gradient for classic pipe cylinder look
  const pipeGrad = ctx.createLinearGradient(pipe.x, 0, pipe.x + pipe.w, 0);
  pipeGrad.addColorStop(0, '#15803d');
  pipeGrad.addColorStop(0.3, '#4ade80');
  pipeGrad.addColorStop(0.7, '#16a34a');
  pipeGrad.addColorStop(1, '#14532d');

  // Draw main stem
  ctx.fillStyle = pipeGrad;
  ctx.fillRect(pipe.x, pipe.y + rimH, pipe.w, pipe.h - rimH);
  ctx.strokeStyle = '#052e16';
  ctx.lineWidth = 2;
  ctx.strokeRect(pipe.x, pipe.y + rimH, pipe.w, pipe.h - rimH);

  // Draw rim
  ctx.fillStyle = pipeGrad;
  ctx.fillRect(rimX, rimY, rimW, rimH);
  ctx.strokeRect(rimX, rimY, rimW, rimH);

  ctx.restore();
}

function drawBlock(ctx: CanvasRenderingContext2D, block: QuestionBlock, tick: number) {
  ctx.save();
  const y = block.y - block.hitOffset;

  if (block.type === 'question') {
    // Golden pulsating [?] Question Mark block
    const goldGrad = ctx.createLinearGradient(block.x, y, block.x + block.w, y + block.h);
    goldGrad.addColorStop(0, '#fef08a');
    goldGrad.addColorStop(0.5, '#eab308');
    goldGrad.addColorStop(1, '#ca8a04');

    ctx.fillStyle = goldGrad;
    ctx.fillRect(block.x, y, block.w, block.h);

    ctx.strokeStyle = '#713f12';
    ctx.lineWidth = 2;
    ctx.strokeRect(block.x, y, block.w, block.h);

    // Corner rivets
    ctx.fillStyle = '#713f12';
    ctx.fillRect(block.x + 3, y + 3, 3, 3);
    ctx.fillRect(block.x + block.w - 6, y + 3, 3, 3);
    ctx.fillRect(block.x + 3, y + block.h - 6, 3, 3);
    ctx.fillRect(block.x + block.w - 6, y + block.h - 6, 3, 3);

    // Pulsing Question Mark symbol
    ctx.fillStyle = '#422006';
    ctx.font = '900 18px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('?', block.x + block.w / 2, y + block.h / 2);
  } else if (block.type === 'brick') {
    // Brown destructible/bumpable brick
    ctx.fillStyle = '#b45309';
    ctx.fillRect(block.x, y, block.w, block.h);
    ctx.strokeStyle = '#451a03';
    ctx.lineWidth = 2;
    ctx.strokeRect(block.x, y, block.w, block.h);

    // Brick mortar lines
    ctx.fillStyle = '#451a03';
    ctx.fillRect(block.x, y + block.h / 2, block.w, 2);
    ctx.fillRect(block.x + block.w / 2, y, 2, block.h / 2);
    ctx.fillRect(block.x + block.w / 4, y + block.h / 2, 2, block.h / 2);
    ctx.fillRect(block.x + (block.w * 3) / 4, y + block.h / 2, 2, block.h / 2);
  } else {
    // Empty Used Block
    ctx.fillStyle = '#475569';
    ctx.fillRect(block.x, y, block.w, block.h);
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.strokeRect(block.x, y, block.w, block.h);
  }

  ctx.restore();
}

function drawCoinSprite(ctx: CanvasRenderingContext2D, x: number, y: number, tick: number) {
  ctx.save();
  ctx.translate(x, y);
  const scaleX = Math.abs(Math.cos(tick * 0.15));
  ctx.scale(Math.max(0.2, scaleX), 1);

  ctx.fillStyle = '#facc15';
  ctx.beginPath();
  ctx.arc(0, 0, 10, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#a16207';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.restore();
}

function drawEnemy(ctx: CanvasRenderingContext2D, enemy: EnemyBot, tick: number) {
  ctx.save();
  ctx.translate(enemy.x, enemy.y);

  if (!enemy.isAlive) {
    // Squashed flat Goomba style
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(0, enemy.h - 8, enemy.w, 8);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(6, enemy.h - 6, 4, 3);
    ctx.fillRect(enemy.w - 10, enemy.h - 6, 4, 3);
    ctx.restore();
    return;
  }

  // Waddle oscillation
  const waddle = Math.sin(tick * 0.2) * 2;

  // BugBot Head / Shell (Round Goomba / Glitch Robot)
  ctx.fillStyle = '#ef4444'; // Red BugBot
  ctx.beginPath();
  ctx.arc(enemy.w / 2, enemy.h / 2, enemy.w / 2, Math.PI, 0);
  ctx.lineTo(enemy.w, enemy.h - 4);
  ctx.lineTo(0, enemy.h - 4);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = '#7f1d1d';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Robot eyes (White sclera with black pupils)
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(6, 10, 6, 7);
  ctx.fillRect(enemy.w - 12, 10, 6, 7);

  ctx.fillStyle = '#0f172a';
  const pupilOffset = enemy.vx > 0 ? 3 : 1;
  ctx.fillRect(6 + pupilOffset, 12, 3, 4);
  ctx.fillRect(enemy.w - 12 + pupilOffset, 12, 3, 4);

  // Antenna on top
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(enemy.w / 2, 4);
  ctx.lineTo(enemy.w / 2, -4);
  ctx.stroke();

  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.arc(enemy.w / 2, -4, 3, 0, Math.PI * 2);
  ctx.fill();

  // Feet
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(2, enemy.h - 4 + waddle, 8, 4);
  ctx.fillRect(enemy.w - 10, enemy.h - 4 - waddle, 8, 4);

  ctx.restore();
}

function drawTerminalStation(
  ctx: CanvasRenderingContext2D,
  pos: { x: number; y: number; w: number; h: number },
  isCompleted: boolean,
  tick: number
) {
  ctx.save();
  // Pedestal
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(pos.x + 10, pos.y + 24, pos.w - 20, pos.h - 24);
  ctx.strokeStyle = isCompleted ? '#22c55e' : '#38bdf8';
  ctx.lineWidth = 2;
  ctx.strokeRect(pos.x + 10, pos.y + 24, pos.w - 20, pos.h - 24);

  // Monitor frame
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(pos.x, pos.y, pos.w, 32);
  ctx.strokeRect(pos.x, pos.y, pos.w, 32);

  // Monitor glow
  ctx.fillStyle = isCompleted ? '#15803d' : '#0284c7';
  ctx.fillRect(pos.x + 4, pos.y + 4, pos.w - 8, 24);

  // Text
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 11px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(isCompleted ? 'OK ✓' : 'fx = ?', pos.x + pos.w / 2, pos.y + 20);

  // Pulsing beacon
  const alpha = 0.4 + Math.sin(tick * 0.08) * 0.25;
  ctx.fillStyle = isCompleted ? `rgba(34, 197, 94, ${alpha})` : `rgba(56, 189, 248, ${alpha})`;
  ctx.beginPath();
  ctx.arc(pos.x + pos.w / 2, pos.y - 10, 10, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawLaserGate(
  ctx: CanvasRenderingContext2D,
  x: number,
  groundY: number,
  isCompleted: boolean,
  tick: number
) {
  ctx.save();
  const gateH = 220;
  const topY = groundY - gateH;

  // Pylon emitter top and bottom
  ctx.fillStyle = '#334155';
  ctx.fillRect(x - 4, topY, 18, 20);
  ctx.fillRect(x - 4, groundY - 20, 18, 20);

  if (!isCompleted) {
    // Red glowing security laser barrier
    const flicker = Math.sin(tick * 0.4) * 2;
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 4 + flicker;
    ctx.shadowColor = '#ef4444';
    ctx.shadowBlur = 12;

    ctx.beginPath();
    ctx.moveTo(x + 5, topY + 20);
    ctx.lineTo(x + 5, groundY - 20);
    ctx.stroke();

    // Laser warning sign
    ctx.fillStyle = '#fee2e2';
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('BLOQUEIO', x + 5, topY - 8);
  } else {
    // Deactivated green indicator
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.arc(x + 5, topY + 10, 5, 0, Math.PI * 2);
    ctx.arc(x + 5, groundY - 10, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawFlagpole(
  ctx: CanvasRenderingContext2D,
  pos: { x: number; y: number; w: number; h: number },
  isClimbing: boolean,
  _tick: number
) {
  ctx.save();
  // Pole base
  ctx.fillStyle = '#334155';
  ctx.fillRect(pos.x - 8, pos.y + pos.h - 16, 36, 16);

  // Metal pole
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(pos.x + 8, pos.y, 4, pos.h - 16);

  // Golden ball at top
  ctx.fillStyle = '#facc15';
  ctx.beginPath();
  ctx.arc(pos.x + 10, pos.y, 8, 0, Math.PI * 2);
  ctx.fill();

  // Flag (SENAI Flag)
  const flagY = isClimbing ? pos.y + pos.h - 40 : pos.y + 10;
  ctx.fillStyle = '#0284c7'; // SENAI Blue
  ctx.beginPath();
  ctx.moveTo(pos.x + 12, flagY);
  ctx.lineTo(pos.x + 56, flagY + 16);
  ctx.lineTo(pos.x + 12, flagY + 32);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 8px monospace';
  ctx.fillText('SENAI', pos.x + 16, flagY + 18);

  ctx.restore();
}

/**
 * Super Mario style SENAI Character
 */
function drawMarioPlayer(
  ctx: CanvasRenderingContext2D,
  p: {
    x: number;
    y: number;
    w: number;
    h: number;
    vx: number;
    facing: 'left' | 'right';
    isGrounded: boolean;
    animFrame: number;
  },
  _tick: number
) {
  ctx.save();
  ctx.translate(p.x, p.y);

  if (p.facing === 'left') {
    ctx.translate(p.w, 0);
    ctx.scale(-1, 1);
  }

  // Walk cycle stride
  const stride = p.isGrounded ? Math.sin(p.animFrame * Math.PI / 2) * 5 : 4;

  // Shadow on ground
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.beginPath();
  ctx.ellipse(p.w / 2, p.h + 2, 14, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Shoes / Boots
  ctx.fillStyle = '#451a03'; // Brown Mario Shoes
  ctx.fillRect(4, p.h - 6 + stride, 8, 6);
  ctx.fillRect(16, p.h - 6 - stride, 8, 6);

  // Overalls (SENAI Royal Blue)
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(6, 20, 18, 16);

  // Yellow Overall Buttons
  ctx.fillStyle = '#facc15';
  ctx.fillRect(8, 22, 3, 3);
  ctx.fillRect(19, 22, 3, 3);

  // Shirt under overalls (Red / Technical Orange)
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(4, 16, 22, 8);
  // Arms
  ctx.fillRect(2, 18, 4, 10);
  ctx.fillRect(24, 18, 4, 10);

  // White Technical Gloves
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(1, 26, 5, 5);
  ctx.fillRect(24, 26, 5, 5);

  // Head / Skin
  ctx.fillStyle = '#fde047';
  ctx.fillRect(8, 8, 14, 10);

  // Big Mario-style Mustache
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(14, 13, 9, 4);

  // Eye
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(15, 10, 3, 3);

  // Big Nose
  ctx.fillStyle = '#facc15';
  ctx.fillRect(18, 11, 5, 4);

  // SENAI Cap (Red / Blue with visor)
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(6, 4, 18, 6);
  // Cap Visor
  ctx.fillRect(16, 7, 10, 3);

  // White emblem circle with 'X' for Excel
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(12, 6, 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#107c41';
  ctx.font = 'bold 7px monospace';
  ctx.fillText('X', 10, 8);

  // SENAIZINHO Floating Name Badge
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(-2, -12, 34, 10);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1;
  ctx.strokeRect(-2, -12, 34, 10);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 7px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('SENAIZINHO', 15, -4);

  ctx.restore();
}
