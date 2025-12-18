"use client";

import React from "react";
import type {
   Board as BoardType,
   Tetromino,
   Position,
} from "@/types/tetris.types";
import { BOARD_WIDTH, BOARD_HEIGHT } from "@/constants/tetris.constants";

interface BoardProps {
   board: BoardType;
   currentPiece: Tetromino | null;
   position: Position;
   ghostPosition: Position;
}

export const Board: React.FC<BoardProps> = ({
   board,
   currentPiece,
   position,
   ghostPosition,
}) => {
   const displayBoard = board.map((row) => row.map((cell) => ({ ...cell })));

   if (currentPiece && ghostPosition && ghostPosition.y !== position.y) {
      for (let y = 0; y < currentPiece.shape.length; y++) {
         for (let x = 0; x < currentPiece.shape[y].length; x++) {
            if (currentPiece.shape[y][x]) {
               const boardY = ghostPosition.y + y;
               const boardX = ghostPosition.x + x;
               if (
                  boardY >= 0 &&
                  boardY < BOARD_HEIGHT &&
                  boardX >= 0 &&
                  boardX < BOARD_WIDTH &&
                  !displayBoard[boardY][boardX].filled
               ) {
                  displayBoard[boardY][boardX] = {
                     filled: true,
                     color: currentPiece.color,
                     shadow: "opacity-30",
                  };
               }
            }
         }
      }
   }

   if (currentPiece && position) {
      for (let y = 0; y < currentPiece.shape.length; y++) {
         for (let x = 0; x < currentPiece.shape[y].length; x++) {
            if (currentPiece.shape[y][x]) {
               const boardY = position.y + y;
               const boardX = position.x + x;
               if (
                  boardY >= 0 &&
                  boardY < BOARD_HEIGHT &&
                  boardX >= 0 &&
                  boardX < BOARD_WIDTH
               ) {
                  displayBoard[boardY][boardX] = {
                     filled: true,
                     color: currentPiece.color,
                     shadow: currentPiece.shadow,
                  };
               }
            }
         }
      }
   }

   return (
      <div className="rounded-2xl p-4 shadow-xl border border-white/20">
         <div
            className="grid gap-[2px] bg-neutral-50/30 p-2 rounded-lg shadow-xl"
            style={{
               gridTemplateColumns: `repeat(${BOARD_WIDTH}, 1fr)`,
               gridTemplateRows: `repeat(${BOARD_HEIGHT}, 1fr)`,
            }}
         >
            {displayBoard.flat().map((cell, i) => (
               <div
                  key={i}
                  className={`w-6 h-6 rounded-md transition-all duration-300 ${
                     cell.filled
                        ? `${cell.color} ${cell.shadow} shadow-lg`
                        : "bg-gradient-to-br from-gray-100/20 to-gray-200/30"
                  }`}
               />
            ))}
         </div>
      </div>
   );
};
