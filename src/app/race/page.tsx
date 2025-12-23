"use client";

import React from "react";
import { useGameLoop } from "@/hooks/useGameLoop";
import { Road } from "./(Game)/Road";
import { PlayerCar } from "./(Game)/PlayerCar";
import { ObstacleCar } from "./(Game)/ObstacleCar";
import { CoinComponent } from "./(Game)/CoinComponent";
import { PlayerHUD } from "./(Game)/PlayerHUD";
import { CenterHUD } from "./(Game)/CenterHUD";
import { GAME_CONFIG } from "@/types/race.types";
import { getWinner } from "@/hooks/useRace";

const RacingGame: React.FC = () => {
   const {
      player1,
      player2,
      obstacles1,
      obstacles2,
      coins1,
      coins2,
      gameState,
      player1RoadStart,
      player2RoadStart,
      startGame,
      togglePause,
   } = useGameLoop();

   const showGameOver =
      gameState.isPlaying === false && (player1.score > 0 || player2.score > 0);

   return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center p-4">
         <div className="relative">
            <div
               className="relative bg-green-800 rounded-lg overflow-hidden shadow-2xl"
               style={{
                  width: GAME_CONFIG.CANVAS_WIDTH,
                  height: GAME_CONFIG.CANVAS_HEIGHT,
               }}
            >
               <Road
                  offset={gameState.distance % 60}
                  startX={player1RoadStart}
                  playerColor={player1.color}
               />
               <Road
                  offset={gameState.distance % 60}
                  startX={player2RoadStart}
                  playerColor={player2.color}
               />

               <div
                  className="absolute top-0 bottom-0 w-12 bg-gradient-to-r from-green-900 via-green-700 to-green-900"
                  style={{
                     left: player1RoadStart + GAME_CONFIG.ROAD_WIDTH,
                  }}
               >
                  <div className="h-full flex items-center justify-center">
                     <div className="text-green-600 text-2xl font-bold transform -rotate-90">
                        VS
                     </div>
                  </div>
               </div>

               {gameState.isPlaying && (
                  <>
                     {obstacles1.map((obstacle) => (
                        <ObstacleCar key={obstacle.id} obstacle={obstacle} />
                     ))}

                     {obstacles2.map((obstacle) => (
                        <ObstacleCar key={obstacle.id} obstacle={obstacle} />
                     ))}

                     {coins1.map((coin) => (
                        <CoinComponent key={coin.id} coin={coin} />
                     ))}

                     {coins2.map((coin) => (
                        <CoinComponent key={coin.id} coin={coin} />
                     ))}

                     <PlayerCar car={player1} />
                     <PlayerCar car={player2} />

                     <PlayerHUD
                        player={player1}
                        playerNumber={1}
                        distance={gameState.distance}
                        speed={gameState.speed}
                     />
                     <PlayerHUD
                        player={player2}
                        playerNumber={2}
                        distance={gameState.distance}
                        speed={gameState.speed}
                     />

                     <CenterHUD
                        speed={gameState.speed}
                        distance={gameState.distance}
                     />
                  </>
               )}

               {gameState.isPaused && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-50">
                     <div className="text-center">
                        <div className="text-8xl mb-4">⏸️</div>
                        <h2 className="text-6xl font-bold text-white">ПАУЗА</h2>
                     </div>
                  </div>
               )}

               {!gameState.isPlaying && !showGameOver && (
                  <div className="absolute inset-0 bg-gradient-to-b from-black/90 to-black/70 flex items-center justify-center z-50">
                     <div className="text-center">
                        <div className="text-8xl mb-6">🏎️💨</div>
                        <h2 className="text-5xl font-bold text-white mb-8">
                           Готовы к гонке?
                        </h2>

                        <div className="grid grid-cols-2 gap-8 mb-8">
                           <div className="bg-blue-600/30 p-4 rounded-lg border-2 border-blue-500">
                              <div className="text-3xl mb-2">🏎️</div>
                              <div className="text-white font-bold text-xl mb-2">
                                 ИГРОК 1
                              </div>
                              <div className="text-blue-300 text-sm">
                                 A ← | → D
                              </div>
                           </div>

                           <div className="bg-red-600/30 p-4 rounded-lg border-2 border-red-500">
                              <div className="text-3xl mb-2">🏎️</div>
                              <div className="text-white font-bold text-xl mb-2">
                                 ИГРОК 2
                              </div>
                              <div className="text-red-300 text-sm">
                                 ← ← | → →
                              </div>
                           </div>
                        </div>

                        <button
                           onClick={startGame}
                           className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-12 rounded-lg text-2xl transition-all transform hover:scale-105 shadow-lg"
                        >
                           🚀 СТАРТ
                        </button>
                     </div>
                  </div>
               )}

               {showGameOver && (
                  <div className="absolute inset-0 bg-black/90 flex items-center justify-center z-50">
                     <div className="text-center max-w-lg">
                        <div className="text-6xl mb-4">🏁</div>
                        <h2 className="text-5xl font-bold text-white mb-6">
                           ФИНИШ!
                        </h2>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                           <div
                              className={`p-4 rounded-lg border-2 ${
                                 getWinner(player1, player2) === "player1"
                                    ? "bg-yellow-600/30 border-yellow-400"
                                    : "bg-slate-700/50 border-slate-600"
                              }`}
                           >
                              {getWinner(player1, player2) === "player1" && (
                                 <div className="text-4xl mb-2">🏆</div>
                              )}
                              <div className="text-blue-400 font-bold text-xl mb-2">
                                 ИГРОК 1
                              </div>
                              <div className="text-white text-3xl font-bold mb-1">
                                 {player1.score}
                              </div>
                              <div className="text-slate-300 text-sm">
                                 🪙 {player1.coins} монет
                              </div>
                           </div>

                           <div
                              className={`p-4 rounded-lg border-2 ${
                                 getWinner(player1, player2) === "player2"
                                    ? "bg-yellow-600/30 border-yellow-400"
                                    : "bg-slate-700/50 border-slate-600"
                              }`}
                           >
                              {getWinner(player1, player2) === "player2" && (
                                 <div className="text-4xl mb-2">🏆</div>
                              )}
                              <div className="text-red-400 font-bold text-xl mb-2">
                                 ИГРОК 2
                              </div>
                              <div className="text-white text-3xl font-bold mb-1">
                                 {player2.score}
                              </div>
                              <div className="text-slate-300 text-sm">
                                 🪙 {player2.coins} монет
                              </div>
                           </div>
                        </div>

                        <div className="mb-6">
                           {getWinner(player1, player2) === "draw" ? (
                              <p className="text-2xl font-bold text-yellow-400">
                                 НИЧЬЯ! 🤝
                              </p>
                           ) : (
                              <p className="text-2xl font-bold text-yellow-400">
                                 ПОБЕДИЛ ИГРОК{" "}
                                 {getWinner(player1, player2) === "player1"
                                    ? "1"
                                    : "2"}
                                 !
                              </p>
                           )}
                        </div>

                        <button
                           onClick={startGame}
                           className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-lg text-xl transition-all transform hover:scale-105 shadow-lg"
                        >
                           🔄 Играть снова
                        </button>
                     </div>
                  </div>
               )}
            </div>

            {gameState.isPlaying && (
               <div className="mt-4 flex justify-center gap-4">
                  <button
                     onClick={togglePause}
                     className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-6 rounded-lg transition-all"
                  >
                     {gameState.isPaused ? "▶️ Продолжить" : "⏸️ Пауза"}
                  </button>

                  <button
                     onClick={startGame}
                     className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-all"
                  >
                     🔄 Начать заново
                  </button>
               </div>
            )}
         </div>
      </div>
   );
};

export default RacingGame;
