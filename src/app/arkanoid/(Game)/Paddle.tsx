import { Paddle as PaddleType } from "@/types/arkanoid.types";

export const renderPaddle = (
   paddle: PaddleType,
   ctx: CanvasRenderingContext2D
) => {
   const gradient = ctx.createLinearGradient(
      paddle.x,
      paddle.y,
      paddle.x,
      paddle.y + paddle.height
   );

   // Если платформа может стрелять, делаем её красной
   if (paddle.canShoot) {
      gradient.addColorStop(0, "#f87171");
      gradient.addColorStop(1, "#ef4444");
   } else {
      gradient.addColorStop(0, "#60a5fa");
      gradient.addColorStop(1, "#3b82f6");
   }

   ctx.fillStyle = gradient;
   ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

   ctx.strokeStyle = paddle.canShoot ? "#fca5a5" : "#93c5fd";
   ctx.lineWidth = 2;
   ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);

   // Если может стрелять, добавляем индикаторы пушек
   if (paddle.canShoot) {
      ctx.fillStyle = "#fef3c7";

      // Левая пушка
      ctx.fillRect(paddle.x + paddle.width * 0.25 - 3, paddle.y - 5, 6, 5);

      // Правая пушка
      ctx.fillRect(paddle.x + paddle.width * 0.75 - 3, paddle.y - 5, 6, 5);
   }
};
