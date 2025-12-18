import { BLOCK_COLORS, GAME_CONFIG } from "@/constants/arkanoid.constants";
import { Ball, Block, Paddle, PowerUpType } from "@/types/arkanoid.types";


export const createInitialPaddle = (): Paddle => ({
   x: GAME_CONFIG.CANVAS_WIDTH / 2 - GAME_CONFIG.PADDLE_NORMAL_WIDTH / 2,
   y: GAME_CONFIG.CANVAS_HEIGHT - 40,
   width: GAME_CONFIG.PADDLE_NORMAL_WIDTH,
   height: GAME_CONFIG.PADDLE_HEIGHT,
   speed: 8,
   canShoot: false,
});

export const createInitialBall = (): Ball => ({
   x: GAME_CONFIG.CANVAS_WIDTH / 2,
   y: GAME_CONFIG.CANVAS_HEIGHT - 60,
   dx: GAME_CONFIG.BALL_SPEED * (Math.random() > 0.5 ? 1 : -1),
   dy: -GAME_CONFIG.BALL_SPEED,
   radius: GAME_CONFIG.BALL_RADIUS,
   speed: GAME_CONFIG.BALL_SPEED,
});

export const createBlocks = (): Block[] => {
   const blocks: Block[] = [];
   const powerUpTypes = Object.values(PowerUpType);

   for (let row = 0; row < GAME_CONFIG.BLOCK_ROWS; row++) {
      for (let col = 0; col < GAME_CONFIG.BLOCK_COLS; col++) {
         const health = Math.min(row + 1, 3);
         const hasPowerUp = Math.random() < GAME_CONFIG.POWER_UP_CHANCE;

         blocks.push({
            x: col * (GAME_CONFIG.BLOCK_WIDTH + GAME_CONFIG.BLOCK_PADDING) + 3,
            y:
               row * (GAME_CONFIG.BLOCK_HEIGHT + GAME_CONFIG.BLOCK_PADDING) +
               5,
            width: GAME_CONFIG.BLOCK_WIDTH,
            height: GAME_CONFIG.BLOCK_HEIGHT,
            health: health,
            maxHealth: health,
            color: BLOCK_COLORS[row],
            hasPowerUp: hasPowerUp,
            powerUpType: hasPowerUp
               ? powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)]
               : undefined,
         });
      }
   }

   return blocks;
};

export const createExtraBall = (mainBall: Ball): Ball => ({
   x: mainBall.x,
   y: mainBall.y,
   dx: -mainBall.dx * 0.8,
   dy: mainBall.dy * 0.8,
   radius: GAME_CONFIG.BALL_RADIUS,
   speed: GAME_CONFIG.BALL_SPEED,
});
