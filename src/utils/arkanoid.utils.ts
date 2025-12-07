import type { Brick, Ball, Paddle, PowerUpType, Bullet } from '../types/arkanoid.types';
import {
  BRICK_ROWS,
  BRICK_COLS,
  BRICK_WIDTH,
  BRICK_HEIGHT,
  BRICK_PADDING,
  BRICK_OFFSET_TOP,
  BRICK_OFFSET_LEFT,
  BRICK_COLORS,
} from '../constants/arkanoid.constants';

export const createBricks = (): Brick[] => {
  const bricks: Brick[] = [];
  
  for (let row = 0; row < BRICK_ROWS; row++) {
    for (let col = 0; col < BRICK_COLS; col++) {
      const brickConfig = BRICK_COLORS[row % BRICK_COLORS.length];
      const hasPowerUp = Math.random() < 0.2;
      const powerUpTypes: PowerUpType[] = ['multiBall', 'gun', 'expandPaddle', 'slowBall'];
      const powerUpType = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
      
      bricks.push({
        x: col * (BRICK_WIDTH + BRICK_PADDING) + BRICK_OFFSET_LEFT,
        y: row * (BRICK_HEIGHT + BRICK_PADDING) + BRICK_OFFSET_TOP,
        width: BRICK_WIDTH,
        height: BRICK_HEIGHT,
        visible: true,
        color: brickConfig.color,
        points: brickConfig.points,
        hits: brickConfig.hits,
        hasPowerUp,
        powerUpType: hasPowerUp ? powerUpType : undefined
      });
    }
  }
  
  return bricks;
};

export const checkBallBrickCollision = (ball: Ball, brick: Brick): { hit: boolean; side: 'top' | 'bottom' | 'left' | 'right' | null } => {
  if (!brick.visible) return { hit: false, side: null };
  
  const ballLeft = ball.position.x - ball.radius;
  const ballRight = ball.position.x + ball.radius;
  const ballTop = ball.position.y - ball.radius;
  const ballBottom = ball.position.y + ball.radius;
  
  const brickLeft = brick.x;
  const brickRight = brick.x + brick.width;
  const brickTop = brick.y;
  const brickBottom = brick.y + brick.height;
  
  if (ballRight < brickLeft || ballLeft > brickRight || ballBottom < brickTop || ballTop > brickBottom) {
    return { hit: false, side: null };
  }
  
  const overlapLeft = ballRight - brickLeft;
  const overlapRight = brickRight - ballLeft;
  const overlapTop = ballBottom - brickTop;
  const overlapBottom = brickBottom - ballTop;
  
  const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);
  
  let side: 'top' | 'bottom' | 'left' | 'right' = 'top';
  if (minOverlap === overlapLeft) side = 'left';
  else if (minOverlap === overlapRight) side = 'right';
  else if (minOverlap === overlapTop) side = 'top';
  else if (minOverlap === overlapBottom) side = 'bottom';
  
  return { hit: true, side };
};

export const checkBallPaddleCollision = (ball: Ball, paddle: Paddle): boolean => {
  return (
    ball.position.x > paddle.x &&
    ball.position.x < paddle.x + paddle.width &&
    ball.position.y + ball.radius > paddle.y &&
    ball.position.y < paddle.y + paddle.height
  );
};

export const checkBulletBrickCollision = (bullet: Bullet, brick: Brick): boolean => {
  if (!brick.visible) return false;
  
  return (
    bullet.x < brick.x + brick.width &&
    bullet.x + bullet.width > brick.x &&
    bullet.y < brick.y + brick.height &&
    bullet.y + bullet.height > brick.y
  );
};