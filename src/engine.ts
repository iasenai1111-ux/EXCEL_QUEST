/**
 * engine.ts / engine module for EXCEL QUEST 2.1
 * Core game engine, 2D Super Mario style platformer physics, collision handling, and evaluation pipeline.
 */
import { evaluateFormula, validateStageChallenge } from './utils/formulaParser';
import { soundManager } from './utils/audio';
import { StageDefinition, CellData } from './types/game';

export { evaluateFormula, validateStageChallenge, soundManager };

export interface EntityBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface PlayerPhysics {
  x: number;
  y: number;
  w: number;
  h: number;
  vx: number;
  vy: number;
  speed: number;
  jumpPower: number;
  isGrounded: boolean;
  isSprinting?: boolean;
  invulnerableTimer?: number;
  lives?: number;
}

export interface QuestionBlock {
  id: number;
  x: number;
  y: number;
  w: number;
  h: number;
  type: 'question' | 'brick' | 'used';
  hitOffset: number;
  hasCoin: boolean;
  contentLabel?: string;
}

export interface EnemyBot {
  id: number;
  x: number;
  y: number;
  w: number;
  h: number;
  vx: number;
  isAlive: boolean;
  squashTimer: number;
  patrolMinX: number;
  patrolMaxX: number;
  name: string;
  color?: string;
}

export function checkAABBCollision(a: EntityBox, b: EntityBox): boolean {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

export function calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.hypot(x1 - x2, y1 - y2);
}

/**
 * Checks if player hits block from underneath (Mario Headbutt)
 */
export function checkHeadbuttBlock(player: PlayerPhysics, block: QuestionBlock): boolean {
  if (block.type === 'used') return false;
  // Player is moving upward or just arrived at bottom edge
  const isHorizontallyAligned =
    player.x + player.w > block.x + 4 &&
    player.x < block.x + block.w - 4;
  const isHittingBottom =
    player.y <= block.y + block.h + 8 &&
    player.y >= block.y + block.h - 10 &&
    player.vy <= 0;

  return isHorizontallyAligned && isHittingBottom;
}

/**
 * Checks if player stomps enemy from above (Mario Stomp)
 */
export function checkStompEnemy(player: PlayerPhysics, enemy: EnemyBot): boolean {
  if (!enemy.isAlive) return false;
  const isHorizontallyAligned =
    player.x + player.w > enemy.x + 4 &&
    player.x < enemy.x + enemy.w - 4;
  const isFallingOntoTop =
    player.y + player.h >= enemy.y &&
    player.y + player.h <= enemy.y + 16 &&
    player.vy > 0;

  return isHorizontallyAligned && isFallingOntoTop;
}

export function updatePhysicsStep(
  player: PlayerPhysics,
  gravity: number = 0.52,
  maxFallSpeed: number = 12
): void {
  player.vy += gravity;
  if (player.vy > maxFallSpeed) {
    player.vy = maxFallSpeed;
  }
  player.x += player.vx;
  player.y += player.vy;
}
