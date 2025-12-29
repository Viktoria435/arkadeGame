"use client";

import { useEffect } from "react";
import { ScoreBoard } from "./(Game)/ScoreBoard";
import { GameCanvas } from "@/components/ArkanoidGame";
import { GameOverlay } from "./(Game)/GameOverlay";
import { useArkanoid } from "@/hooks/useArkanoid";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useRouter } from "next/navigation";

const ArkanoidGame: React.FC = () => {
   const {
      score,
      lives,
      gameState,
      ballsRef,
      paddleRef,
      blocksRef,
      powerUpsRef,
      bulletsRef,
      particlesRef,
      updateGame,
      handleKeyDown,
      handleKeyUp,
      startGame,
      restartGame,
      initGame,
   } = useArkanoid();

   const router = useRouter();
   useEffect(() => {
      const onKeyDown = (e: KeyboardEvent) => {
         if (
            e.key === "ArrowLeft" ||
            e.key === "ArrowRight" ||
            e.key === " " ||
            e.key === "p" ||
            e.key === "P"
         ) {
            e.preventDefault();
            handleKeyDown(e.key);
         }
      };

      const onKeyUp = (e: KeyboardEvent) => {
         if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === " ") {
            handleKeyUp(e.key);
         }
      };

      window.addEventListener("keydown", onKeyDown);
      window.addEventListener("keyup", onKeyUp);

      return () => {
         window.removeEventListener("keydown", onKeyDown);
         window.removeEventListener("keyup", onKeyUp);
      };
   }, [handleKeyDown, handleKeyUp]);
   useEffect(() => {
      initGame();
   }, [initGame]);

   return (
      <ProtectedRoute>
         <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-8">
         <div className="flex flex-col items-center gap-6">
            <div className="text-center">
               <ScoreBoard score={score} lives={lives} />
            </div>

            <div className="relative">
               <GameCanvas
                  gameState={gameState}
                  ballsRef={ballsRef}
                  paddleRef={paddleRef}
                  blocksRef={blocksRef}
                  powerUpsRef={powerUpsRef}
                  bulletsRef={bulletsRef}
                  particlesRef={particlesRef}
                  updateGame={updateGame}
               />

               <GameOverlay
                  gameState={gameState}
                  score={score}
                  onStart={startGame}
                  onRestart={restartGame}
               />
            </div>
         </div>
         <button onClick={() => router.push(`/`)} className="absolute bottom-10 right-10 px-6 py-3 bg-purple-500 rounded-xl font-semibold transition-all duration-300 hover:scale-105">🏠</button>
         </div>
      </ProtectedRoute>
   );
};

export default ArkanoidGame;
