import {
   BOARD_WIDTH,
   BOARD_HEIGHT,
   TETROMINOES,
} from "@/constants/tetris.constants";
import { Board, Cell, Tetromino } from "@/types/tetris.types";

export const createEmptyBoard = (): Board =>
   Array.from({ length: BOARD_HEIGHT }, () =>
      Array.from(
         { length: BOARD_WIDTH },
         (): Cell => ({ filled: false, color: "", shadow: "" })
      )
   );

export const getRandomTetromino = (): Tetromino => {
   const keys = Object.keys(TETROMINOES);
   const randomKey = keys[Math.floor(Math.random() * keys.length)];
   return { type: randomKey, ...TETROMINOES[randomKey] };
};

export const rotateTetromino = (shape: number[][]): number[][] => {
   const rotated = shape[0].map((_, i) => shape.map((row) => row[i]).reverse());
   return rotated;
};
