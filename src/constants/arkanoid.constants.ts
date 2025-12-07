export const CANVAS_WIDTH = 600;
export const CANVAS_HEIGHT = 400;

export const PADDLE_WIDTH = 100;
export const PADDLE_HEIGHT = 15;
export const PADDLE_SPEED = 8;

export const BALL_RADIUS = 8;
export const BALL_SPEED = 5;

export const BRICK_WIDTH = 55;
export const BRICK_HEIGHT = 25;
export const BRICK_PADDING = 4;
export const BRICK_OFFSET_TOP = 10;
export const BRICK_OFFSET_LEFT = 7;

export const BRICK_ROWS = 6;
export const BRICK_COLS = 10;

export const BRICK_COLORS = [
  { color: '#FF6B6B', points: 70, hits: 2 },
  { color: '#4ECDC4', points: 60, hits: 2 },
  { color: '#FFE66D', points: 50, hits: 1 },
  { color: '#95E1D3', points: 40, hits: 1 },
  { color: '#A8E6CF', points: 30, hits: 1 },
  { color: '#DCEDC8', points: 20, hits: 1 },
];

export const INITIAL_LIVES = 3;

export const POWERUP_CONFIGS = {
  multiBall: { color: '#FF6B6B', icon: '⚫⚫', chance: 0.03 },
  gun: { color: '#4ECDC4', icon: '🔫', chance: 0.05 },
  expandPaddle: { color: '#FFE66D', icon: '↔️', chance: 0.1 },
  slowBall: { color: '#95E1D3', icon: '🐌', chance: 0.07 },
};

export const BULLET_WIDTH = 4;
export const BULLET_HEIGHT = 10;
export const BULLET_SPEED = 8;