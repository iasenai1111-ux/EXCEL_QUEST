import React, { useEffect, useRef } from 'react';

interface ParallaxGameSceneProps {
  className?: string;
  interactive?: boolean;
}

export const ParallaxGameScene: React.FC<ParallaxGameSceneProps> = ({
  className = '',
  interactive = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let tick = 0;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Setup DPR resolution
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Stars data
    const stars = Array.from({ length: 45 }, () => ({
      x: Math.random(),
      y: Math.random() * 0.6,
      size: Math.random() * 1.8 + 0.6,
      twinkleSpeed: Math.random() * 0.04 + 0.015,
      phase: Math.random() * Math.PI * 2,
    }));

    // Floating Coins
    const coins = [
      { x: 0.28, y: 0.36, phase: 0 },
      { x: 0.35, y: 0.32, phase: 1.5 },
      { x: 0.42, y: 0.36, phase: 3.0 },
    ];

    const render = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      ctx.clearRect(0, 0, width, height);

      if (!prefersReducedMotion) {
        tick++;
      }

      // 1. Night Sky Background Gradient (#101B35 to #172747)
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, '#0D162B');
      skyGrad.addColorStop(0.5, '#101B35');
      skyGrad.addColorStop(1, '#172747');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // Subtle Excel grid overlay in the sky (faint cyan lines)
      ctx.save();
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.035)';
      ctx.lineWidth = 1;
      const gridSize = 32;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      ctx.restore();

      // 2. Stars
      stars.forEach((star) => {
        const alpha = 0.3 + 0.5 * Math.sin(tick * star.twinkleSpeed + star.phase);
        ctx.fillStyle = `rgba(248, 250, 252, ${Math.max(0.1, alpha)})`;
        ctx.beginPath();
        ctx.arc(star.x * width, star.y * height, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3. Moon (Soft cyan glowing Excel emblem)
      const moonX = width * 0.85;
      const moonY = height * 0.22;
      const moonRadius = Math.min(width, height) * 0.12;

      // Outer glow
      const moonGlow = ctx.createRadialGradient(moonX, moonY, moonRadius * 0.5, moonX, moonY, moonRadius * 2);
      moonGlow.addColorStop(0, 'rgba(34, 211, 238, 0.18)');
      moonGlow.addColorStop(0.5, 'rgba(37, 99, 235, 0.08)');
      moonGlow.addColorStop(1, 'rgba(16, 27, 53, 0)');
      ctx.fillStyle = moonGlow;
      ctx.beginPath();
      ctx.arc(moonX, moonY, moonRadius * 2, 0, Math.PI * 2);
      ctx.fill();

      // Moon body
      ctx.fillStyle = '#1E355B';
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Crescent sheen on moon
      ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.beginPath();
      ctx.arc(moonX - moonRadius * 0.2, moonY - moonRadius * 0.2, moonRadius * 0.7, 0, Math.PI * 2);
      ctx.fill();

      // Excel 'X' inside moon
      ctx.fillStyle = '#22C55E';
      ctx.font = `bold ${Math.round(moonRadius * 0.9)}px 'JetBrains Mono', monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('X', moonX, moonY + 2);

      // 4. Clouds (Layer 1 - slow drift)
      const cloudOffset1 = (tick * 0.2) % (width + 200);
      drawStylizedCloud(ctx, cloudOffset1 - 100, height * 0.18, 120, 'rgba(33, 53, 86, 0.45)');
      drawStylizedCloud(ctx, (cloudOffset1 + width * 0.55) % (width + 200) - 100, height * 0.28, 90, 'rgba(33, 53, 86, 0.35)');

      // 5. Far Mountains Layer (#172747)
      ctx.fillStyle = '#14213D';
      ctx.beginPath();
      ctx.moveTo(0, height);
      ctx.lineTo(0, height * 0.65);
      ctx.lineTo(width * 0.2, height * 0.52);
      ctx.lineTo(width * 0.38, height * 0.68);
      ctx.lineTo(width * 0.62, height * 0.48);
      ctx.lineTo(width * 0.85, height * 0.64);
      ctx.lineTo(width, height * 0.54);
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fill();

      // 6. Mid Mountains Layer (#213556 with crisp neon edge)
      ctx.fillStyle = '#1D304E';
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, height);
      ctx.lineTo(0, height * 0.76);
      ctx.lineTo(width * 0.15, height * 0.66);
      ctx.lineTo(width * 0.32, height * 0.78);
      ctx.lineTo(width * 0.48, height * 0.62);
      ctx.lineTo(width * 0.72, height * 0.75);
      ctx.lineTo(width * 0.9, height * 0.64);
      ctx.lineTo(width, height * 0.72);
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // 7. Ground / Factory Platform (#213556 with green grass/steel top)
      const groundY = height * 0.82;
      ctx.fillStyle = '#213556';
      ctx.fillRect(0, groundY, width, height - groundY);

      // Steel / Emerald grass runner border
      const runnerGrad = ctx.createLinearGradient(0, 0, width, 0);
      runnerGrad.addColorStop(0, '#22C55E');
      runnerGrad.addColorStop(0.5, '#22D3EE');
      runnerGrad.addColorStop(1, '#2563EB');
      ctx.fillStyle = runnerGrad;
      ctx.fillRect(0, groundY, width, 6);

      // Dark bevel underneath
      ctx.fillStyle = '#101B35';
      ctx.fillRect(0, groundY + 6, width, 3);

      // Industrial brick lines on ground
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let bx = 0; bx < width; bx += 40) {
        ctx.strokeRect(bx, groundY + 12, 38, 16);
        ctx.strokeRect(bx + 20, groundY + 28, 38, 16);
      }

      // 8. Floating Mystery Question Block [?] (#FF9F1C & #FFD166)
      const blockX = width * 0.35;
      const blockBob = Math.sin(tick * 0.06) * 3;
      const blockY = height * 0.52 + blockBob;
      const blockSize = Math.min(width * 0.1, 46);

      // Block shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.fillRect(blockX + 4, blockY + 4, blockSize, blockSize);

      // Block body
      const blockGrad = ctx.createLinearGradient(blockX, blockY, blockX, blockY + blockSize);
      blockGrad.addColorStop(0, '#FFE885');
      blockGrad.addColorStop(0.3, '#FFD166');
      blockGrad.addColorStop(1, '#FF9F1C');
      ctx.fillStyle = blockGrad;
      ctx.fillRect(blockX, blockY, blockSize, blockSize);

      // Block border
      ctx.strokeStyle = '#78350F';
      ctx.lineWidth = 2;
      ctx.strokeRect(blockX, blockY, blockSize, blockSize);

      // Block rivets/corners
      ctx.fillStyle = '#78350F';
      const r = 2.5;
      ctx.fillRect(blockX + 2, blockY + 2, r, r);
      ctx.fillRect(blockX + blockSize - 2 - r, blockY + 2, r, r);
      ctx.fillRect(blockX + 2, blockY + blockSize - 2 - r, r, r);
      ctx.fillRect(blockX + blockSize - 2 - r, blockY + blockSize - 2 - r, r, r);

      // Question mark [?]
      ctx.fillStyle = '#78350F';
      ctx.font = `bold ${Math.round(blockSize * 0.65)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('?', blockX + blockSize / 2, blockY + blockSize / 2 + 1);

      // 9. Floating Golden Excel Coins
      coins.forEach((coin) => {
        const cx = coin.x * width;
        const cy = coin.y * height + Math.sin(tick * 0.08 + coin.phase) * 5;
        const scaleX = Math.abs(Math.cos(tick * 0.05 + coin.phase));

        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(Math.max(0.2, scaleX), 1);

        // Coin Outer
        ctx.fillStyle = '#FFD166';
        ctx.beginPath();
        ctx.arc(0, 0, 11, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#B45309';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Inner rim
        ctx.strokeStyle = '#FFFBEB';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(0, 0, 7.5, 0, Math.PI * 2);
        ctx.stroke();

        // Mini Excel FX symbol
        ctx.fillStyle = '#78350F';
        ctx.font = 'bold 8px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('$', 0, 1);

        ctx.restore();
      });

      // 10. SENAI Pipe / Terminal Base on Right
      const pipeX = width * 0.72;
      const pipeW = Math.min(width * 0.12, 64);
      const pipeTopY = groundY - 50;

      // Pipe lip
      const pipeGrad = ctx.createLinearGradient(pipeX, 0, pipeX + pipeW, 0);
      pipeGrad.addColorStop(0, '#1E40AF');
      pipeGrad.addColorStop(0.3, '#3B82F6');
      pipeGrad.addColorStop(0.7, '#2563EB');
      pipeGrad.addColorStop(1, '#1E3A8A');

      ctx.fillStyle = pipeGrad;
      ctx.fillRect(pipeX - 5, pipeTopY, pipeW + 10, 14);
      ctx.strokeStyle = '#60A5FA';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(pipeX - 5, pipeTopY, pipeW + 10, 14);

      // Pipe body
      ctx.fillStyle = pipeGrad;
      ctx.fillRect(pipeX, pipeTopY + 14, pipeW, groundY - (pipeTopY + 14));
      ctx.strokeRect(pipeX, pipeTopY + 14, pipeW, groundY - (pipeTopY + 14));

      // SENAI label on pipe
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('SENAI', pipeX + pipeW / 2, pipeTopY + 10);

      // 11. Hero Character (Senaizinho with Idle Animation)
      const heroX = width * 0.18;
      const heroIdleBob = Math.sin(tick * 0.07) * 3;
      const heroGroundY = groundY;
      drawHeroCharacter(ctx, heroX, heroGroundY, heroIdleBob, tick);

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [interactive]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  );
};

/**
 * Draws rounded stylized cloud
 */
function drawStylizedCloud(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string
) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  const r = size * 0.3;
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.arc(x + r * 0.9, y - r * 0.3, r * 1.1, 0, Math.PI * 2);
  ctx.arc(x + r * 1.8, y, r * 0.85, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/**
 * Renders the hero Senaizinho with breathing idle cycle
 */
function drawHeroCharacter(
  ctx: CanvasRenderingContext2D,
  baseX: number,
  groundY: number,
  bob: number,
  tick: number
) {
  ctx.save();
  const charH = 68;
  const charW = 42;
  const x = baseX;
  const y = groundY - charH + bob;

  // Shadow under character
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.beginPath();
  ctx.ellipse(x + charW / 2, groundY, 18 - Math.abs(bob), 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Shoes / Industrial Boots (#78350F)
  ctx.fillStyle = '#451A03';
  ctx.fillRect(x + 5, y + charH - 12, 13, 12);
  ctx.fillRect(x + 24, y + charH - 12, 13, 12);
  ctx.fillStyle = '#78350F';
  ctx.fillRect(x + 5, y + charH - 12, 13, 4);
  ctx.fillRect(x + 24, y + charH - 12, 13, 4);

  // Overalls (SENAI Royal Blue #2563EB)
  ctx.fillStyle = '#2563EB';
  ctx.fillRect(x + 8, y + 34, 26, 24);

  // Yellow Overall Buttons (#FFD166)
  ctx.fillStyle = '#FFD166';
  ctx.fillRect(x + 11, y + 36, 4, 4);
  ctx.fillRect(x + 27, y + 36, 4, 4);

  // Red/Orange Technical Shirt Underneath (#FF9F1C / #EF4444)
  ctx.fillStyle = '#EF4444';
  ctx.fillRect(x + 6, y + 26, 30, 12);
  // Arms
  ctx.fillRect(x + 2, y + 28, 6, 16);
  ctx.fillRect(x + 34, y + 28, 6, 16);

  // White Safety Gloves
  ctx.fillStyle = '#F8FAFC';
  ctx.fillRect(x + 1, y + 42, 8, 8);
  ctx.fillRect(x + 33, y + 42, 8, 8);

  // Technical Stylus / Golden Ruler in Hand (#FFD166)
  ctx.fillStyle = '#FFD166';
  ctx.fillRect(x + 37, y + 36, 3, 16);
  ctx.fillStyle = '#22D3EE';
  ctx.fillRect(x + 36, y + 34, 5, 3);

  // Face / Skin Tone (#FDE047)
  ctx.fillStyle = '#FDE047';
  ctx.fillRect(x + 11, y + 12, 20, 16);

  // Big Classic Mustache (#1E293B)
  ctx.fillStyle = '#0F172A';
  ctx.fillRect(x + 19, y + 20, 13, 6);

  // Friendly Eyes (blinking occasionally)
  const isBlinking = tick % 140 > 132;
  if (isBlinking) {
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(x + 21, y + 16, 5, 2);
  } else {
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(x + 21, y + 15, 4, 4);
    // Eye sparkle
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(x + 23, y + 15, 1.5, 1.5);
  }

  // Cute Big Nose
  ctx.fillStyle = '#FBBF24';
  ctx.fillRect(x + 25, y + 17, 7, 5);

  // Cap (SENAI Red & Blue #EF4444)
  ctx.fillStyle = '#EF4444';
  ctx.fillRect(x + 9, y + 5, 24, 9);
  // Cap Visor
  ctx.fillRect(x + 24, y + 10, 13, 4);

  // White Circle Badge with Excel 'X'
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(x + 18, y + 9, 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#22C55E';
  ctx.font = 'bold 9px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('X', x + 18, y + 9);

  // Floating Name Badge: SENAIZINHO
  ctx.fillStyle = '#213556';
  ctx.fillRect(x + 1, y - 14, 40, 12);
  ctx.strokeStyle = '#22D3EE';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x + 1, y - 14, 40, 12);

  ctx.fillStyle = '#F8FAFC';
  ctx.font = 'bold 8px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('SENAIZINHO', x + 21, y - 7);

  ctx.restore();
}
