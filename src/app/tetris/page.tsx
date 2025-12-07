"use client";

import React, { useEffect, useRef } from "react";
import { useTetris } from "@/hooks/useTetris";
import { Board } from "@/app/tetris/(Game)/Board";
import { Stats } from "@/app/tetris/(Game)/Stats";
import { NextPiecePreview } from "@/app/tetris/(Game)/NextPiecePreview";
import { Controls } from "@/app/tetris/(Game)/Controls";
import { StartScreen } from "@/app/tetris/(Game)/StartScreen";

export default function TetrisPage() {
   const {
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
   } = useTetris();

   const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

   useEffect(() => {
      if (gameOver || isPaused) {
         if (gameLoopRef.current) {
            clearInterval(gameLoopRef.current);
         }
         return;
      }

      const speed = Math.max(100, 1000 - (level - 1) * 100);
      gameLoopRef.current = setInterval(moveDown, speed);

      return () => {
         if (gameLoopRef.current) {
            clearInterval(gameLoopRef.current);
         }
      };
   }, [gameOver, isPaused, level, moveDown]);

   useEffect(() => {
      const handleKeyPress = (e: KeyboardEvent) => {
         if (gameOver) return;

         switch (e.key) {
            case "ArrowLeft":
               e.preventDefault();
               moveHorizontal(-1);
               break;
            case "ArrowRight":
               e.preventDefault();
               moveHorizontal(1);
               break;
            case "ArrowDown":
               e.preventDefault();
               moveDown();
               break;
            case "ArrowUp":
               e.preventDefault();
               rotate();
               break;
            // case " ":
            //    e.preventDefault();
            //    drop();
            //    break;
            case "P":
               e.preventDefault();
               togglePause();
               break;
         }
      };

      window.addEventListener("keydown", handleKeyPress);
      return () => window.removeEventListener("keydown", handleKeyPress);
   }, [gameOver, moveHorizontal, moveDown, rotate, drop, togglePause]);

   return (
      <div className="flex items-center justify-center min-h-screen w-full bg-gradient-to-br from-cyan-500 to-blue-600 overflow-hidden relative">
         <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
               <div
                  key={i}
                  className="absolute w-2 h-2 bg-white rounded-full opacity-20 animate-pulse"
                  style={{
                     left: `${Math.random() * 100}%`,
                     top: `${Math.random() * 100}%`,
                     animationDelay: `${Math.random() * 3}s`,
                     animationDuration: `${2 + Math.random() * 3}s`,
                  }}
               />
            ))}
         </div>

         {gameOver ? (
            <StartScreen onStart={startGame} score={score} />
         ) : (
            <div className="relative z-10 flex gap-8 items-start">
               <div className="flex flex-col gap-4">
                  <Stats score={score} level={level} lines={lines} />
                  <NextPiecePreview piece={nextPiece} />
               </div>

               <Board
                  board={board}
                  currentPiece={currentPiece}
                  position={position}
               />

               <Controls onPause={togglePause} isPaused={isPaused} />

               {isPaused && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center rounded-2xl">
                     <div className="text-center">
                        <h2 className="text-5xl font-bold text-white mb-4">
                           ПАУЗА
                        </h2>
                        <p className="text-gray-300">
                           Нажмите P или кнопку &quot;Продолжить&quot;
                        </p>
                     </div>
                  </div>
               )}
            </div>
         )}
      </div>
   );
}
