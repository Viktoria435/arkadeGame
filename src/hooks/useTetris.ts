"use client";

import { useState, useCallback } from "react";
import type {
   Board,
   Tetromino,
   Position,
} from "@/types/tetris.types";
import {
   BOARD_WIDTH,
   BOARD_HEIGHT,
   POINTS,
} from "@/constants/tetris.constants";
import {
   createEmptyBoard,
   getRandomTetromino,
   rotateTetromino,
} from "@/utils/tetris.utils";

export const useTetris = () => {
   const [board, setBoard] = useState<Board>(createEmptyBoard());
   const [currentPiece, setCurrentPiece] = useState<Tetromino | null>(null);
   const [nextPiece, setNextPiece] = useState<Tetromino>(getRandomTetromino());
   const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
   const [score, setScore] = useState<number>(0);
   const [level, setLevel] = useState<number>(1);
   const [lines, setLines] = useState<number>(0);
   const [gameOver, setGameOver] = useState<boolean>(true);
   const [isPaused, setIsPaused] = useState<boolean>(false);

   const isCollision = useCallback(
      (
         piece: Tetromino | null,
         pos: Position,
         boardState: Board = board
      ): boolean => {
         if (!piece) return false;

         for (let y = 0; y < piece.shape.length; y++) {
            for (let x = 0; x < piece.shape[y].length; x++) {
               if (piece.shape[y][x]) {
                  const newX = pos.x + x;
                  const newY = pos.y + y;

                  if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
                     return true;
                  }

                  if (newY >= 0 && boardState[newY][newX].filled) {
                     return true;
                  }
               }
            }
         }
         return false;
      },
      [board]
   );

   const mergePieceToBoard = useCallback(() => {
      if (!currentPiece) return;

      const newBoard = board.map((row) => row.map((cell) => ({ ...cell })));

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
                  newBoard[boardY][boardX] = {
                     filled: true,
                     color: currentPiece.color,
                     shadow: currentPiece.shadow,
                  };
               }
            }
         }
      }

      let linesCleared = 0;
      const filteredBoard = newBoard.filter((row) => {
         const isComplete = row.every((cell) => cell.filled);
         if (isComplete) linesCleared++;
         return !isComplete;
      });

      while (filteredBoard.length < BOARD_HEIGHT) {
         filteredBoard.unshift(
            Array.from({ length: BOARD_WIDTH }, () => ({
               filled: false,
               color: "",
               shadow: "",
            }))
         );
      }

      setBoard(filteredBoard);

      if (linesCleared > 0) {
         const points =
            POINTS[linesCleared as keyof typeof POINTS] * level || 0;
         setScore((prev) => prev + points);
         setLines((prev) => {
            const newLines = prev + linesCleared;
            setLevel(Math.floor(newLines / 10) + 1);
            return newLines;
         });
      }

      setCurrentPiece(nextPiece);
      setNextPiece(getRandomTetromino());
      setPosition({ x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 });
   }, [currentPiece, position, board, nextPiece, level]);

   const moveDown = useCallback(() => {
      if (!currentPiece || isPaused) return;

      const newPos: Position = { x: position.x, y: position.y + 1 };

      if (isCollision(currentPiece, newPos)) {
         if (position.y <= 0) {
            setGameOver(true);
            return;
         }
         mergePieceToBoard();
      } else {
         setPosition(newPos);
      }
   }, [currentPiece, position, isCollision, mergePieceToBoard, isPaused]);

   const moveHorizontal = useCallback(
      (direction: number) => {
         if (!currentPiece || isPaused) return;

         const newPos: Position = { x: position.x + direction, y: position.y };

         if (!isCollision(currentPiece, newPos)) {
            setPosition(newPos);
         }
      },
      [currentPiece, position, isCollision, isPaused]
   );

   const rotate = useCallback(() => {
      if (!currentPiece || isPaused) return;

      const rotated: Tetromino = {
         ...currentPiece,
         shape: rotateTetromino(currentPiece.shape),
      };

      if (!isCollision(rotated, position)) {
         setCurrentPiece(rotated);
      }
   }, [currentPiece, position, isCollision, isPaused]);

   const drop = useCallback(() => {
      if (!currentPiece || isPaused) return;
    
      setPosition((prevPos) => {
        const newPos = { ...prevPos };
    
        while (!isCollision(currentPiece, { x: newPos.x, y: newPos.y + 1 })) {
          newPos.y++;
        }
    
        return newPos;
      });
    
      // Дать React обновить позицию перед merge
      setTimeout(() => mergePieceToBoard(), 10);
    }, [currentPiece, isCollision, mergePieceToBoard, isPaused]);
    
    
   const startGame = useCallback(() => {
      setBoard(createEmptyBoard());
      setCurrentPiece(getRandomTetromino());
      setNextPiece(getRandomTetromino());
      setPosition({ x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 });
      setScore(0);
      setLevel(1);
      setLines(0);
      setGameOver(false);
      setIsPaused(false);
   }, []);

   const togglePause = useCallback(() => {
      if (!gameOver) {
         setIsPaused((prev) => !prev);
      }
   }, [gameOver]);

   return {
      board,
      currentPiece,
      nextPiece,
      position,
      score,
      level,
      lines,
      gameOver,
      isPaused,
      moveDown,
      moveHorizontal,
      rotate,
      drop,
      startGame,
      togglePause,
   };
};
