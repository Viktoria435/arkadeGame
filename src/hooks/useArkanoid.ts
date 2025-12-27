import { useRef, useState, useCallback, useEffect } from "react";
import {
   Ball,
   Block,
   Paddle,
   PowerUp,
   Bullet,
   Particle,
   GameState,
   PowerUpType,
} from "@/types/arkanoid.types";
import { GAME_CONFIG } from "@/constants/arkanoid.constants";
import { PowerUpManager } from "@/utils/Arkanoid/powerUpManager";
import { useAuth } from "@/context/AuthContext";

import {
   createInitialPaddle,
   createInitialBall,
   createBlocks,
} from "@/utils/Arkanoid/gameInit";
import {
   createBlockExplosion,
   updateParticles,
} from "@/app/arkanoid/(Game)/Particle";
import {
   checkBallBlockCollision,
   checkBulletBlockCollision,
   reflectBallFromBlock,
   reflectBallFromPaddle,
   checkBallPaddleCollision,
   checkPowerUpPaddleCollision,
   updateBallPosition,
   isBallOutOfBounds,
} from "@/utils/Arkanoid/arkanoid.utils";

export const useArkanoid = () => {
   const { user, updateUser } = useAuth();
   const [score, setScore] = useState(0);
   const [lives, setLives] = useState(3);
   const [gameState, setGameState] = useState<GameState>(GameState.START);
   const [gameStartTime, setGameStartTime] = useState<Date | null>(null);

   const ballsRef = useRef<Ball[]>([]);
   const paddleRef = useRef<Paddle | null>(null);
   const blocksRef = useRef<Block[]>([]);
   const powerUpsRef = useRef<PowerUp[]>([]);
   const bulletsRef = useRef<Bullet[]>([]);
   const particlesRef = useRef<Particle[]>([]);
   const keysRef = useRef<{ [key: string]: boolean }>({});
   const powerUpManagerRef = useRef(new PowerUpManager());
   const lastShotTimeRef = useRef<number>(0);

   const saveGameResult = useCallback(async (finalScore: number) => {
      if (!user || finalScore === 0) return;

      try {
         const duration = gameStartTime
            ? Math.floor((new Date().getTime() - gameStartTime.getTime()) / 1000)
            : undefined;

         const response = await fetch('/api/game/score', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
               game: 'arkanoid',
               score: finalScore,
               level: 1, 
               duration,
            }),
         });

         if (response.ok) {
            const data = await response.json();
            updateUser(data.user);
         }
      } catch (error) {
         console.error('Error saving game result:', error);
      }
   }, [user, gameStartTime, updateUser]);

   useEffect(() => {
      if (gameState === GameState.GAME_OVER) {
         saveGameResult(score);
      }
   }, [gameState]);

   const initGame = useCallback(() => {
      paddleRef.current = createInitialPaddle();
      ballsRef.current = [createInitialBall()];
      blocksRef.current = createBlocks();
      powerUpsRef.current = [];
      bulletsRef.current = [];
      particlesRef.current = [];
      powerUpManagerRef.current.clearAllTimers();
      lastShotTimeRef.current = 0;
   }, []);

   const applyPowerUp = useCallback((type: PowerUpType) => {
      const paddle = paddleRef.current;
      if (!paddle) return;

      powerUpManagerRef.current.applyPowerUp(
         type,
         paddle,
         ballsRef.current,
         (newBall) => {
            ballsRef.current.push(newBall);
         }
      );
   }, []);

   const shootBullet = useCallback(() => {
      const paddle = paddleRef.current;
      if (!paddle || !paddle.canShoot) return;

      const now = Date.now();
      if (now - lastShotTimeRef.current < 300) return;

      lastShotTimeRef.current = now;
      bulletsRef.current.push(
         {
            x: paddle.x + paddle.width * 0.25 - 2,
            y: paddle.y - 10,
            width: 4,
            height: 10,
            dy: -8,
         },
         {
            x: paddle.x + paddle.width * 0.75 - 2,
            y: paddle.y - 10,
            width: 4,
            height: 10,
            dy: -8,
         }
      );
   }, []);

   const updateGame = useCallback(() => {
      if (gameState !== GameState.PLAYING) return;

      const paddle = paddleRef.current;
      if (!paddle) return;

      if (keysRef.current["ArrowLeft"] && paddle.x > 0) {
         paddle.x -= paddle.speed;
      }
      if (
         keysRef.current["ArrowRight"] &&
         paddle.x < GAME_CONFIG.CANVAS_WIDTH - paddle.width
      ) {
         paddle.x += paddle.speed;
      }

      if (keysRef.current[" "] || keysRef.current["Space"]) {
         shootBullet();
      }

      ballsRef.current = ballsRef.current.filter((ball) => {
         updateBallPosition(ball);

         if (checkBallPaddleCollision(ball, paddle)) {
            reflectBallFromPaddle(ball, paddle);
         }

         if (isBallOutOfBounds(ball)) {
            return false;
         }

         for (let i = blocksRef.current.length - 1; i >= 0; i--) {
            const block = blocksRef.current[i];
            if (checkBallBlockCollision(ball, block)) {
               reflectBallFromBlock(ball, block);
               block.health--;

               if (block.health <= 0) {
                  setScore((prev) => prev + block.maxHealth * 10);

                  const explosion = createBlockExplosion(
                     block.x,
                     block.y,
                     block.width,
                     block.height,
                     block.color
                  );
                  particlesRef.current.push(...explosion);

                  if (block.hasPowerUp && block.powerUpType) {
                     powerUpsRef.current.push({
                        x: block.x + block.width / 2 - 15,
                        y: block.y,
                        width: 30,
                        height: 30,
                        type: block.powerUpType,
                        dy: 2,
                     });
                  }

                  blocksRef.current.splice(i, 1);
               }
               break;
            }
         }

         return true;
      });

      if (ballsRef.current.length === 0) {
         setLives((prev) => {
            const newLives = prev - 1;
            if (newLives <= 0) {
               setGameState(GameState.GAME_OVER);
            } else {
               ballsRef.current = [createInitialBall()];
            }
            return newLives;
         });
      }

      bulletsRef.current = bulletsRef.current.filter((bullet) => {
         bullet.y += bullet.dy;
         for (let i = blocksRef.current.length - 1; i >= 0; i--) {
            const block = blocksRef.current[i];
            if (checkBulletBlockCollision(bullet, block)) {
               block.health--;

               if (block.health <= 0) {
                  setScore((prev) => prev + block.maxHealth * 10);

                  const explosion = createBlockExplosion(
                     block.x,
                     block.y,
                     block.width,
                     block.height,
                     block.color
                  );
                  particlesRef.current.push(...explosion);

                  if (block.hasPowerUp && block.powerUpType) {
                     powerUpsRef.current.push({
                        x: block.x + block.width / 2 - 15,
                        y: block.y,
                        width: 30,
                        height: 30,
                        type: block.powerUpType,
                        dy: 2,
                     });
                  }

                  blocksRef.current.splice(i, 1);
               }

               return false;
            }
         }

         return bullet.y > 0;
      });

      particlesRef.current = updateParticles(particlesRef.current);

      powerUpsRef.current = powerUpsRef.current.filter((powerUp) => {
         powerUp.y += powerUp.dy;
         if (
            checkPowerUpPaddleCollision(
               powerUp.x,
               powerUp.y,
               powerUp.width,
               powerUp.height,
               paddle
            )
         ) {
            applyPowerUp(powerUp.type);
            return false;
         }

         return powerUp.y < GAME_CONFIG.CANVAS_HEIGHT;
      });

      if (blocksRef.current.length === 0) {
         setGameState(GameState.WON);
      }
   }, [gameState, applyPowerUp, shootBullet]);

   const handleKeyDown = useCallback(
      (key: string) => {
         keysRef.current[key] = true;

         if (key === " " && gameState === GameState.START) {
            setGameState(GameState.PLAYING);
         }
         if (key === "p" || key === "P") {
            setGameState((prev) =>
               prev === GameState.PLAYING
                  ? GameState.PAUSED
                  : prev === GameState.PAUSED
                  ? GameState.PLAYING
                  : prev
            );
         }
      },
      [gameState]
   );

   const handleKeyUp = useCallback((key: string) => {
      keysRef.current[key] = false;
   }, []);

   const startGame = useCallback(() => {
      initGame();
      setScore(0);
      setLives(3);
      setGameState(GameState.PLAYING);
      setGameStartTime(new Date());
   }, [initGame]);

   const restartGame = useCallback(() => {
      initGame();
      setScore(0);
      setLives(3);
      setGameState(GameState.PLAYING);
   }, [initGame]);

   return {
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
   };
};
