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
   "#ef4444", // red
   "#f97316", // orange
   "#f59e0b", // amber
   "#84cc16", // lime
   "#10b981", // emerald
   "#06b6d4", // cyan
   "#3b82f6", // blue
   "#8b5cf6", // violet
   "#ec4899", // pink
   "#f43f5e", // rose
];

export const generateRandomTetromino = (id: string): Tetromino => {
   const shapes = Object.values(TETROMINO_SHAPES);
   
   // Используем Math.random() для настоящей случайности
   const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
   const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];

   return {
      id,
      shape: randomShape,
      color: randomColor,
   };
};

export const generateTetrominoes = (): Tetromino[] => {
   // Генерируем уникальные ID с временной меткой для каждого вызова
   const timestamp = Date.now();
   return [
      generateRandomTetromino(`t1-${timestamp}`),
      generateRandomTetromino(`t2-${timestamp}`),
      generateRandomTetromino(`t3-${timestamp}`),
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