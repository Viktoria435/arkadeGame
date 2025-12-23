import React, { useState } from "react";
import {
   CellValue,
   Position,
   Tetromino,
   BOARD_SIZE,
} from "@/types/blocks.types";
import { canPlaceTetromino } from "@/utils/blocks.utils";
import { COLORS } from "@/constants/tetrominoes";


interface BoardProps {
   board: CellValue[][];
   selectedTetromino: Tetromino | null;
   onPlaceTetromino: (position: Position) => void;
   onBombClick?: (position: Position) => void;
   isBombMode?: boolean;
}

export const Board: React.FC<BoardProps> = ({
   board,
   selectedTetromino,
   onPlaceTetromino,
   onBombClick,
   isBombMode = false,
}) => {
   const [hoverPosition, setHoverPosition] = useState<Position | null>(null);

   const handleCellClick = (row: number, col: number) => {
      if (isBombMode && onBombClick) {
         onBombClick({ row, col });
         return;
      }

      if (selectedTetromino && hoverPosition) {
         onPlaceTetromino(hoverPosition);
      }
   };

   const handleCellHover = (row: number, col: number) => {
      if (!selectedTetromino || isBombMode) {
         setHoverPosition(null);
         return;
      }

      const position = { row, col };
      if (canPlaceTetromino(board, selectedTetromino, position)) {
         setHoverPosition(position);
      } else {
         setHoverPosition(null);
      }
   };

   const handleMouseLeave = () => {
      setHoverPosition(null);
   };

   const isCellInTetromino = (row: number, col: number): boolean => {
      if (!hoverPosition || !selectedTetromino) return false;

      const relRow = row - hoverPosition.row;
      const relCol = col - hoverPosition.col;

      if (relRow < 0 || relRow >= selectedTetromino.shape.length) return false;
      if (relCol < 0 || relCol >= selectedTetromino.shape[0].length)
         return false;

      return selectedTetromino.shape[relRow][relCol];
   };

   const isCellInBombArea = (row: number, col: number): boolean => {
      if (!isBombMode || !hoverPosition) return false;

      return (
         Math.abs(row - hoverPosition.row) <= 1 &&
         Math.abs(col - hoverPosition.col) <= 1
      );
   };

   const getCellColor = (value: CellValue): string => {
      if (value === null) return "transparent";
      return COLORS[value % COLORS.length];
   };

   return (
      <div
         className="inline-block bg-slate-800 p-2 rounded-lg shadow-2xl"
         onMouseLeave={handleMouseLeave}
      >
         <div
            className="grid gap-1"
            style={{ gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)` }}
         >
            {board.map((row, rowIndex) =>
               row.map((cell, colIndex) => {
                  const isHovered = isCellInTetromino(rowIndex, colIndex);
                  const isInBombArea = isCellInBombArea(rowIndex, colIndex);
                  const cellColor = getCellColor(cell);
                  const isEmpty = cell === null;

                  return (
                     <div
                        key={`${rowIndex}-${colIndex}`}
                        className={`
                  w-10 h-10 sm:w-12 sm:h-12 rounded-md transition-all duration-150
                  ${isEmpty ? "bg-slate-700" : ""}
                  ${isHovered ? "ring-2 ring-white scale-105" : ""}
                  ${isInBombArea ? "ring-2 ring-red-500 animate-pulse" : ""}
                  ${
                     selectedTetromino || isBombMode
                        ? "cursor-pointer hover:scale-105"
                        : ""
                  }
                `}
                        style={{
                           backgroundColor: isEmpty ? undefined : cellColor,
                           boxShadow: !isEmpty
                              ? `0 4px 6px -1px ${cellColor}40`
                              : undefined,
                        }}
                        onClick={() => handleCellClick(rowIndex, colIndex)}
                        onMouseEnter={() => handleCellHover(rowIndex, colIndex)}
                     >
                        {isHovered && (
                           <div
                              className="w-full h-full rounded-md opacity-60"
                              style={{
                                 backgroundColor: selectedTetromino?.color,
                              }}
                           />
                        )}
                        {isInBombArea && isEmpty && (
                           <div className="w-full h-full flex items-center justify-center text-xl">
                              💥
                           </div>
                        )}
                     </div>
                  );
               })
            )}
         </div>
      </div>
   );
};
