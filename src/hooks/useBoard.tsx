import { useState, useEffect } from "react";

import { ActionsRemaining } from "@/interfaces/blocks.interface";
import {
   animateClearedCells,
   clearCellsAfterAnimation,
} from "@/utils/boardHelpers";
import { tetrominoes } from "@/constants/Tetrominoes";
import { BoardCell } from "@/types/cell.t";

export const useBoard = () => {
   const [board, setBoard] = useState<BoardCell[][]>(
      Array(9)
         .fill(null)
         .map(() => Array(9).fill(null))
   );
   const [score, setScore] = useState<number>(0);
   const [nextTetrominoes, setNextTetrominoes] = useState<(number | null)[]>([
      null,
      null,
      null,
   ]);
   const [tetrominoPlaceability, setTetrominoPlaceability] = useState<
      boolean[]
   >([true, true, true]);
   const [actionsRemaining, setActionsRemaining] = useState<ActionsRemaining>({
      singleBlock: 3,
      clearCells: 3,
      updateTetromino: 3,
   });

   useEffect(() => {
      setNextTetrominoes(
         Array(3)
            .fill(0)
            .map(() => Math.floor(Math.random() * tetrominoes.length))
      );
   }, []);

   const checkCanPlaceTetromino = (
      rowIndex: number,
      colIndex: number,
      tetromino: number[][]
   ) => {
      for (let r = 0; r < tetromino.length; r++) {
         for (let c = 0; c < tetromino[r].length; c++) {
            if (tetromino[r][c] === 1) {
               const targetRow = rowIndex + r;
               const targetCol = colIndex + c;
               if (
                  targetRow >= board.length ||
                  targetCol >= board[0].length ||
                  targetCol < 0 ||
                  targetRow < 0 ||
                  board[targetRow][targetCol] !== null
               ) {
                  return false;
               }
            }
         }
      }
      return true;
   };

   const checkAndClearLines = (newBoard: BoardCell[][]) => {
      const rowsToClear: number[] = [];
      const colsToClear = new Set<number>();

      for (let r = 0; r < newBoard.length; r++)
         if (newBoard[r].every((cell) => cell !== null && cell !== "shake"))
            rowsToClear.push(r);

      for (let c = 0; c < newBoard[0].length; c++)
         if (newBoard.every((row) => row[c] !== null && row[c] !== "shake"))
            colsToClear.add(c);

      if (rowsToClear.length > 0 || colsToClear.size > 0) {
         const totalLinesCleared = rowsToClear.length + colsToClear.size;
         const pointsEarned = totalLinesCleared * 100 * totalLinesCleared;
         setScore((prev) => prev + pointsEarned);

         const animatedBoard = animateClearedCells(
            rowsToClear,
            colsToClear,
            newBoard
         );
         setBoard(animatedBoard);

         setTimeout(() => {
            const clearedBoard = clearCellsAfterAnimation(
               rowsToClear,
               colsToClear,
               newBoard
            );
            setBoard(clearedBoard);
         }, 500);
      } else {
         setBoard(newBoard);
      }
   };

   return {
      board,
      setBoard,
      score,
      nextTetrominoes,
      setNextTetrominoes,
      tetrominoPlaceability,
      setTetrominoPlaceability,
      actionsRemaining,
      setActionsRemaining,
      checkCanPlaceTetromino,
      checkAndClearLines,
   };
};
