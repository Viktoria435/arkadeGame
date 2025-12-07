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
}

export const Board: React.FC<BoardProps> = ({
   board,
   currentPiece,
   position,
}) => {
   const displayBoard = board.map((row) => row.map((cell) => ({ ...cell })));

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
      <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-2xl">
         <div
            className="grid gap-[2px] bg-gray-900 p-2 rounded-lg shadow-2xl"
            style={{
               gridTemplateColumns: `repeat(${BOARD_WIDTH}, 1fr)`,
               gridTemplateRows: `repeat(${BOARD_HEIGHT}, 1fr)`,
            }}
         >
            {displayBoard.flat().map((cell, i) => (
               <div
                  key={i}
                  className={`w-6 h-6 rounded-sm transition-all duration-150 ${
                     cell.filled
                        ? `${cell.color} ${cell.shadow} shadow-lg`
                        : "bg-gradient-to-br from-gray-800 to-gray-900"
                  }`}
               />
            ))}
         </div>
      </div>
   );
};
