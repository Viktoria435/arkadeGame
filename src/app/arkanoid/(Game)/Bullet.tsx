import { Bullet as BulletType } from "@/types/arkanoid.types";

export const renderBullets = (
   bullets: BulletType[],
   ctx: CanvasRenderingContext2D
) => {
   bullets.forEach((bullet) => {
      const gradient = ctx.createLinearGradient(
         bullet.x,
         bullet.y,
         bullet.x,
         bullet.y + bullet.height
      );
      gradient.addColorStop(0, "#fbbf24");
      gradient.addColorStop(1, "#f59e0b");

      ctx.fillStyle = gradient;
      ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
      ctx.fillStyle = "#fef3c7";
      ctx.fillRect(bullet.x + 1, bullet.y, 1, bullet.height / 2);
   });
};
