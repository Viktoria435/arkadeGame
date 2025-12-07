"use client";

import React from "react";
import useGameLogic from "@/hooks/useGameLogic";
import GameModeSelector from "./GameModeSelector";

export default function FlappyBirdGame() {
   const {
      canvasRef,
      score,
      level,
      gameOver,
      gameMode,
      gameStarted,
      isListening,
      volumeLevel,
      handleStartGame,
   } = useGameLogic();

   return (
      <div className="relative w-full h-screen bg-gradient-to-b from-blue-300 to-blue-500 overflow-hidden">
         {!gameStarted && (
            <GameModeSelector
               onSelectMode={handleStartGame}
               volumeLevel={volumeLevel}
               isListening={isListening}
            />
         )}

         {gameStarted && (
            <>
               <canvas
                  ref={canvasRef}
                  width={400}
                  height={600}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-4 border-yellow-400 rounded-lg shadow-2xl"
               />

               <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
                  <div className="flex gap-6 items-center">
                     <div className="text-center">
                        <div className="text-xs text-gray-600">Счет</div>
                        <div className="text-2xl font-bold text-blue-600">
                           {score}
                        </div>
                     </div>
                     <div className="w-px h-8 bg-gray-300" />
                     <div className="text-center">
                        <div className="text-xs text-gray-600">Уровень</div>
                        <div className="text-2xl font-bold text-purple-600">
                           {level}
                        </div>
                     </div>
                  </div>
               </div>

               <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                  <div className="flex items-center gap-2">
                     <span className="text-xl">
                        {gameMode === "keyboard" ? "⌨️" : "🎤"}
                     </span>
                     <span className="text-sm font-medium text-gray-700">
                        {gameMode === "keyboard" ? "Клавиатура" : "Голос"}
                     </span>
                  </div>
               </div>

               {gameMode === "voice" && isListening && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg w-64">
                     <div className="flex items-center gap-3">
                        <span className="text-lg">🎤</span>
                        <div className="flex-1">
                           <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                              <div
                                 className="bg-gradient-to-r from-purple-400 to-purple-600 h-full transition-all duration-100"
                                 style={{
                                    width: `${Math.min(
                                       (volumeLevel / 120) * 100,
                                       100
                                    )}%`,
                                 }}
                              />
                           </div>
                        </div>
                        <span className="text-xs font-mono text-gray-600 w-8">
                           {Math.round(volumeLevel)}
                        </span>
                     </div>
                  </div>
               )}

               {gameOver && (
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                     <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center">
                        <h2 className="text-4xl font-bold text-red-600 mb-4">
                           Game Over!
                        </h2>
                        <div className="mb-6">
                           <div className="text-gray-600 mb-2">
                              Финальный счет
                           </div>
                           <div className="text-5xl font-bold text-blue-600">
                              {score}
                           </div>
                        </div>
                        <div className="mb-6">
                           <div className="text-gray-600 mb-2">Уровень</div>
                           <div className="text-3xl font-bold text-purple-600">
                              {level}
                           </div>
                        </div>
                        <button
                           onClick={() => window.location.reload()}
                           className="w-full bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transform transition hover:scale-105 active:scale-95"
                        >
                           🔄 Играть снова
                        </button>
                     </div>
                  </div>
               )}
            </>
         )}
      </div>
   );
}