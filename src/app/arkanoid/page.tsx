"use client";

import React, { useEffect } from "react";
import { useArkanoid } from "@/hooks/useArkanoid";
import { Arkanoid } from "@/components/Arkanoid";
import { ArkanoidStats } from "@/components/ArkanoidStats";

export default function ArkanoidPage() {
   const {
      paddle,
      bricks,
      gameState,
      startGame,
      togglePause,
      update,
      keysPressed,
      balls,
      powerUps,
      bullets,
   } = useArkanoid();

   useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
         if (e.key === "p" || e.key === "P") {
            e.preventDefault();
            togglePause();
         }
         keysPressed.current[e.key] = true;
      };

      const handleKeyUp = (e: KeyboardEvent) => {
         keysPressed.current[e.key] = false;
      };

      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("keyup", handleKeyUp);

      return () => {
         window.removeEventListener("keydown", handleKeyDown);
         window.removeEventListener("keyup", handleKeyUp);
      };
   }, [togglePause, keysPressed]);

   useEffect(() => {
      const gameLoop = setInterval(update, 1000 / 60);
      return () => clearInterval(gameLoop);
   }, [update]);

   return (
      <div className="min-h-screen w-full bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center p-8">
         <div className="flex gap-8 items-start">
            <div className="relative">
               <Arkanoid paddle={paddle} balls={balls} bricks={bricks} powerUps={powerUps} bullets={bullets} />

               {gameState.gameOver && (
                  <div className="absolute inset-0 bg-black/70 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                     <div className="text-center">
                        <h2 className="text-6xl font-bold text-white mb-4">
                           GAME OVER
                        </h2>
                        <p className="text-3xl text-purple-300 mb-2">
                           Ваш счёт: {gameState.score}
                        </p>
                        <p className="text-xl text-gray-300">
                           Уровень: {gameState.level}
                        </p>
                     </div>
                  </div>
               )}

               {gameState.isPaused &&
                  gameState.isStarted &&
                  !gameState.gameOver && (
                     <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                        <div className="text-center">
                           <h2 className="text-6xl font-bold text-white mb-4">
                              ПАУЗА
                           </h2>
                           <p className="text-xl text-gray-300">
                              Нажмите P для продолжения
                           </p>
                        </div>
                     </div>
                  )}
            </div>

            <ArkanoidStats
               gameState={gameState}
               onStart={startGame}
               onPause={togglePause}
            />
         </div>
      </div>
   );
}
