import { Ball as BallType } from "@/types/arkanoid.types";

export const renderBalls = (
   balls: BallType[],
   ctx: CanvasRenderingContext2D
) => {
   balls.forEach((ball) => {
      const gradient = ctx.createRadialGradient(
         ball.x,
         ball.y,
         0,
         ball.x,
         ball.y,
         ball.radius
      );
      gradient.addColorStop(0, "#fbbf24");
      gradient.addColorStop(1, "#f59e0b");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "#fef3c7";
      ctx.lineWidth = 1;
      ctx.stroke();
   });
};
