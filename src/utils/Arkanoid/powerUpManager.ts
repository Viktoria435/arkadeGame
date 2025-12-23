import { Ball, Paddle, PowerUpType } from "@/types/arkanoid.types";
import { GAME_CONFIG } from "@/constants/arkanoid.constants";

export class PowerUpManager {
   private timers: { [key: string]: number } = {};

   applyPowerUp(
      type: PowerUpType,
      paddle: Paddle,
      balls: Ball[],
      onExtraBall?: (ball: Ball) => void
   ): void {
      if (this.timers[type]) {
         clearTimeout(this.timers[type]);
      }

      switch (type) {
         case PowerUpType.WIDE_PADDLE:
            paddle.width = GAME_CONFIG.PADDLE_NORMAL_WIDTH * 1.5;
            this.timers[type] = window.setTimeout(() => {
               paddle.width = GAME_CONFIG.PADDLE_NORMAL_WIDTH;
            }, 10000);
            break;

         case PowerUpType.SMALL_PADDLE:
            paddle.width = GAME_CONFIG.PADDLE_NORMAL_WIDTH * 0.6;
            this.timers[type] = window.setTimeout(() => {
               paddle.width = GAME_CONFIG.PADDLE_NORMAL_WIDTH;
            }, 8000);
            break;

         case PowerUpType.SLOW_BALL:
            balls.forEach((ball) => {
               ball.speed = GAME_CONFIG.BALL_SPEED * 0.6;
               const magnitude = Math.sqrt(ball.dx ** 2 + ball.dy ** 2);
               ball.dx = (ball.dx / magnitude) * ball.speed;
               ball.dy = (ball.dy / magnitude) * ball.speed;
            });
            this.timers[type] = window.setTimeout(() => {
               balls.forEach((ball) => {
                  ball.speed = GAME_CONFIG.BALL_SPEED;
                  const magnitude = Math.sqrt(ball.dx ** 2 + ball.dy ** 2);
                  ball.dx = (ball.dx / magnitude) * ball.speed;
                  ball.dy = (ball.dy / magnitude) * ball.speed;
               });
            }, 10000);
            break;

         case PowerUpType.FAST_BALL:
            balls.forEach((ball) => {
               ball.speed = GAME_CONFIG.BALL_SPEED * 1.5;
               const magnitude = Math.sqrt(ball.dx ** 2 + ball.dy ** 2);
               ball.dx = (ball.dx / magnitude) * ball.speed;
               ball.dy = (ball.dy / magnitude) * ball.speed;
            });
            this.timers[type] = window.setTimeout(() => {
               balls.forEach((ball) => {
                  ball.speed = GAME_CONFIG.BALL_SPEED;
                  const magnitude = Math.sqrt(ball.dx ** 2 + ball.dy ** 2);
                  ball.dx = (ball.dx / magnitude) * ball.speed;
                  ball.dy = (ball.dy / magnitude) * ball.speed;
               });
            }, 8000);
            break;

         case PowerUpType.SHOOTING:
            paddle.canShoot = true;
            this.timers[type] = window.setTimeout(() => {
               paddle.canShoot = false;
            }, 15000);
            break;

         case PowerUpType.EXTRA_BALL:
            const mainBall = balls[0];
            if (mainBall && onExtraBall) {
               const newBall: Ball = {
                  x: mainBall.x,
                  y: mainBall.y,
                  dx: -mainBall.dx * 0.8,
                  dy: mainBall.dy * 0.8,
                  radius: GAME_CONFIG.BALL_RADIUS,
                  speed: GAME_CONFIG.BALL_SPEED,
               };
               onExtraBall(newBall);
            }
            break;
      }
   }

   clearAllTimers(): void {
      Object.values(this.timers).forEach((timer) => clearTimeout(timer));
      this.timers = {};
   }
}
