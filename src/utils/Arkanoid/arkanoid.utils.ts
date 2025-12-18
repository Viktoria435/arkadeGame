import { GAME_CONFIG } from "@/constants/arkanoid.constants";
import { Ball, Block, Bullet, Paddle } from "@/types/arkanoid.types";


export const checkBallBlockCollision = (ball: Ball, block: Block): boolean => {
   const closestX = Math.max(block.x, Math.min(ball.x, block.x + block.width));
   const closestY = Math.max(block.y, Math.min(ball.y, block.y + block.height));

   const distanceX = ball.x - closestX;
   const distanceY = ball.y - closestY;

   return distanceX ** 2 + distanceY ** 2 < ball.radius ** 2;
};

export const checkBulletBlockCollision = (
   bullet: Bullet,
   block: Block
): boolean => {
   return (
      bullet.x < block.x + block.width &&
      bullet.x + bullet.width > block.x &&
      bullet.y < block.y + block.height &&
      bullet.y + bullet.height > block.y
   );
};

export const reflectBallFromBlock = (ball: Ball, block: Block): void => {
   const ballCenterX = ball.x;
   const ballCenterY = ball.y;
   const blockCenterX = block.x + block.width / 2;
   const blockCenterY = block.y + block.height / 2;

   const deltaX = ballCenterX - blockCenterX;
   const deltaY = ballCenterY - blockCenterY;

   const halfWidth = block.width / 2;
   const halfHeight = block.height / 2;

   // Определяем с какой стороны произошло столкновение
   if (Math.abs(deltaX / halfWidth) > Math.abs(deltaY / halfHeight)) {
      // Столкновение слева или справа
      ball.dx = -ball.dx;
   } else {
      // Столкновение сверху или снизу
      ball.dy = -ball.dy;
   }

   // Добавляем небольшую вариацию угла для интереса
   const variation = (Math.random() - 0.5) * 0.3;
   ball.dx += variation;

   // Нормализуем скорость
   const magnitude = Math.sqrt(ball.dx ** 2 + ball.dy ** 2);
   ball.dx = (ball.dx / magnitude) * ball.speed;
   ball.dy = (ball.dy / magnitude) * ball.speed;
};

export const reflectBallFromPaddle = (ball: Ball, paddle: Paddle): void => {
   // Вычисляем угол отскока в зависимости от точки удара о платформу
   const hitPos = (ball.x - paddle.x) / paddle.width; // 0 to 1
   const angle = (hitPos - 0.5) * Math.PI * 0.6; // -54° to 54°

   const speed = ball.speed;
   ball.dx = speed * Math.sin(angle);
   ball.dy = -speed * Math.cos(angle);
   ball.y = paddle.y - ball.radius;
};

export const checkBallPaddleCollision = (
   ball: Ball,
   paddle: Paddle
): boolean => {
   return (
      ball.y + ball.radius > paddle.y &&
      ball.y - ball.radius < paddle.y + paddle.height &&
      ball.x > paddle.x &&
      ball.x < paddle.x + paddle.width
   );
};

export const checkPowerUpPaddleCollision = (
   powerUpX: number,
   powerUpY: number,
   powerUpWidth: number,
   powerUpHeight: number,
   paddle: Paddle
): boolean => {
   return (
      powerUpY + powerUpHeight > paddle.y &&
      powerUpY < paddle.y + paddle.height &&
      powerUpX + powerUpWidth > paddle.x &&
      powerUpX < paddle.x + paddle.width
   );
};

export const updateBallPosition = (ball: Ball): void => {
   ball.x += ball.dx;
   ball.y += ball.dy;

   // Отскок от стен
   if (
      ball.x - ball.radius < 0 ||
      ball.x + ball.radius > GAME_CONFIG.CANVAS_WIDTH
   ) {
      ball.dx = -ball.dx;
      ball.x =
         ball.x - ball.radius < 0
            ? ball.radius
            : GAME_CONFIG.CANVAS_WIDTH - ball.radius;
   }
   if (ball.y - ball.radius < 0) {
      ball.dy = -ball.dy;
      ball.y = ball.radius;
   }
};

export const isBallOutOfBounds = (ball: Ball): boolean => {
   return ball.y - ball.radius > GAME_CONFIG.CANVAS_HEIGHT;
};
