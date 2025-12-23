import React from 'react';
import { Particle as ParticleType } from '@/types/arkanoid.types';

export const renderParticles = (particles: ParticleType[], ctx: CanvasRenderingContext2D) => {
  particles.forEach(particle => {
    if (particle.color === '💣') return;
    
    const alpha = particle.life / particle.maxLife;
    
    ctx.save();
    ctx.globalAlpha = alpha;

    const gradient = ctx.createRadialGradient(
      particle.x, particle.y, 0,
      particle.x, particle.y, particle.size
    );
    gradient.addColorStop(0, particle.color);
    gradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  });
};

export const createBlockExplosion = (
  x: number,
  y: number,
  width: number,
  height: number,
  color: string
): ParticleType[] => {
  const particles: ParticleType[] = [];
  const particleCount = 20;
  const centerX = x + width / 2;
  const centerY = y + height / 2;
  
  for (let i = 0; i < particleCount; i++) {
    const angle = (Math.PI * 2 * i) / particleCount;
    const speed = 2 + Math.random() * 3;
    
    particles.push({
      x: centerX,
      y: centerY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 30 + Math.random() * 20,
      maxLife: 30 + Math.random() * 20,
      color: color,
      size: 2 + Math.random() * 3
    });
  }

  particles.push({
    x: centerX,
    y: centerY,
    vx: 0,
    vy: -1,
    life: 20,
    maxLife: 20,
    color: '💣',
    size: 0
  });
  
  return particles;
};

export const updateParticles = (particles: ParticleType[]): ParticleType[] => {
  return particles.filter(particle => {
    particle.x += particle.vx;
    particle.y += particle.vy;
    if (particle.color !== '💣') {
      particle.vy += 0.15;
    }
    
    particle.life--;
    
    return particle.life > 0;
  });
};

export const renderEmojiParticles = (particles: ParticleType[], ctx: CanvasRenderingContext2D) => {
  particles.forEach(particle => {
    if (particle.color === '💣') {
      const alpha = particle.life / particle.maxLife;
      const scale = 1 + (1 - alpha) * 0.5;
      
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.font = `${24 * scale}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(particle.color, particle.x, particle.y);
      ctx.restore();
    }
  });
};