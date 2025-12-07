export const tetrominoes: number[][][] = [
   [[1, 1, 1, 1]],
   [
      [1, 1],
      [1, 1],
   ],
   [
      [1, 1, 1],
      [0, 1, 0],
   ],
   [
      [1, 1, 0],
      [0, 1, 1],
   ],
   [
      [0, 1, 1],
      [1, 1, 0],
   ],
   [
      [1, 1, 1],
      [1, 0, 0],
   ],
   [
      [1, 1, 1],
      [0, 0, 1],
   ],
];

const extraTetrominoes: number[][][] = [
   [
      [1, 1],
      [0, 0],
   ],
   [
      [1, 0],
      [0, 1],
   ],
];

export const cellSize: number = 42;

export const blockTetrominoes: number[][][] = [
   ...tetrominoes,
   ...extraTetrominoes,
];
