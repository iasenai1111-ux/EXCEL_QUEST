import { GameProgress, StudentProfile } from '../types/game';

const STORAGE_KEY_PROFILE = 'excel_quest_student_profile';
const STORAGE_KEY_PROGRESS = 'excel_quest_game_progress';

export const INITIAL_PROGRESS: GameProgress = {
  currentStageId: 1,
  highestUnlockedStageId: 1,
  completedStages: [],
  realExcelConfirmedStages: [],
  xp: 0,
  coins: 0,
  medals: [],
  attemptsPerStage: {},
  timeSpentSeconds: 0,
};

export function loadStudentProfile(): StudentProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROFILE);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveStudentProfile(profile: StudentProfile): void {
  try {
    localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
  } catch (err) {
    console.error('Falha ao salvar perfil do aluno no localStorage', err);
  }
}

export function clearStudentProfile(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_PROFILE);
  } catch (err) {
    console.error('Falha ao limpar perfil', err);
  }
}

export function loadGameProgress(): GameProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROGRESS);
    if (!raw) return INITIAL_PROGRESS;
    const parsed = JSON.parse(raw);
    return {
      ...INITIAL_PROGRESS,
      ...parsed,
      // Ensure arrays and objects exist
      completedStages: parsed.completedStages || [],
      realExcelConfirmedStages: parsed.realExcelConfirmedStages || [],
      medals: parsed.medals || [],
      attemptsPerStage: parsed.attemptsPerStage || {}
    };
  } catch {
    return INITIAL_PROGRESS;
  }
}

export function saveGameProgress(progress: GameProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(progress));
  } catch (err) {
    console.error('Falha ao salvar progresso no localStorage', err);
  }
}

export function resetGameProgress(): GameProgress {
  try {
    localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(INITIAL_PROGRESS));
  } catch {}
  return INITIAL_PROGRESS;
}

/**
 * Generates an anonymized portable save code (no student personal data included).
 * Allows students to transfer progress between computer lab machines securely.
 */
export function generateExportSaveCode(progress: GameProgress): string {
  const anonymizedData = {
    v: 1,
    h: progress.highestUnlockedStageId,
    c: progress.completedStages,
    r: progress.realExcelConfirmedStages,
    x: progress.xp,
    cn: progress.coins,
    m: progress.medals,
    t: progress.timeSpentSeconds,
    chk: (progress.xp * 7 + progress.coins * 3) % 9999
  };

  const jsonStr = JSON.stringify(anonymizedData);
  // Base64 encode safe for ASCII
  const b64 = btoa(unescape(encodeURIComponent(jsonStr)));
  return `EXQ-${b64}`;
}

/**
 * Imports an anonymized save code and returns updated progress, or null if invalid.
 */
export function parseImportSaveCode(code: string): Partial<GameProgress> | null {
  try {
    const clean = code.trim();
    if (!clean.startsWith('EXQ-')) return null;
    const b64 = clean.replace(/^EXQ-/, '');
    const jsonStr = decodeURIComponent(escape(atob(b64)));
    const parsed = JSON.parse(jsonStr);

    if (parsed.v !== 1 || !Array.isArray(parsed.c)) {
      return null;
    }

    return {
      highestUnlockedStageId: Number(parsed.h) || 1,
      completedStages: parsed.c,
      realExcelConfirmedStages: parsed.r || [],
      xp: Number(parsed.x) || 0,
      coins: Number(parsed.cn) || 0,
      medals: parsed.m || [],
      timeSpentSeconds: Number(parsed.t) || 0,
      currentStageId: Number(parsed.h) || 1
    };
  } catch {
    return null;
  }
}
