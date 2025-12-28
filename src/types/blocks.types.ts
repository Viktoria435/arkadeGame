export type CellValue = number | null | string;

export interface Position {
   row: number;
   col: number;
}

export interface Tetromino {
   id: string;
   shape: boolean[][];
   color: string;
}

export interface PowerUp {
   type: "bomb" | "shuffle" | "single";
   count: number;
   maxCount: number;
}

export interface GameState {
   board: CellValue[][];
   score: number;
   tetrominoes: Tetromino[];
   powerUps: {
      bomb: PowerUp;
      shuffle: PowerUp;
      single: PowerUp;
   };
   gameOver: boolean;
   selectedTetromino: string | null;
   isPlacingTetromino: boolean;
}

export const BOARD_SIZE = 8;
