"use client";

import { cellSize } from "@/constants/Tetrominoes";

export const clearSquare = (
   board: (string | null)[][],
   setBoard: React.Dispatch<React.SetStateAction<(string | null)[][]>>,
   rowIndex: number,
   colIndex: number
) => {
   const newBoard = board.map((row) => [...row]);

   const startRow = Math.max(0, rowIndex - 1);
   const endRow = Math.min(board.length - 1, rowIndex + 1);
   const startCol = Math.max(0, colIndex - 1);
   const endCol = Math.min(board[0].length - 1, colIndex + 1);

   for (let r = startRow; r <= endRow; r++) {
      for (let c = startCol; c <= endCol; c++) {
         newBoard[r][c] = null;
      }
   }
   setBoard(newBoard);
};

export const handleSquareClearAction = (
   board: (string | null)[][],
   setBoard: React.Dispatch<React.SetStateAction<(string | null)[][]>>,
   e: React.MouseEvent<HTMLDivElement>
) => {
   const boardRect = e.currentTarget.getBoundingClientRect();
   const x = e.clientX - boardRect.left;
   const y = e.clientY - boardRect.top;

   const cell = cellSize;
   const colIndex = Math.floor(x / cell);
   const rowIndex = Math.floor(y / cell);

   if (
      colIndex >= 0 &&
      colIndex < board[0].length &&
      rowIndex >= 0 &&
      rowIndex < board.length
   ) {
      clearSquare(board, setBoard, rowIndex, colIndex);
   }
};
