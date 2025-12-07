'use client';

import React, { useRef, useEffect } from 'react';
import type { Ball, Paddle, Brick, PowerUp, Bullet } from '@/types/arkanoid.types';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '@/constants/arkanoid.constants';

interface ArkanoidProps {
  paddle: Paddle;
  balls: Ball[];
  bricks: Brick[];
  powerUps: PowerUp[];
  bullets: Bullet[];
}

export const Arkanoid: React.FC<ArkanoidProps> = ({ paddle, balls, bricks, powerUps, bullets }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    bricks.forEach(brick => {
      if (brick.visible) {
        ctx.fillStyle = brick.color;
        ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
        
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.strokeRect(brick.x, brick.y, brick.width, brick.height);
        
        if (brick.hits > 1) {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
          ctx.font = 'bold 16px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(brick.hits.toString(), brick.x + brick.width / 2, brick.y + brick.height / 2);
        }
        
        if (brick.hasPowerUp) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
          ctx.font = 'bold 12px Arial';
          ctx.fillText('⭐', brick.x + brick.width / 2, brick.y + brick.height / 2 + 10);
        }
      }
    });

    powerUps?.forEach(powerUp => {
      ctx.fillStyle = powerUp.color;
      ctx.fillRect(powerUp.x - powerUp.width / 2, powerUp.y - powerUp.height / 2, powerUp.width, powerUp.height);
      
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.strokeRect(powerUp.x - powerUp.width / 2, powerUp.y - powerUp.height / 2, powerUp.width, powerUp.height);
      
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(powerUp.icon, powerUp.x, powerUp.y);
    });

    const gradient = ctx.createLinearGradient(paddle.x, paddle.y, paddle.x, paddle.y + paddle.height);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    ctx.fillStyle = gradient;
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height / 3);
    
    if (paddle.hasGun) {
      ctx.fillStyle = '#FFD700';
      ctx.fillRect(paddle.x + 10, paddle.y - 5, 5, 5);
      ctx.fillRect(paddle.x + paddle.width - 15, paddle.y - 5, 5, 5);
    }

    bullets?.forEach(bullet => {
      ctx.fillStyle = '#FFD700';
      ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
      
      ctx.shadowColor = '#FFD700';
      ctx.shadowBlur = 10;
      ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
      ctx.shadowBlur = 0;
    });

    balls?.forEach(ball => {
      ctx.beginPath();
      ctx.arc(ball.position.x, ball.position.y, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#f093fb';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.closePath();
      
      ctx.beginPath();
      ctx.arc(ball.position.x, ball.position.y, ball.radius + 4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(240, 147, 251, 0.3)';
      ctx.fill();
      ctx.closePath();
    });
  }, [paddle, balls, bricks, powerUps, bullets]);

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      className="border-4 border-purple-400 rounded-2xl shadow-2xl bg-gradient-to-b from-indigo-900 to-purple-900"
    />
  );
};
