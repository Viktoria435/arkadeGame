import {
   CellValue,
   Position,
   Tetromino,
   BOARD_SIZE,
} from "../types/blocks.types";

export const createEmptyBoard = (): CellValue[][] => {
   return Array(BOARD_SIZE)
      .fill(null)
      .map(() => Array(BOARD_SIZE).fill(null));
};
export const canPlaceTetromino = (
   board: CellValue[][],
   tetromino: Tetromino,
   position: Position
): boolean => {
   const { shape } = tetromino;

   for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
         if (shape[row][col]) {
            const boardRow = position.row + row;
            const boardCol = position.col + col;

            if (
               boardRow < 0 ||
               boardRow >= BOARD_SIZE ||
               boardCol < 0 ||
               boardCol >= BOARD_SIZE
            ) {
               return false;
            }

            if (board[boardRow][boardCol] !== null) {
               return false;
            }
         }
      }
   }

   return true;
};

export const placeTetromino = (
   board: CellValue[][],
   tetromino: Tetromino,
   position: Position
): CellValue[][] => {
   const newBoard = board.map((row) => [...row]);
   const { shape } = tetromino;
   const colorIndex = parseInt(tetromino.id.slice(1)) || 0;

   for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
         if (shape[row][col]) {
            const boardRow = position.row + row;
            const boardCol = position.col + col;
            newBoard[boardRow][boardCol] = colorIndex;
         }
      }
   }

   return newBoard;
};

export const clearFilledLines = (
   board: CellValue[][]
): {
   newBoard: CellValue[][];
   linesCleared: number;
   clearedCells: Position[];
} => {
   const clearedCells: Position[] = [];
   let linesCleared = 0;

   for (let row = 0; row < BOARD_SIZE; row++) {
      if (board[row].every((cell) => cell !== null)) {
         linesCleared++;
         for (let col = 0; col < BOARD_SIZE; col++) {
            clearedCells.push({ row, col });
         }
      }
   }
   for (let col = 0; col < BOARD_SIZE; col++) {
      if (board.every((row) => row[col] !== null)) {
         linesCleared++;
         for (let row = 0; row < BOARD_SIZE; row++) {
            if (
               !clearedCells.some(
                  (cell) => cell.row === row && cell.col === col
               )
            ) {
               clearedCells.push({ row, col });
            }
         }
      }
   }

   const newBoard = board.map((row) => [...row]);
   clearedCells.forEach(({ row, col }) => {
      newBoard[row][col] = null;
   });

   return { newBoard, linesCleared, clearedCells };
};

export const hasValidMoves = (
   board: CellValue[][],
   tetrominoes: Tetromino[]
): boolean => {
   for (const tetromino of tetrominoes) {
      for (let row = 0; row < BOARD_SIZE; row++) {
         for (let col = 0; col < BOARD_SIZE; col++) {
            if (canPlaceTetromino(board, tetromino, { row, col })) {
               return true;
            }
         }
      }
   }
   return false;
};

export const clearBombArea = (
   board: CellValue[][],
   position: Position
): {
   newBoard: CellValue[][];
   cellsCleared: number;
} => {
   const newBoard = board.map((row) => [...row]);
   let cellsCleared = 0;

   for (let row = position.row - 1; row <= position.row + 1; row++) {
      for (let col = position.col - 1; col <= position.col + 1; col++) {
         if (row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE) {
            if (newBoard[row][col] !== null) {
               newBoard[row][col] = null;
               cellsCleared++;
            }
         }
      }
   }

   return { newBoard, cellsCleared };
};

export const calculateScore = (
   linesCleared: number,
   cellsCleared: number
): number => {
   const lineBonus = linesCleared * 100;
   const cellBonus = cellsCleared * 10;
   const comboBonus = linesCleared > 1 ? (linesCleared - 1) * 50 : 0;

   return lineBonus + cellBonus + comboBonus;
};
