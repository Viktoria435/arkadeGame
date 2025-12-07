"use client";

import { useState, useCallback, useRef } from "react";
import type {
   Ball,
   Paddle,
   Brick,
   GameState,
   PowerUp,
   PowerUpType,
   Bullet,
} from "@/types/arkanoid.types";
import {
   CANVAS_WIDTH,
   CANVAS_HEIGHT,
   PADDLE_WIDTH,
   PADDLE_HEIGHT,
   PADDLE_SPEED,
   BALL_RADIUS,
   BALL_SPEED,
   INITIAL_LIVES,
   POWERUP_CONFIGS,
   BULLET_WIDTH,
   BULLET_HEIGHT,
   BULLET_SPEED,
} from "@/constants/arkanoid.constants";
import {
   createBricks,
   checkBallBrickCollision,
   checkBallPaddleCollision,
   checkBulletBrickCollision,
} from "@/utils/arkanoid.utils";

let nextBallId = 0;
let nextPowerUpId = 0;
let nextBulletId = 0;

export const useArkanoid = () => {
   const [paddle, setPaddle] = useState<Paddle>({
      x: CANVAS_WIDTH / 2 - PADDLE_WIDTH / 2,
      y: CANVAS_HEIGHT - 30,
      width: PADDLE_WIDTH,
      height: PADDLE_HEIGHT,
      speed: PADDLE_SPEED,
      hasGun: false,
   });

   const [balls, setBalls] = useState<Ball[]>([
      {
         id: nextBallId++,
         position: { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT - 50 },
         velocity: { x: BALL_SPEED, y: -BALL_SPEED },
         radius: BALL_RADIUS,
      },
   ]);

   const [bricks, setBricks] = useState<Brick[]>(createBricks());
   const [powerUps, setPowerUps] = useState<PowerUp[]>([]);
   const [bullets, setBullets] = useState<Bullet[]>([]);

   const [gameState, setGameState] = useState<GameState>({
      score: 0,
      lives: INITIAL_LIVES,
      level: 1,
      gameOver: false,
      isPaused: false,
      isStarted: false,
   });

   const keysPressed = useRef<{ [key: string]: boolean }>({});
   const gunCooldown = useRef<number>(0);

   const startGame = useCallback(() => {
      setPaddle({
         x: CANVAS_WIDTH / 2 - PADDLE_WIDTH / 2,
         y: CANVAS_HEIGHT - 30,
         width: PADDLE_WIDTH,
         height: PADDLE_HEIGHT,
         speed: PADDLE_SPEED,
         hasGun: false,
      });

      nextBallId = 0;
      setBalls([
         {
            id: nextBallId++,
            position: { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT - 50 },
            velocity: { x: BALL_SPEED, y: -BALL_SPEED },
            radius: BALL_RADIUS,
         },
      ]);

      setBricks(createBricks());
      setPowerUps([]);
      setBullets([]);

      setGameState({
         score: 0,
         lives: INITIAL_LIVES,
         level: 1,
         gameOver: false,
         isPaused: false,
         isStarted: true,
      });
   }, []);

   const togglePause = useCallback(() => {
      if (!gameState.gameOver && gameState.isStarted) {
         setGameState((prev) => ({ ...prev, isPaused: !prev.isPaused }));
      }
   }, [gameState.gameOver, gameState.isStarted]);

   const resetBall = useCallback(() => {
      setBalls([
         {
            id: nextBallId++,
            position: { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT - 50 },
            velocity: {
               x: BALL_SPEED * (Math.random() > 0.5 ? 1 : -1),
               y: -BALL_SPEED,
            },
            radius: BALL_RADIUS,
         },
      ]);
   }, []);

   const spawnPowerUp = useCallback(
      (x: number, y: number, type: PowerUpType) => {
         const config = POWERUP_CONFIGS[type];
         setPowerUps((prev) => [
            ...prev,
            {
               id: nextPowerUpId++,
               x,
               y,
               width: 30,
               height: 30,
               type,
               velocity: 2,
               color: config.color,
               icon: config.icon,
            },
         ]);
      },
      []
   );

   const activatePowerUp = useCallback((type: PowerUpType) => {
      switch (type) {
         case "multiBall":
            setBalls((prev) => {
               const newBalls: Ball[] = [];
               prev.forEach((ball) => {
                  newBalls.push(ball);
                  newBalls.push({
                     id: nextBallId++,
                     position: { ...ball.position },
                     velocity: { x: ball.velocity.x * 1.2, y: ball.velocity.y },
                     radius: BALL_RADIUS,
                  });
                  newBalls.push({
                     id: nextBallId++,
                     position: { ...ball.position },
                     velocity: { x: ball.velocity.x * 0.8, y: ball.velocity.y },
                     radius: BALL_RADIUS,
                  });
               });
               return newBalls;
            });
            break;

         case "gun":
            setPaddle((prev) => ({ ...prev, hasGun: true }));
            setTimeout(() => {
               setPaddle((prev) => ({ ...prev, hasGun: false }));
            }, 10000);
            break;

         case "expandPaddle":
            setPaddle((prev) => ({ ...prev, width: PADDLE_WIDTH * 1.5 }));
            setTimeout(() => {
               setPaddle((prev) => ({ ...prev, width: PADDLE_WIDTH }));
            }, 8000);
            break;

         case "slowBall":
            setBalls((prev) =>
               prev.map((ball) => ({
                  ...ball,
                  velocity: {
                     x: ball.velocity.x * 0.6,
                     y: ball.velocity.y * 0.6,
                  },
               }))
            );
            setTimeout(() => {
               setBalls((prev) =>
                  prev.map((ball) => ({
                     ...ball,
                     velocity: {
                        x: ball.velocity.x / 0.6,
                        y: ball.velocity.y / 0.6,
                     },
                  }))
               );
            }, 7000);
            break;
      }
   }, []);

   const shootBullet = useCallback(() => {
      if (paddle.hasGun && gunCooldown.current <= 0) {
         setBullets((prev) => [
            ...prev,
            {
               id: nextBulletId++,
               x: paddle.x + paddle.width / 2 - BULLET_WIDTH / 2 - 10,
               y: paddle.y,
               width: BULLET_WIDTH,
               height: BULLET_HEIGHT,
               velocity: BULLET_SPEED,
            },
            {
               id: nextBulletId++,
               x: paddle.x + paddle.width / 2 - BULLET_WIDTH / 2 + 10,
               y: paddle.y,
               width: BULLET_WIDTH,
               height: BULLET_HEIGHT,
               velocity: BULLET_SPEED,
            },
         ]);
         gunCooldown.current = 15;
      }
   }, [paddle]);

   const update = useCallback(() => {
      if (gameState.gameOver || gameState.isPaused || !gameState.isStarted)
         return;

      if (gunCooldown.current > 0) gunCooldown.current--;

      if (keysPressed.current[" "] && paddle.hasGun) {
         shootBullet();
      }

      setPaddle((prev) => {
         let newX = prev.x;

         if (keysPressed.current["ArrowLeft"] && prev.x > 0) {
            newX = prev.x - prev.speed;
         }
         if (
            keysPressed.current["ArrowRight"] &&
            prev.x < CANVAS_WIDTH - prev.width
         ) {
            newX = prev.x + prev.speed;
         }

         return { ...prev, x: newX };
      });

      setBullets((prev) => {
         return prev.filter((bullet) => {
            bullet.y -= bullet.velocity;
            return bullet.y > -bullet.height;
         });
      });

      setBullets((prevBullets) => {
         return prevBullets.filter((bullet) => {
            let bulletActive = true;

            setBricks((prevBricks) => {
               return prevBricks.map((brick) => {
                  if (
                     brick.visible &&
                     checkBulletBrickCollision(bullet, brick)
                  ) {
                     brick.hits--;

                     if (brick.hits <= 0) {
                        brick.visible = false;
                        setGameState((prevState) => ({
                           ...prevState,
                           score: prevState.score + brick.points,
                        }));

                        if (brick.hasPowerUp && brick.powerUpType) {
                           spawnPowerUp(
                              brick.x + brick.width / 2,
                              brick.y + brick.height / 2,
                              brick.powerUpType
                           );
                        }
                     }

                     bulletActive = false;
                  }
                  return brick;
               });
            });

            return bulletActive;
         });
      });

      setPowerUps((prev) => {
         return prev.filter((powerUp) => {
            powerUp.y += powerUp.velocity;

            if (
               powerUp.y + powerUp.height > paddle.y &&
               powerUp.x + powerUp.width > paddle.x &&
               powerUp.x < paddle.x + paddle.width
            ) {
               activatePowerUp(powerUp.type);
               return false;
            }

            return powerUp.y < CANVAS_HEIGHT;
         });
      });

      setBalls((prev) => {
         const activeBalls = prev.filter((ball) => {
            let newX = ball.position.x + ball.velocity.x;
            let newY = ball.position.y + ball.velocity.y;
            let newVelX = ball.velocity.x;
            let newVelY = ball.velocity.y;

            if (newX - ball.radius <= 0 || newX + ball.radius >= CANVAS_WIDTH) {
               newVelX = -newVelX;
            }
            if (newY - ball.radius <= 0) {
               newVelY = -newVelY;
            }

            if (newY + ball.radius >= CANVAS_HEIGHT) {
               return false;
            }

            if (
               checkBallPaddleCollision(
                  { ...ball, position: { x: newX, y: newY } },
                  paddle
               )
            ) {
               newVelY = -Math.abs(newVelY);
               const hitPos = (newX - paddle.x) / paddle.width;
               newVelX = (hitPos - 0.5) * BALL_SPEED * 2;
            }

            setBricks((prevBricks) => {
               return prevBricks.map((brick) => {
                  if (!brick.visible) return brick;

                  const collision = checkBallBrickCollision(
                     { ...ball, position: { x: newX, y: newY } },
                     brick
                  );

                  if (!collision.hit) return brick;

                  brick.hits--;

                  if (brick.hits <= 0) {
                     brick.visible = false;

                     setGameState((prev) => ({
                        ...prev,
                        score: prev.score + brick.points,
                     }));

                     if (brick.hasPowerUp && brick.powerUpType) {
                        spawnPowerUp(
                           brick.x + brick.width / 2,
                           brick.y + brick.height / 2,
                           brick.powerUpType
                        );
                     }
                  }

                  switch (collision.side) {
                     case "top":
                        newVelY = -Math.abs(newVelY);
                        newY = brick.y - ball.radius;
                        break;

                     case "bottom":
                        newVelY = Math.abs(newVelY);
                        newY = brick.y + brick.height + ball.radius;
                        break;

                     case "left":
                        newVelX = -Math.abs(newVelX);
                        newX = brick.x - ball.radius;
                        break;

                     case "right":
                        newVelX = Math.abs(newVelX);
                        newX = brick.x + brick.width + ball.radius;
                        break;
                  }

                  return brick;
               });
            });

            ball.position = { x: newX, y: newY };
            ball.velocity = { x: newVelX, y: newVelY };
            return true;
         });

         if (activeBalls.length === 0) {
            setGameState((prevState) => {
               const newLives = prevState.lives - 1;
               if (newLives <= 0) {
                  return { ...prevState, lives: 0, gameOver: true };
               }
               return { ...prevState, lives: newLives };
            });
            resetBall();
            return prev;
         }

         return activeBalls;
      });

      setBricks((prevBricks) => {
         if (prevBricks.every((brick) => !brick.visible)) {
            setGameState((prevState) => ({
               ...prevState,
               level: prevState.level + 1,
               isStarted: false,
            }));

            setTimeout(() => {
               setBricks(createBricks());
               resetBall();
               setPowerUps([]);
               setBullets([]);
               setPaddle((prev) => ({
                  ...prev,
                  width: PADDLE_WIDTH,
                  hasGun: false,
               }));
               setGameState((prevState) => ({ ...prevState, isStarted: true }));
            }, 1000);
         }
         return prevBricks;
      });
   }, [
      gameState,
      paddle,
      resetBall,
      spawnPowerUp,
      activatePowerUp,
      shootBullet,
   ]);

   return {
      paddle,
      balls,
      bricks,
      powerUps,
      bullets,
      gameState,
      startGame,
      togglePause,
      update,
      keysPressed,
   };
};
