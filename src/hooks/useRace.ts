import { Car, Obstacle, Coin, GAME_CONFIG } from "../types/race.types";

export const checkCollision = (
   rect1: { x: number; y: number; width: number; height: number },
   rect2: { x: number; y: number; width: number; height: number }
): boolean => {
   return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
   );
};

export const getLaneX = (lane: number, roadStartX: number): number => {
   const laneWidth = GAME_CONFIG.ROAD_WIDTH / GAME_CONFIG.LANE_COUNT;
   return (
      roadStartX +
      lane * laneWidth +
      (laneWidth - GAME_CONFIG.OBSTACLE_WIDTH) / 2
   );
};

export const getRandomLane = (): number => {
   return Math.floor(Math.random() * GAME_CONFIG.LANE_COUNT);
};

export const generateObstacle = (
   speed: number,
   roadStartX: number
): Obstacle => {
   const types: ("car" | "tree" | "cone")[] = ["car", "car", "tree", "cone"];
   const type = types[Math.floor(Math.random() * types.length)];
   const lane = getRandomLane();

   return {
      id: `obstacle-${Date.now()}-${Math.random()}`,
      x: getLaneX(lane, roadStartX),
      y: -GAME_CONFIG.OBSTACLE_HEIGHT,
      width: GAME_CONFIG.OBSTACLE_WIDTH,
      height: GAME_CONFIG.OBSTACLE_HEIGHT,
      speed: speed,
      type,
      lane,
   };
};

export const generateCoin = (roadStartX: number): Coin => {
   const lane = getRandomLane();
   const laneWidth = GAME_CONFIG.ROAD_WIDTH / GAME_CONFIG.LANE_COUNT;
   const x =
      roadStartX + lane * laneWidth + (laneWidth - GAME_CONFIG.COIN_SIZE) / 2;

   return {
      id: `coin-${Date.now()}-${Math.random()}`,
      x,
      y: -GAME_CONFIG.COIN_SIZE,
      size: GAME_CONFIG.COIN_SIZE,
      collected: false,
      lane,
   };
};

export const updateCarPosition = (
   car: Car,
   direction: "left" | "right" | null,
   roadStartX: number
): Car => {
   if (!direction || !car.isAlive) return car;

   const roadEnd = roadStartX + GAME_CONFIG.ROAD_WIDTH - GAME_CONFIG.CAR_WIDTH;
   let newX = car.x;

   if (direction === "left") {
      newX = Math.max(roadStartX, car.x - 10);
   } else if (direction === "right") {
      newX = Math.min(roadEnd, car.x + 10);
   }

   return { ...car, x: newX };
};

export const updateObstacles = (obstacles: Obstacle[]): Obstacle[] => {
   return obstacles
      .map((obstacle) => ({
         ...obstacle,
         y: obstacle.y + obstacle.speed,
      }))
      .filter((obstacle) => obstacle.y < GAME_CONFIG.CANVAS_HEIGHT + 100);
};

export const updateCoins = (coins: Coin[], speed: number): Coin[] => {
   return coins
      .map((coin) => ({
         ...coin,
         y: coin.y + speed,
      }))
      .filter((coin) => coin.y < GAME_CONFIG.CANVAS_HEIGHT && !coin.collected);
};

export const calculateScore = (distance: number, coins: number): number => {
   return Math.floor(distance / 10) + coins * 10;
};

export const getWinner = (
   player1: Car,
   player2: Car
): "player1" | "player2" | "draw" => {
   if (player1.score > player2.score) return "player1";
   if (player2.score > player1.score) return "player2";
   return "draw";
};
