export interface Car {
   id: "player1" | "player2";
   x: number;
   y: number;
   width: number;
   height: number;
   speed: number;
   color: string;
   isAlive: boolean;
   score: number;
   coins: number;
}

export interface Obstacle {
   id: string;
   x: number;
   y: number;
   width: number;
   height: number;
   speed: number;
   type: "car" | "tree" | "cone";
   lane: number;
}

export interface Coin {
   id: string;
   x: number;
   y: number;
   size: number;
   collected: boolean;
   lane: number;
}

export interface GameState {
   isPlaying: boolean;
   isPaused: boolean;
   speed: number;
   distance: number;
}

export const GAME_CONFIG = {
   CANVAS_WIDTH: 800,
   CANVAS_HEIGHT: 600,
   ROAD_WIDTH: 300,
   ROAD_PADDING: 50,
   LANE_COUNT: 3,
   CAR_WIDTH: 55,
   CAR_HEIGHT: 70,
   OBSTACLE_WIDTH: 40,
   OBSTACLE_HEIGHT: 60,
   INITIAL_SPEED: 5,
   MAX_SPEED: 12,
   SPEED_INCREMENT: 0.008,
   COIN_SIZE: 20,
};
