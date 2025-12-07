"use client";

import React, { useRef, useEffect } from "react";
import BoardGrid from "./BoardGrid";
import NextTetrominoes from "./NextTetrominoes";
import { colors } from "@/constants/Colors";
import { tetrominoes } from "@/constants/Tetrominoes";
import { useDragging } from "@/hooks/useDragging";
import { useBoard } from "@/hooks/useBoard";

const CELL_SIZE = 42;

const Board: React.FC = () => {
   const boardRef = useRef<HTMLDivElement>(null);

   const {
      board,
      setBoard,
      nextTetrominoes,
      tetrominoPlaceability,
      actionsRemaining,
      setActionsRemaining,
      checkCanPlaceTetromino,
      checkAndClearLines,
      setNextTetrominoes,
   } = useBoard();

   const {
      draggingTetromino,
      setDraggingTetromino,
      draggingPosition,
      setDraggingPosition,
      isDragging,
      setIsDragging,
      dragOffset,
      setDragOffset,
      initialPosition,
      setInitialPosition,
   } = useDragging();

   const onMouseDown = (
      e: React.MouseEvent<HTMLDivElement>,
      idx: number,
      id: number
   ) => {
      e.preventDefault();
      if (nextTetrominoes[idx] === null || !tetrominoPlaceability[idx]) return;

      setDraggingTetromino({ index: idx, id });
      setIsDragging(true);

      const tetromino = tetrominoes[id];
      const width = tetromino[0].length * CELL_SIZE;
      const height = tetromino.length * CELL_SIZE;

      setDragOffset({ x: width / 2, y: height / 2 });

      if (!boardRef.current) return;
      const boardRect = boardRef.current.getBoundingClientRect();

      const startX = e.clientX - boardRect.left - width / 2;
      const startY = e.clientY - boardRect.top - height / 2;

      setInitialPosition({ x: startX, y: startY });
      setDraggingPosition({ x: startX, y: startY });
   };

   const onDrop = (row: number, col: number) => {
      if (draggingTetromino.index === null || draggingTetromino.id === null)
         return;

      const tetromino = tetrominoes[draggingTetromino.id];
      const color = colors[draggingTetromino.id];

      const dropRow = Math.round((row * CELL_SIZE - dragOffset.y) / CELL_SIZE);
      const dropCol = Math.round((col * CELL_SIZE - dragOffset.x) / CELL_SIZE);

      if (checkCanPlaceTetromino(dropRow, dropCol, tetromino)) {
         const newBoard = board.map((r) => [...r]);
         tetromino.forEach((r, i) =>
            r.forEach((c, j) => {
               if (c === 1) newBoard[dropRow + i][dropCol + j] = color;
            })
         );
         checkAndClearLines(newBoard);

         const newNext = [...nextTetrominoes];
         newNext[draggingTetromino.index] = null;
         setNextTetrominoes(newNext);

         if (newNext.every((t) => t === null))
            setNextTetrominoes(
               Array(3)
                  .fill(0)
                  .map(() => Math.floor(Math.random() * tetrominoes.length))
            );
      } else {
         setDraggingPosition(initialPosition);
      }

      setIsDragging(false);
      setDraggingTetromino({ index: null, id: null });
   };

   useEffect(() => {
      const handleMouseMove = (e: globalThis.MouseEvent) => {
         if (!isDragging || !boardRef.current) return;
         const boardRect = boardRef.current.getBoundingClientRect();
         setDraggingPosition({
            x: e.clientX - boardRect.left - dragOffset.x,
            y: e.clientY - boardRect.top - dragOffset.y,
         });
      };

      const handleMouseUp = (e: globalThis.MouseEvent) => {
         if (!isDragging || !boardRef.current) return;

         const boardRect = boardRef.current.getBoundingClientRect();
         const row = Math.floor((e.clientY - boardRect.top) / CELL_SIZE);
         const col = Math.floor((e.clientX - boardRect.left) / CELL_SIZE);

         onDrop(row, col);
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
         window.removeEventListener("mousemove", handleMouseMove);
         window.removeEventListener("mouseup", handleMouseUp);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [isDragging, dragOffset, draggingTetromino, board, initialPosition]);

   const handleBoardClick = (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = boardRef.current?.getBoundingClientRect();
      if (!rect) return;

      const col = Math.floor((e.clientX - rect.left) / CELL_SIZE);
      const row = Math.floor((e.clientY - rect.top) / CELL_SIZE);

      if (actionsRemaining.singleBlock > 0) {
         const newBoard = board.map((r) => [...r]);
         newBoard[row][col] = "#fff";
         setBoard(newBoard);
         setActionsRemaining((prev) => ({
            ...prev,
            singleBlock: prev.singleBlock - 1,
         }));
      } else if (actionsRemaining.clearCells > 0) {
         const newBoard = board.map((r) => [...r]);
         newBoard[row][col] = null;
         setBoard(newBoard);
         setActionsRemaining((prev) => ({
            ...prev,
            clearCells: prev.clearCells - 1,
         }));
      }
   };

   return (
      <div className="flex flex-col items-center justify-center h-screen relative">
         <div ref={boardRef} className="relative">
            <BoardGrid board={board} onClick={handleBoardClick} />
            {draggingTetromino.id !== null &&
               draggingTetromino.index !== null && (
                  <div
                     className="absolute pointer-events-none"
                     style={{
                        left: draggingPosition.x,
                        top: draggingPosition.y,
                     }}
                  >
                     <NextTetrominoes
                        nextTetrominoes={[draggingTetromino.id]}
                        colors={colors}
                        tetrominoes={tetrominoes}
                        onMouseDown={() => {}}
                     />
                  </div>
               )}
         </div>

         {nextTetrominoes.some((t) => t !== null) && (
            <div className="mt-10">
               <NextTetrominoes
                  nextTetrominoes={nextTetrominoes.map((t, idx) =>
                     draggingTetromino.index === idx ? null : t
                  )}
                  colors={colors}
                  tetrominoes={tetrominoes}
                  onMouseDown={onMouseDown}
               />
            </div>
         )}
      </div>
   );
};

export default Board;