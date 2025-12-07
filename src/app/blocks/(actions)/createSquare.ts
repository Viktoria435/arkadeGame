"use client";


import { cellSize } from "@/constants/Tetrominoes";

export const createSingleBlockTetromino = (
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
      rowIndex < board.length &&
      board[rowIndex][colIndex] === null
   ) {
      const newBoard = [...board];
      newBoard[rowIndex][colIndex] = "rgba(48, 211, 56, 1)";

      setBoard(newBoard);
   }
};
