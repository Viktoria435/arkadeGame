import React, { useRef, useEffect, useCallback } from "react";
import {
   Block,
   Ball,
   GameState,
   Bullet,
   Paddle,
   PowerUp,
   Particle,
} from "@/types/arkanoid.types";
import { GAME_CONFIG } from "@/constants/arkanoid.constants";
import { renderBalls } from "@/app/arkanoid/(Game)/Ball";
import { renderPaddle } from "@/app/arkanoid/(Game)/Paddle";
import { renderBlocks } from "@/app/arkanoid/(Game)/Block";
import { renderPowerUps } from "@/app/arkanoid/(Game)/PowerUp";
import { renderBullets } from "@/app/arkanoid/(Game)/Bullet";
import { renderEmojiParticles, renderParticles } from "@/app/arkanoid/(Game)/Particle";

interface GameCanvasProps {
   gameState: GameState;
   ballsRef: React.RefObject<Ball[] | null>;
   paddleRef: React.RefObject<Paddle | null>;
   blocksRef: React.RefObject<Block[] | null>;
   powerUpsRef: React.RefObject<PowerUp[] | null>;
   bulletsRef: React.RefObject<Bullet[] | null>;
   particlesRef: React.RefObject<Particle[] | null>;
   updateGame: () => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
   gameState,
   ballsRef,
   paddleRef,
   blocksRef,
   powerUpsRef,
   bulletsRef,
   particlesRef,
   updateGame,
}) => {
   const canvasRef = useRef<HTMLCanvasElement>(null);
   const animationIdRef = useRef<number | null>(null);

   const draw = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.fillStyle = "rgba(228, 217, 243, 0.7)";
      ctx.fillRect(0, 0, GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT);

      renderBlocks(blocksRef.current ?? [], ctx);

      if (paddleRef.current) {
         renderPaddle(
            paddleRef.current ?? {
               x: 0,
               y: 0,
               width: 0,
               height: 0,
               speed: 0,
               canShoot: false,
            },
            ctx
         );
      }

      renderBalls(ballsRef.current ?? [], ctx);
      renderPowerUps(powerUpsRef.current ?? [], ctx);
      renderBullets(bulletsRef.current ?? [], ctx);
      renderParticles(particlesRef.current ?? [], ctx);
      renderEmojiParticles(particlesRef.current ?? [], ctx);
   }, [ballsRef, paddleRef, blocksRef, powerUpsRef, bulletsRef, particlesRef]);

   const gameLoop = useCallback(() => {
      updateGame();
      draw();
      animationIdRef.current = requestAnimationFrame(gameLoop);
   }, [updateGame, draw]);

   useEffect(() => {
      if (gameState === GameState.PLAYING) {
         gameLoop();
      }

      return () => {
         if (animationIdRef.current) {
            cancelAnimationFrame(animationIdRef.current);
         }
      };
   }, [gameState, gameLoop]);

   useEffect(() => {
      draw();
   }, [draw]);

   return (
      <canvas
         ref={canvasRef}
         width={GAME_CONFIG.CANVAS_WIDTH}
         height={GAME_CONFIG.CANVAS_HEIGHT}
         className="border-4 border-slate-700 rounded-lg shadow-2xl"
      />
   );
};
