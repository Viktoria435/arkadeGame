import { PowerUp as PowerUpType } from '@/types/arkanoid.types';
import { POWER_UP_COLORS, POWER_UP_ICONS } from '@/constants/arkanoid.constants';

export const renderPowerUps = (powerUps: PowerUpType[], ctx: CanvasRenderingContext2D) => {
  powerUps.forEach(powerUp => {
    ctx.fillStyle = POWER_UP_COLORS[powerUp.type];
    ctx.fillRect(powerUp.x, powerUp.y, powerUp.width, powerUp.height);
    
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(powerUp.x, powerUp.y, powerUp.width, powerUp.height);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(
      POWER_UP_ICONS[powerUp.type], 
      powerUp.x + powerUp.width / 2, 
      powerUp.y + powerUp.height / 2 + 7
    );
  });
};