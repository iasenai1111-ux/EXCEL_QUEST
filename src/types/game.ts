export type GameMode = 'menu' | 'playing' | 'stage_select';

export type StudentMode = 'individual' | 'dupla';

export interface StudentProfile {
  name: string;
  className: string;
  mode: StudentMode;
  partnerName?: string;
  createdAt: string;
}

export interface CellData {
  value: string | number;
  type: 'label' | 'number' | 'currency' | 'percent' | 'editable';
  format?: string;
}

export interface GridDefinition {
  columns: string[]; // e.g. ['A', 'B', 'C', 'D']
  rows: number[]; // e.g. [1, 2, 3]
  cells: Record<string, CellData>; // e.g. { 'B2': { value: 120, type: 'number' } }
}

export interface StageQuestion {
  questionIndex: number;
  targetCell: string;
  expectedValue: number;
  instruction: string;
  operationName: string;
  acceptedFormulasDescription: string;
  requiredCells: string[];
  hints: [string, string, string];
}

export interface StageFormulaChallenge {
  targetCell: string; // e.g. 'D2'
  expectedValue: number; // e.g. 200
  instruction: string; // e.g. "Calcule o total de itens somando B2 e C2"
  operationName: string; // e.g. "Adição / SOMA"
  acceptedFormulasDescription: string;
  // Validation function logic helpers
  allowedFunctions: string[]; // ['SOMA', 'SUM']
  requiredCells: string[]; // ['B2', 'C2']
  hints: [string, string, string]; // [conceitual, destaque de células, exemplo guiado]
  questions?: StageQuestion[]; // Multiple questions per stage (Phase 1 = 1, Phase 2 = 2 ... Phase 10 = 10)
  realExcelInstructions: {
    sheetName: string;
    sheetIndex: number;
    cellsToFill: string;
    expectedResultText: string;
    description: string;
  };
}

export interface StageDefinition {
  id: number;
  title: string;
  subtitle: string;
  theme: 'market' | 'warehouse' | 'factory' | 'arena' | 'boss';
  accentColor: string;
  bgGradient: string;
  learningGoal: string;
  storyIntro: string;
  grid: GridDefinition;
  challenge: StageFormulaChallenge;
  worldMapCoordinates: { x: number; y: number };
  coinsAvailable: number;
}

export interface Medal {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export interface GameProgress {
  currentStageId: number;
  highestUnlockedStageId: number;
  completedStages: number[];
  realExcelConfirmedStages: number[];
  xp: number;
  coins: number;
  medals: string[]; // medal IDs
  attemptsPerStage: Record<number, number>;
  timeSpentSeconds: number;
}
