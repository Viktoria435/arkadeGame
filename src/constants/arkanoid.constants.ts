import { GameConfig, PowerUpType } from "@/types/arkanoid.types";

export const GAME_CONFIG: GameConfig = {
   CANVAS_WIDTH: 700,
   CANVAS_HEIGHT: 500,
   PADDLE_NORMAL_WIDTH: 100,
   PADDLE_HEIGHT: 15,
   BALL_RADIUS: 8,
   BALL_SPEED: 5,
   BLOCK_ROWS: 6,
   BLOCK_COLS: 10,
   BLOCK_WIDTH: 65,
   BLOCK_HEIGHT: 25,
   BLOCK_PADDING: 5,
   POWER_UP_CHANCE: 0.3,
};

export const POWER_UP_COLORS: Record<PowerUpType, string> = {
   [PowerUpType.WIDE_PADDLE]: "#22c55e",
   [PowerUpType.SLOW_BALL]: "#3b82f6",
   [PowerUpType.EXTRA_BALL]: "#f59e0b",
   [PowerUpType.FAST_BALL]: "#ef4444",
   [PowerUpType.SMALL_PADDLE]: "#8b5cf6",
   [PowerUpType.SHOOTING]: "#ec4899",
};

export const POWER_UP_ICONS: Record<PowerUpType, string> = {
   [PowerUpType.WIDE_PADDLE]: "⬌",
   [PowerUpType.SLOW_BALL]: "🐌",
   [PowerUpType.EXTRA_BALL]: "⚽",
   [PowerUpType.FAST_BALL]: "⚡",
   [PowerUpType.SMALL_PADDLE]: "⬍",
   [PowerUpType.SHOOTING]: "🔫",
};

export const POWER_UP_NAMES: Record<PowerUpType, string> = {
   [PowerUpType.WIDE_PADDLE]: "Широкая платформа",
   [PowerUpType.SLOW_BALL]: "Медленный мяч",
   [PowerUpType.EXTRA_BALL]: "Дополнительный мяч",
   [PowerUpType.FAST_BALL]: "Быстрый мяч",
   [PowerUpType.SMALL_PADDLE]: "Узкая платформа",
   [PowerUpType.SHOOTING]: "Стрельба",
};

export const BLOCK_COLORS = [
   "#8B008B",
   "#FF69B4",
   "#1E90FF",
   "#7B68EE",
   "#191970",
   "#008000",
];
