import { Tetromino } from "../types/blocks.types";

export const TETROMINO_SHAPES = {
   single: [[true]],
   line2: [[true, true]],
   line3: [[true, true, true]],
   line4: [[true, true, true, true]],
   vline2: [[true], [true]],
   vline3: [[true], [true], [true]],
   vline4: [[true], [true], [true], [true]],
   square2: [
      [true, true],
      [true, true],
   ],
   lShape: [
      [true, false],
      [true, false],
      [true, true],
   ],
   tShape: [
      [true, true, true],
      [false, true, false],
   ],
   zShape: [
      [true, true, false],
      [false, true, true],
   ],
   corner: [
      [true, false],
      [true, true],
   ],
   plus: [
      [false, true, false],
      [true, true, true],
      [false, true, false],
   ],
   pShape: [
      [true, true],
      [true, false],
   ],
   stairs: [
      [true, false, false],
      [true, true, false],
      [false, true, true],
   ],
};

export const COLORS = [
   "#ef4444",
   "#f97316",
   "#f59e0b",
   "#84cc16",
   "#10b981",
   "#06b6d4",
   "#3b82f6",
   "#8b5cf6",
   "#ec4899",
   "#f43f5e",
];

export const generateRandomTetromino = (id: string): Tetromino => {
   const shapes = Object.values(TETROMINO_SHAPES);
   const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
   const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];

   return {
      id,
      shape: randomShape,
      color: randomColor,
   };
};

export const generateTetrominoes = (): Tetromino[] => {
   return [
      generateRandomTetromino("t1"),
      generateRandomTetromino("t2"),
      generateRandomTetromino("t3"),
   ];
};

export const getTetrominoSize = (
   shape: boolean[][]
): { width: number; height: number } => {
   return {
      height: shape.length,
      width: shape[0]?.length || 0,
   };
};
