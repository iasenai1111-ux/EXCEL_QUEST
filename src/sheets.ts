/**
 * sheets.ts / sheets module for EXCEL QUEST 2.1
 * Handles spreadsheet structure, Excel workbook creation, cell definitions, and XLSX export.
 */
import * as XLSX from 'xlsx';
import { StudentProfile, StageDefinition } from './types/game';
import { generateStudentWorkbook } from './utils/xlsxGenerator';
import { LEVEL_1_STAGES } from './data/stages';

export { generateStudentWorkbook, LEVEL_1_STAGES };

export interface SheetExerciseSpec {
  stageId: number;
  sheetName: string;
  targetCell: string;
  expectedValue: number;
}

export function getStageSheetSpecs(): SheetExerciseSpec[] {
  return LEVEL_1_STAGES.map((s: StageDefinition) => ({
    stageId: s.id,
    sheetName: s.challenge.realExcelInstructions.sheetName,
    targetCell: s.challenge.targetCell,
    expectedValue: s.challenge.expectedValue,
  }));
}

export function createBlankStudentWorkbook(profile: StudentProfile | null): XLSX.WorkBook {
  const wb = XLSX.utils.book_new();
  const studentName = profile?.name || 'Aluno SENAI';
  const studentClass = profile?.className || 'Turma SENAI';

  LEVEL_1_STAGES.forEach((stage: StageDefinition) => {
    const rows = [
      stage.grid.columns,
      stage.grid.columns.map((col) => {
        const coord = `${col}2`;
        if (coord === stage.challenge.targetCell) return '';
        const cell = stage.grid.cells[coord];
        return cell ? cell.value : '';
      }),
      ['Aluno:', studentName, 'Turma:', studentClass],
    ];
    const ws = XLSX.utils.aoa_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, stage.challenge.realExcelInstructions.sheetName);
  });

  return wb;
}
