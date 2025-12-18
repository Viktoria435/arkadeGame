import { Block as BlockType } from "@/types/arkanoid.types";
import { POWER_UP_ICONS } from "@/constants/arkanoid.constants";

// Функция для рисования закругленного прямоугольника
const drawRoundedRect = (
   ctx: CanvasRenderingContext2D,
   x: number,
   y: number,
   width: number,
   height: number,
   radius: number
) => {
   ctx.beginPath();
   ctx.moveTo(x + radius, y);
   ctx.lineTo(x + width - radius, y);
   ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
   ctx.lineTo(x + width, y + height - radius);
   ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
   ctx.lineTo(x + radius, y + height);
   ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
   ctx.lineTo(x, y + radius);
   ctx.quadraticCurveTo(x, y, x + radius, y);
   ctx.closePath();
};

// Функция для рисования трещин
const drawCracks = (
   ctx: CanvasRenderingContext2D,
   x: number,
   y: number,
   width: number,
   height: number,
   health: number,
   maxHealth: number
) => {
   const healthPercent = health / maxHealth;

   ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
   ctx.lineWidth = 1.5;
   ctx.lineCap = "round";

   const centerX = x + width / 2;
   const centerY = y + height / 2;

   if (healthPercent <= 0.66 && healthPercent > 0.33) {
      // Легкие трещины (2 HP из 3)
      ctx.beginPath();
      ctx.moveTo(centerX - 10, centerY - 5);
      ctx.lineTo(centerX + 8, centerY - 3);
      ctx.lineTo(centerX + 15, centerY + 5);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(centerX - 8, centerY + 3);
      ctx.lineTo(centerX + 5, centerY + 2);
      ctx.stroke();
   } else if (healthPercent <= 0.33) {
      // Сильные трещины (1 HP из 3)
      // Трещина 1
      ctx.beginPath();
      ctx.moveTo(centerX - 15, centerY - 8);
      ctx.lineTo(centerX, centerY - 5);
      ctx.lineTo(centerX + 12, centerY - 2);
      ctx.lineTo(centerX + 18, centerY + 6);
      ctx.stroke();

      // Трещина 2
      ctx.beginPath();
      ctx.moveTo(centerX - 12, centerY);
      ctx.lineTo(centerX - 5, centerY + 3);
      ctx.lineTo(centerX + 8, centerY + 5);
      ctx.lineTo(centerX + 15, centerY + 8);
      ctx.stroke();

      // Трещина 3
      ctx.beginPath();
      ctx.moveTo(centerX - 8, centerY + 6);
      ctx.lineTo(centerX - 2, centerY + 2);
      ctx.lineTo(centerX + 5, centerY - 3);
      ctx.stroke();

      // Эффект молнии ⚡
      ctx.font = "bold 14px Arial";
      ctx.fillStyle = "rgba(255, 215, 0, 0.8)";
      ctx.textAlign = "center";
      ctx.save();
      ctx.translate(centerX + width * 0.35, centerY - height * 0.2);
      ctx.rotate(Math.PI / 6);
      ctx.fillText("⚡", 0, 0);
      ctx.restore();
   }
};

export const renderBlocks = (
   blocks: BlockType[],
   ctx: CanvasRenderingContext2D
) => {
   blocks.forEach((block) => {
      const opacity = block.health / block.maxHealth;
      const radius = 6; // Радиус закругления углов

      // Создаем градиент для блока
      const gradient = ctx.createLinearGradient(
         block.x,
         block.y,
         block.x,
         block.y + block.height
      );

      // Цвет блока с учетом здоровья
      const baseColor = block.color;
      gradient.addColorStop(0, baseColor);
      gradient.addColorStop(1, adjustBrightness(baseColor, -20));

      ctx.fillStyle = gradient;
      ctx.globalAlpha = 0.3 + opacity * 0.7;

      // Рисуем закругленный блок
      drawRoundedRect(ctx, block.x, block.y, block.width, block.height, radius);
      ctx.fill();

      // Внутренняя подсветка
      ctx.globalAlpha = 0.3;
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
      drawRoundedRect(
         ctx,
         block.x + 2,
         block.y + 2,
         block.width - 4,
         block.height * 0.4,
         radius - 1
      );
      ctx.fill();

      // Рамка
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.globalAlpha = 1;
      drawRoundedRect(ctx, block.x, block.y, block.width, block.height, radius);
      ctx.stroke();

      // Трещины при низком HP
      if (block.health < block.maxHealth) {
         drawCracks(
            ctx,
            block.x,
            block.y,
            block.width,
            block.height,
            block.health,
            block.maxHealth
         );
      }

      // Индикатор здоровья
      if (block.maxHealth > 1) {
         ctx.fillStyle = "#ffffff";
         ctx.font = "bold 16px Arial";
         ctx.textAlign = "center";
         ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
         ctx.shadowBlur = 3;
         ctx.fillText(
            block.health.toString(),
            block.x + block.width / 2,
            block.y + block.height / 2 + 6
         );
         ctx.shadowBlur = 0;
      }

      // Иконка бонуса
      if (block.hasPowerUp && block.powerUpType) {
         ctx.font = "12px Arial";
         ctx.fillStyle = "#ffffff";
         ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
         ctx.shadowBlur = 2;
         ctx.fillText(
            POWER_UP_ICONS[block.powerUpType],
            block.x + block.width - 10,
            block.y + 12
         );
         ctx.shadowBlur = 0;
      }
   });

   ctx.globalAlpha = 1;
};

// Вспомогательная функция для изменения яркости цвета
const adjustBrightness = (color: string, amount: number): string => {
   const hex = color.replace("#", "");
   const r = Math.max(
      0,
      Math.min(255, parseInt(hex.substr(0, 2), 16) + amount)
   );
   const g = Math.max(
      0,
      Math.min(255, parseInt(hex.substr(2, 2), 16) + amount)
   );
   const b = Math.max(
      0,
      Math.min(255, parseInt(hex.substr(4, 2), 16) + amount)
   );
   return `#${r.toString(16).padStart(2, "0")}${g
      .toString(16)
      .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
};
