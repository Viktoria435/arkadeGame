"use client";

import React, { useState } from "react";
import { useBlocks } from "@/hooks/useBlocks";
import { Board } from "./(Game)/Board";
import { TetrominoPreview } from "./(Game)/TetrominoPreview";
import { PowerUps } from "./(Game)/PowerUps";
import { ScoreBoard } from "./(Game)/ScoreBoard";
import { GameOver } from "./(Game)/GameOver";
import { Position } from "@/types/blocks.types";

const BlockPuzzleGame: React.FC = () => {
   const {
      gameState,
      selectTetromino,
      placeTetromino,
      useBomb,
      shuffleTetrominoes,
      useSingleBlock,
      restartGame,
      isInitialized,
      clearingCells,
   } = useBlocks();

   const [isBombMode, setIsBombMode] = useState(false);

   const handleBombClick = () => {
      if (gameState.powerUps.bomb.count > 0) {
         setIsBombMode(!isBombMode);
      }
   };

   const handleBoardBombClick = (position: Position) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useBomb(position);
      setIsBombMode(false);
   };

   const handleTetrominoSelect = (id: string) => {
      setIsBombMode(false);
      selectTetromino(id);
   };

   const selectedTetrominoObj = gameState.tetrominoes.find(
      (t) => t.id === gameState.selectedTetromino
   );

   if (!isInitialized) {
      return (
         <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-700 to-slate-50 flex items-center justify-center">
            <div className="text-white text-2xl">Загрузка...</div>
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-700 py-8 px-4">
         <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
               <h1 className="text-4xl font-bold text-[#0d883c] mb-2 drop-shadow-lg">
                  🧩 Блоки Головоломка
               </h1>
            </div>

            <div className="mb-8">
               <ScoreBoard
                  score={gameState.score}
               />
            </div>
            <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
               <div className="w-1/3">
                  <PowerUps
                     powerUps={gameState.powerUps}
                     onUseBomb={handleBombClick}
                     onShuffle={shuffleTetrominoes}
                     onUseSingle={useSingleBlock}
                     isBombMode={isBombMode}
                  />
               </div>
               <div className="flex justify-center w-1/3">
                  <Board
                     board={gameState.board}
                     selectedTetromino={selectedTetrominoObj || null}
                     onPlaceTetromino={placeTetromino}
                     onBombClick={handleBoardBombClick}
                     isBombMode={isBombMode}
                     clearingCells={clearingCells}
                  />
               </div>
               <div className="w-1/3 bg-transparent">
                  <div className="flex flex-col  gap-4 flex-wrap justify-center">
                     {gameState.tetrominoes.map((tetromino) => (
                        <TetrominoPreview
                           key={tetromino.id}
                           tetromino={tetromino}
                           isSelected={
                              gameState.selectedTetromino === tetromino.id
                           }
                           onSelect={() => handleTetrominoSelect(tetromino.id)}
                           disabled={gameState.gameOver}
                        />
                     ))}
                  </div>
               </div>
            </div>
            {isBombMode && (
               <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-full shadow-lg animate-pulse">
                  💣 Выберите клетку для взрыва 3×3
               </div>
            )}
            {gameState.gameOver && (
               <GameOver
                  score={gameState.score}
                  onRestart={restartGame}
               />
            )}
         </div>
      </div>
   );
};

export default BlockPuzzleGame;