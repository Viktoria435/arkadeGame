import React, { useState, useEffect } from "react";
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
   clearingCells?: Position[];
}

export const Board: React.FC<BoardProps> = ({
   board,
   selectedTetromino,
   onPlaceTetromino,
   onBombClick,
   isBombMode = false,
   clearingCells = [],
}) => {
   const [hoverPosition, setHoverPosition] = useState<Position | null>(null);
   const [explodingCells, setExplodingCells] = useState<Set<string>>(new Set());
   const [explodingPosition, setExplodingPosition] = useState<Position | null>(null);

   // Очищаем анимацию взрыва через 600ms
   useEffect(() => {
      if (explodingCells.size > 0) {
         const timer = setTimeout(() => {
            setExplodingCells(new Set());
            setExplodingPosition(null);
         }, 600);
         return () => clearTimeout(timer);
      }
   }, [explodingCells]);

   const handleCellClick = (row: number, col: number) => {
      if (isBombMode && onBombClick) {
         // Запускаем анимацию взрыва
         const bombCells = new Set<string>();
         for (let r = row - 1; r <= row + 1; r++) {
            for (let c = col - 1; c <= col + 1; c++) {
               if (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE) {
                  bombCells.add(`${r}-${c}`);
               }
            }
         }
         setExplodingCells(bombCells);
         setExplodingPosition({ row, col });
         
         // Задержка перед фактическим удалением клеток
         setTimeout(() => {
            onBombClick({ row, col });
         }, 300);
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

   const isCellExploding = (row: number, col: number): boolean => {
      return explodingCells.has(`${row}-${col}`);
   };

   const isCellClearing = (row: number, col: number): boolean => {
      return clearingCells.some(
         (cell) => cell.row === row && cell.col === col
      );
   };

   const getCellColor = (value: CellValue): string => {
      if (value === null) return "transparent";
      // Если это строка (цвет), возвращаем её напрямую
      if (typeof value === "string") return value;
      // Fallback для старых числовых значений
      return COLORS[value % COLORS.length];
   };

   return (
      <div
         className="inline-block bg-slate-800 p-2 rounded-lg shadow-2xl relative"
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
                  const isExploding = isCellExploding(rowIndex, colIndex);
                  const isClearing = isCellClearing(rowIndex, colIndex);
                  const cellColor = getCellColor(cell);
                  const isEmpty = cell === null;

                  return (
                     <div
                        key={`${rowIndex}-${colIndex}`}
                        className={`
                  w-10 h-10 sm:w-12 sm:h-12 rounded-md transition-all duration-150 relative
                  ${isEmpty ? "bg-slate-700" : ""}
                  ${isHovered ? "ring-2 ring-white scale-105" : ""}
                  ${isInBombArea && !isExploding ? "ring-2 ring-red-500 animate-pulse" : ""}
                  ${isExploding ? "animate-explosion" : ""}
                  ${isClearing ? "animate-line-clear" : ""}
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
                        {isInBombArea && isEmpty && !isExploding && (
                           <div className="w-full h-full flex items-center justify-center text-xl">
                              💥
                           </div>
                        )}
                        {isExploding && (
                           <div className="absolute inset-0 flex items-center justify-center">
                              <div className="explosion-particle text-3xl sm:text-4xl animate-explosion-scale">
                                 💥
                              </div>
                           </div>
                        )}
                        {isClearing && (
                           <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-2xl animate-sparkle">
                                 ✨
                              </div>
                           </div>
                        )}
                     </div>
                  );
               })
            )}
         </div>
         
         {/* Центральный эпицентр взрыва */}
         {explodingPosition && (
            <div 
               className="absolute pointer-events-none"
               style={{
                  left: `${explodingPosition.col * 44 + 28}px`,
                  top: `${explodingPosition.row * 44 + 28}px`,
               }}
            >
               <div className="text-6xl animate-explosion-center">
                  💣
               </div>
            </div>
         )}
         
         {/* CSS анимации */}
         <style jsx>{`
            @keyframes explosion {
               0% {
                  transform: scale(1);
                  opacity: 1;
               }
               50% {
                  transform: scale(1.3);
                  opacity: 0.8;
                  background-color: #ff4444;
               }
               100% {
                  transform: scale(0.8);
                  opacity: 0;
               }
            }
            
            @keyframes explosion-scale {
               0% {
                  transform: scale(0.5) rotate(0deg);
                  opacity: 0;
               }
               50% {
                  transform: scale(1.5) rotate(180deg);
                  opacity: 1;
               }
               100% {
                  transform: scale(2) rotate(360deg);
                  opacity: 0;
               }
            }
            
            @keyframes explosion-center {
               0% {
                  transform: scale(1) rotate(0deg);
                  opacity: 1;
               }
               30% {
                  transform: scale(1.5) rotate(90deg);
                  opacity: 1;
               }
               100% {
                  transform: scale(3) rotate(360deg);
                  opacity: 0;
               }
            }
            
            @keyframes line-clear {
               0% {
                  transform: scale(1) rotate(0deg);
                  opacity: 1;
                  filter: brightness(1);
               }
               25% {
                  transform: scale(1.2);
                  filter: brightness(2);
               }
               50% {
                  transform: scale(1.1) rotate(180deg);
                  opacity: 0.8;
                  filter: brightness(3) saturate(2);
               }
               75% {
                  transform: scale(0.8) rotate(270deg);
                  opacity: 0.4;
                  filter: brightness(1.5);
               }
               100% {
                  transform: scale(0) rotate(360deg);
                  opacity: 0;
                  filter: brightness(0);
               }
            }
            
            @keyframes sparkle {
               0%, 100% {
                  transform: scale(0) rotate(0deg);
                  opacity: 0;
               }
               50% {
                  transform: scale(1.5) rotate(180deg);
                  opacity: 1;
               }
            }
            
            .animate-explosion {
               animation: explosion 0.6s ease-out forwards;
            }
            
            .animate-explosion-scale {
               animation: explosion-scale 0.6s ease-out forwards;
            }
            
            .animate-explosion-center {
               animation: explosion-center 0.6s ease-out forwards;
            }
            
            .animate-line-clear {
               animation: line-clear 0.5s ease-out forwards;
            }
            
            .animate-sparkle {
               animation: sparkle 0.5s ease-out forwards;
            }
         `}</style>
      </div>
   );
};