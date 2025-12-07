import { BoardCell } from "@/types/cell.t";

export const animateClearedCells = (
   rowsToClear: number[],
   colsToClear: Set<number>,
   newBoard: BoardCell[][]
) =>
   newBoard.map((row, r) =>
      row.map((cell, c) =>
         rowsToClear.includes(r) || colsToClear.has(c) ? "shake" : cell
      )
   );

export const clearCellsAfterAnimation = (
   rowsToClear: number[],
   colsToClear: Set<number>,
   newBoard: BoardCell[][]
) =>
   newBoard.map((row, r) =>
      row.map((cell, c) =>
         rowsToClear.includes(r) || colsToClear.has(c) ? null : cell
      )
   );
