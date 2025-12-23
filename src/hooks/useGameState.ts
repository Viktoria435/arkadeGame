import { useState, useCallback, useEffect } from "react";
import { GameState, Position, Tetromino } from "../types/blocks.types";
import { generateTetrominoes, TETROMINO_SHAPES } from "@/constants/tetrominoes";
import {
   createEmptyBoard,
   canPlaceTetromino,
   placeTetromino,
   clearFilledLines,
   hasValidMoves,
   clearBombArea,
   calculateScore,
} from "../utils/blocks.utils";

const STORAGE_KEY = "block-puzzle-high-score";

export const useGameState = () => {
   const [gameState, setGameState] = useState<GameState>(() => ({
      board: createEmptyBoard(),
      score: 0,
      tetrominoes: generateTetrominoes(),
      powerUps: {
         bomb: { type: "bomb", count: 1, maxCount: 1 },
         shuffle: { type: "shuffle", count: 2, maxCount: 2 },
         single: { type: "single", count: 3, maxCount: 3 },
      },
      gameOver: false,
      selectedTetromino: null,
      isPlacingTetromino: false,
      highScore: 0,
   }));

   useEffect(() => {
      const savedHighScore = localStorage.getItem(STORAGE_KEY);
      if (savedHighScore) {
         setGameState((prev) => ({
            ...prev,
            highScore: parseInt(savedHighScore),
         }));
      }
   }, []);

   useEffect(() => {
      if (gameState.score > gameState.highScore) {
         setGameState((prev) => ({ ...prev, highScore: prev.score }));
         localStorage.setItem(STORAGE_KEY, gameState.score.toString());
      }
   }, [gameState.score, gameState.highScore]);

   const selectTetromino = useCallback((id: string | null) => {
      setGameState((prev) => ({
         ...prev,
         selectedTetromino: prev.selectedTetromino === id ? null : id,
      }));
   }, []);

   const placeTetromino_ = useCallback((position: Position) => {
      setGameState((prev) => {
         if (!prev.selectedTetromino) return prev;

         const tetromino = prev.tetrominoes.find(
            (t) => t.id === prev.selectedTetromino
         );
         if (!tetromino) return prev;

         if (!canPlaceTetromino(prev.board, tetromino, position)) {
            return prev;
         }

         let newBoard = placeTetromino(prev.board, tetromino, position);

         const newTetrominoes = prev.tetrominoes.filter(
            (t) => t.id !== prev.selectedTetromino
         );
         const {
            newBoard: clearedBoard,
            linesCleared,
            clearedCells,
         } = clearFilledLines(newBoard);
         newBoard = clearedBoard;

         const points = calculateScore(linesCleared, clearedCells.length);
         const newScore = prev.score + points;

         const finalTetrominoes =
            newTetrominoes.length === 0
               ? generateTetrominoes()
               : newTetrominoes;
         const isGameOver = !hasValidMoves(newBoard, finalTetrominoes);

         return {
            ...prev,
            board: newBoard,
            score: newScore,
            tetrominoes: finalTetrominoes,
            selectedTetromino: null,
            gameOver: isGameOver,
         };
      });
   }, []);

   const useBomb = useCallback((position: Position) => {
      setGameState((prev) => {
         if (prev.powerUps.bomb.count <= 0) return prev;

         const { newBoard, cellsCleared } = clearBombArea(prev.board, position);
         const points = cellsCleared * 5;

         return {
            ...prev,
            board: newBoard,
            score: prev.score + points,
            powerUps: {
               ...prev.powerUps,
               bomb: {
                  ...prev.powerUps.bomb,
                  count: prev.powerUps.bomb.count - 1,
               },
            },
         };
      });
   }, []);

   const shuffleTetrominoes = useCallback(() => {
      setGameState((prev) => {
         if (prev.powerUps.shuffle.count <= 0) return prev;

         return {
            ...prev,
            tetrominoes: generateTetrominoes(),
            powerUps: {
               ...prev.powerUps,
               shuffle: {
                  ...prev.powerUps.shuffle,
                  count: prev.powerUps.shuffle.count - 1,
               },
            },
            selectedTetromino: null,
         };
      });
   }, []);

   const useSingleBlock = useCallback(() => {
      setGameState((prev) => {
         if (prev.powerUps.single.count <= 0) return prev;

         const singleTetromino: Tetromino = {
            id: "single-" + Date.now(),
            shape: TETROMINO_SHAPES.single,
            color: "#ec4899",
         };

         return {
            ...prev,
            tetrominoes: [...prev.tetrominoes, singleTetromino],
            powerUps: {
               ...prev.powerUps,
               single: {
                  ...prev.powerUps.single,
                  count: prev.powerUps.single.count - 1,
               },
            },
         };
      });
   }, []);

   const restartGame = useCallback(() => {
      setGameState((prev) => ({
         board: createEmptyBoard(),
         score: 0,
         tetrominoes: generateTetrominoes(),
         powerUps: {
            bomb: { type: "bomb", count: 1, maxCount: 1 },
            shuffle: { type: "shuffle", count: 2, maxCount: 2 },
            single: { type: "single", count: 3, maxCount: 3 },
         },
         gameOver: false,
         selectedTetromino: null,
         isPlacingTetromino: false,
         highScore: prev.highScore,
      }));
   }, []);

   return {
      gameState,
      selectTetromino,
      placeTetromino: placeTetromino_,
      useBomb,
      shuffleTetrominoes,
      useSingleBlock,
      restartGame,
   };
};
