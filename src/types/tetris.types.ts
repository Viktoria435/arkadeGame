export interface Cell {
   filled: boolean;
   color: string;
   shadow: string;
}

export type Board = Cell[][];

export interface TetrominoShape {
   shape: number[][];
   color: string;
   shadow: string;
}

export interface Tetromino extends TetrominoShape {
   type: string;
}

export interface Position {
   x: number;
   y: number;
}

export interface GameStats {
   score: number;
   level: number;
   lines: number;
}
