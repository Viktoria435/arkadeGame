import { useRef, useState, useCallback } from "react";
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
   const [score, setScore] = useState(0);
   const [lives, setLives] = useState(3);
   const [gameState, setGameState] = useState<GameState>(GameState.START);

   const ballsRef = useRef<Ball[]>([]);
   const paddleRef = useRef<Paddle | null>(null);
   const blocksRef = useRef<Block[]>([]);
   const powerUpsRef = useRef<PowerUp[]>([]);
   const bulletsRef = useRef<Bullet[]>([]);
   const particlesRef = useRef<Particle[]>([]);
   const keysRef = useRef<{ [key: string]: boolean }>({});
   const powerUpManagerRef = useRef(new PowerUpManager());
   const lastShotTimeRef = useRef<number>(0);

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
      if (now - lastShotTimeRef.current < 300) return; // Ограничение скорострельности

      lastShotTimeRef.current = now;

      // Создаем две пули с обеих сторон платформы
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

      // Управление платформой
      if (keysRef.current["ArrowLeft"] && paddle.x > 0) {
         paddle.x -= paddle.speed;
      }
      if (
         keysRef.current["ArrowRight"] &&
         paddle.x < GAME_CONFIG.CANVAS_WIDTH - paddle.width
      ) {
         paddle.x += paddle.speed;
      }

      // Стрельба
      if (keysRef.current[" "] || keysRef.current["Space"]) {
         shootBullet();
      }

      // Обновление мячей
      ballsRef.current = ballsRef.current.filter((ball) => {
         updateBallPosition(ball);

         // Проверка столкновения с платформой
         if (checkBallPaddleCollision(ball, paddle)) {
            reflectBallFromPaddle(ball, paddle);
         }

         // Проверка на выход за нижнюю границу
         if (isBallOutOfBounds(ball)) {
            return false;
         }

         // Проверка столкновения с блоками
         for (let i = blocksRef.current.length - 1; i >= 0; i--) {
            const block = blocksRef.current[i];
            if (checkBallBlockCollision(ball, block)) {
               reflectBallFromBlock(ball, block);
               block.health--;

               if (block.health <= 0) {
                  setScore((prev) => prev + block.maxHealth * 10);

                  // Создаем эффект разрушения
                  const explosion = createBlockExplosion(
                     block.x,
                     block.y,
                     block.width,
                     block.height,
                     block.color
                  );
                  particlesRef.current.push(...explosion);

                  // Создание бонуса
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

      // Если все мячи потеряны
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

      // Обновление пуль
      bulletsRef.current = bulletsRef.current.filter((bullet) => {
         bullet.y += bullet.dy;

         // Проверка столкновения с блоками
         for (let i = blocksRef.current.length - 1; i >= 0; i--) {
            const block = blocksRef.current[i];
            if (checkBulletBlockCollision(bullet, block)) {
               block.health--;

               if (block.health <= 0) {
                  setScore((prev) => prev + block.maxHealth * 10);

                  // Создаем эффект разрушения
                  const explosion = createBlockExplosion(
                     block.x,
                     block.y,
                     block.width,
                     block.height,
                     block.color
                  );
                  particlesRef.current.push(...explosion);

                  // Создание бонуса
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

               return false; // Удаляем пулю
            }
         }

         // Удаление пули если она вышла за экран
         return bullet.y > 0;
      });

      // Обновление частиц
      particlesRef.current = updateParticles(particlesRef.current);

      // Обновление бонусов
      powerUpsRef.current = powerUpsRef.current.filter((powerUp) => {
         powerUp.y += powerUp.dy;

         // Проверка поймал ли игрок бонус
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

         // Удаление бонуса если он вышел за экран
         return powerUp.y < GAME_CONFIG.CANVAS_HEIGHT;
      });

      // Проверка победы
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
