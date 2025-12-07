import { TetrominoShape } from "@/types/tetris.types";

export const TETROMINOES: Record<string, TetrominoShape> = {
   I: {
      shape: [[1, 1, 1, 1]],
      color: "bg-cyan-500",
      shadow: "shadow-cyan-500/50",
   },
   O: {
      shape: [
         [1, 1],
         [1, 1],
      ],
      color: "bg-yellow-500",
      shadow: "shadow-yellow-500/50",
   },
   T: {
      shape: [
         [0, 1, 0],
         [1, 1, 1],
      ],
      color: "bg-purple-500",
      shadow: "shadow-purple-500/50",
   },
   S: {
      shape: [
         [0, 1, 1],
         [1, 1, 0],
      ],
      color: "bg-green-500",
      shadow: "shadow-green-500/50",
   },
   Z: {
      shape: [
         [1, 1, 0],
         [0, 1, 1],
      ],
      color: "bg-red-500",
      shadow: "shadow-red-500/50",
   },
   J: {
      shape: [
         [1, 0, 0],
         [1, 1, 1],
      ],
      color: "bg-blue-500",
      shadow: "shadow-blue-500/50",
   },
   L: {
      shape: [
         [0, 0, 1],
         [1, 1, 1],
      ],
      color: "bg-orange-500",
      shadow: "shadow-orange-500/50",
   },
};

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

export const POINTS = {
   1: 100,
   2: 300,
   3: 500,
   4: 800,
};
