export interface Ball {
   x: number;
   y: number;
   dx: number;
   dy: number;
   radius: number;
   speed: number;
}

export interface Paddle {
   x: number;
   y: number;
   width: number;
   height: number;
   speed: number;
   canShoot: boolean;
}

export interface Block {
   x: number;
   y: number;
   width: number;
   height: number;
   health: number;
   maxHealth: number;
   color: string;
   hasPowerUp?: boolean;
   powerUpType?: PowerUpType;
}

export interface PowerUp {
   x: number;
   y: number;
   width: number;
   height: number;
   type: PowerUpType;
   dy: number;
}

export interface Bullet {
   x: number;
   y: number;
   width: number;
   height: number;
   dy: number;
}

export interface Particle {
   x: number;
   y: number;
   vx: number;
   vy: number;
   life: number;
   maxLife: number;
   color: string;
   size: number;
}

export enum PowerUpType {
   WIDE_PADDLE = "wide",
   SLOW_BALL = "slow",
   EXTRA_BALL = "extra",
   FAST_BALL = "fast",
   SMALL_PADDLE = "small",
   SHOOTING = "shooting",
}

export enum GameState {
   START = "start",
   PLAYING = "playing",
   PAUSED = "paused",
   GAME_OVER = "gameOver",
   WON = "won",
}

export interface GameConfig {
   CANVAS_WIDTH: number;
   CANVAS_HEIGHT: number;
   PADDLE_NORMAL_WIDTH: number;
   PADDLE_HEIGHT: number;
   BALL_RADIUS: number;
   BALL_SPEED: number;
   BLOCK_ROWS: number;
   BLOCK_COLS: number;
   BLOCK_WIDTH: number;
   BLOCK_HEIGHT: number;
   BLOCK_PADDING: number;
   POWER_UP_CHANCE: number;
}
