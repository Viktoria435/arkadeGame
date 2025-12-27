import { useState, useEffect, useCallback, useRef } from "react";
import {
   Car,
   Obstacle,
   Coin,
   GameState,
   GAME_CONFIG,
} from "@/types/race.types";
import {
   checkCollision,
   generateObstacle,
   generateCoin,
   updateCarPosition,
   updateObstacles,
   updateCoins,
   calculateScore,
} from "@/hooks/useRace";
import { useAuth } from "@/context/AuthContext";

export const useGameLoop = () => {
   const { user, updateUser } = useAuth();
   const player1RoadStart = 50;
   const player2RoadStart =
      50 + GAME_CONFIG.ROAD_WIDTH + GAME_CONFIG.ROAD_PADDING;

   const [player1, setPlayer1] = useState<Car>({
      id: "player1",
      x:
         player1RoadStart +
         GAME_CONFIG.ROAD_WIDTH / 2 -
         GAME_CONFIG.CAR_WIDTH / 2,
      y: GAME_CONFIG.CANVAS_HEIGHT - 100,
      width: GAME_CONFIG.CAR_WIDTH,
      height: GAME_CONFIG.CAR_HEIGHT,
      speed: 0,
      color: "#3b82f6",
      isAlive: true,
      score: 0,
      coins: 0,
   });

   const [player2, setPlayer2] = useState<Car>({
      id: "player2",
      x:
         player2RoadStart +
         GAME_CONFIG.ROAD_WIDTH / 2 -
         GAME_CONFIG.CAR_WIDTH / 2,
      y: GAME_CONFIG.CANVAS_HEIGHT - 100,
      width: GAME_CONFIG.CAR_WIDTH,
      height: GAME_CONFIG.CAR_HEIGHT,
      speed: 0,
      color: "#ef4444",
      isAlive: true,
      score: 0,
      coins: 0,
   });

   const [obstacles1, setObstacles1] = useState<Obstacle[]>([]);
   const [obstacles2, setObstacles2] = useState<Obstacle[]>([]);
   const [coins1, setCoins1] = useState<Coin[]>([]);
   const [coins2, setCoins2] = useState<Coin[]>([]);

   const [gameState, setGameState] = useState<GameState>({
      isPlaying: false,
      isPaused: false,
      speed: GAME_CONFIG.INITIAL_SPEED,
      distance: 0,
   });

   const keysPressed = useRef<Set<string>>(new Set());
   const lastObstacleTime = useRef<number>(0);
   const lastCoinTime = useRef<number>(0);
   const animationFrameId = useRef<number>(0);
   const gameStartTime = useRef<Date | null>(null);

   const saveGameResult = useCallback(async (finalScore: number) => {
      if (!user || finalScore === 0) return;
   
      try {
         const duration = gameStartTime.current
            ? Math.floor((new Date().getTime() - gameStartTime.current.getTime()) / 1000)
            : undefined;
   
         const response = await fetch('/api/game/score', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
               game: 'race',
               score: finalScore,
               level: 1,
               duration,
            }),
         });
   
         if (response.ok) {
            const data = await response.json();
            updateUser(data.user);
         }
      } catch (error) {
         console.error('Error saving game result:', error);
      }
   }, [user, gameStartTime.current, updateUser]);

   useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
         keysPressed.current.add(e.key);
      };

      const handleKeyUp = (e: KeyboardEvent) => {
         keysPressed.current.delete(e.key);
      };

      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("keyup", handleKeyUp);

      return () => {
         window.removeEventListener("keydown", handleKeyDown);
         window.removeEventListener("keyup", handleKeyUp);
      };
   }, []);

   const gameLoop = useCallback(() => {
      if (!gameState.isPlaying || gameState.isPaused) {
         return;
      }

      if (!player1.isAlive && !player2.isAlive) {
         setGameState((prev) => ({ ...prev, isPlaying: false }));
         saveGameResult(Math.max(player1.score, player2.score));
         return;
      }

      if (player1.isAlive) {
         let direction1: "left" | "right" | null = null;
         if (keysPressed.current.has("a") || keysPressed.current.has("A"))
            direction1 = "left";
         if (keysPressed.current.has("d") || keysPressed.current.has("D"))
            direction1 = "right";
         setPlayer1((prev) =>
            updateCarPosition(prev, direction1, player1RoadStart)
         );
      }

      if (player2.isAlive) {
         let direction2: "left" | "right" | null = null;
         if (keysPressed.current.has("ArrowLeft")) direction2 = "left";
         if (keysPressed.current.has("ArrowRight")) direction2 = "right";
         setPlayer2((prev) =>
            updateCarPosition(prev, direction2, player2RoadStart)
         );
      }

      const now = Date.now();
      if (now - lastObstacleTime.current > 1200 - gameState.speed * 40) {
         if (player1.isAlive) {
            setObstacles1((prev) => [
               ...prev,
               generateObstacle(gameState.speed, player1RoadStart),
            ]);
         }
         if (player2.isAlive) {
            setObstacles2((prev) => [
               ...prev,
               generateObstacle(gameState.speed, player2RoadStart),
            ]);
         }
         lastObstacleTime.current = now;
      }

      if (now - lastCoinTime.current > 2500) {
         if (player1.isAlive) {
            setCoins1((prev) => [...prev, generateCoin(player1RoadStart)]);
         }
         if (player2.isAlive) {
            setCoins2((prev) => [...prev, generateCoin(player2RoadStart)]);
         }
         lastCoinTime.current = now;
      }

      setObstacles1((prev) => updateObstacles(prev));
      setObstacles2((prev) => updateObstacles(prev));

      setCoins1((prev) => updateCoins(prev, gameState.speed));
      setCoins2((prev) => updateCoins(prev, gameState.speed));

      if (player1.isAlive) {
         for (const obstacle of obstacles1) {
            if (checkCollision(player1, obstacle)) {
               setPlayer1((prev) => ({ ...prev, isAlive: false }));
               break;
            }
         }
      }

      if (player2.isAlive) {
         for (const obstacle of obstacles2) {
            if (checkCollision(player2, obstacle)) {
               setPlayer2((prev) => ({ ...prev, isAlive: false }));
               break;
            }
         }
      }

      if (player1.isAlive) {
         setCoins1((prev) =>
            prev.map((coin) => {
               if (
                  !coin.collected &&
                  checkCollision(player1, {
                     x: coin.x,
                     y: coin.y,
                     width: coin.size,
                     height: coin.size,
                  })
               ) {
                  setPlayer1((prev) => ({
                     ...prev,
                     coins: prev.coins + 1,
                     score: calculateScore(gameState.distance, prev.coins + 1),
                  }));
                  return { ...coin, collected: true };
               }
               return coin;
            })
         );
      }

      if (player2.isAlive) {
         setCoins2((prev) =>
            prev.map((coin) => {
               if (
                  !coin.collected &&
                  checkCollision(player2, {
                     x: coin.x,
                     y: coin.y,
                     width: coin.size,
                     height: coin.size,
                  })
               ) {
                  setPlayer2((prev) => ({
                     ...prev,
                     coins: prev.coins + 1,
                     score: calculateScore(gameState.distance, prev.coins + 1),
                  }));
                  return { ...coin, collected: true };
               }
               return coin;
            })
         );
      }

      setGameState((prev) => {
         const newDistance = prev.distance + prev.speed;
         return {
            ...prev,
            speed: Math.min(
               prev.speed + GAME_CONFIG.SPEED_INCREMENT,
               GAME_CONFIG.MAX_SPEED
            ),
            distance: newDistance,
         };
      });

      if (player1.isAlive) {
         setPlayer1((prev) => ({
            ...prev,
            score: calculateScore(gameState.distance, prev.coins),
         }));
      }

      if (player2.isAlive) {
         setPlayer2((prev) => ({
            ...prev,
            score: calculateScore(gameState.distance, prev.coins),
         }));
      }

      animationFrameId.current = requestAnimationFrame(gameLoop);
   }, [gameState, player1, player2, obstacles1, obstacles2, coins1, coins2]);

   useEffect(() => {
      if (gameState.isPlaying && !gameState.isPaused) {
         animationFrameId.current = requestAnimationFrame(gameLoop);
      }

      return () => {
         if (animationFrameId.current) {
            cancelAnimationFrame(animationFrameId.current);
         }
      };
   }, [gameState.isPlaying, gameState.isPaused, gameLoop]);

   const startGame = useCallback(() => {
      setPlayer1({
         id: "player1",
         x:
            player1RoadStart +
            GAME_CONFIG.ROAD_WIDTH / 2 -
            GAME_CONFIG.CAR_WIDTH / 2,
         y: GAME_CONFIG.CANVAS_HEIGHT - 100,
         width: GAME_CONFIG.CAR_WIDTH,
         height: GAME_CONFIG.CAR_HEIGHT,
         speed: 0,
         color: "#3b82f6",
         isAlive: true,
         score: 0,
         coins: 0,
      });

      setPlayer2({
         id: "player2",
         x:
            player2RoadStart +
            GAME_CONFIG.ROAD_WIDTH / 2 -
            GAME_CONFIG.CAR_WIDTH / 2,
         y: GAME_CONFIG.CANVAS_HEIGHT - 100,
         width: GAME_CONFIG.CAR_WIDTH,
         height: GAME_CONFIG.CAR_HEIGHT,
         speed: 0,
         color: "#ef4444",
         isAlive: true,
         score: 0,
         coins: 0,
      });

      setObstacles1([]);
      setObstacles2([]);
      setCoins1([]);
      setCoins2([]);

      setGameState({
         isPlaying: true,
         isPaused: false,
         speed: GAME_CONFIG.INITIAL_SPEED,
         distance: 0,
      });

      lastObstacleTime.current = Date.now();
      lastCoinTime.current = Date.now();
   }, []);

   const togglePause = useCallback(() => {
      setGameState((prev) => ({ ...prev, isPaused: !prev.isPaused }));
   }, []);

   return {
      player1,
      player2,
      obstacles1,
      obstacles2,
      coins1,
      coins2,
      gameState,
      player1RoadStart,
      player2RoadStart,
      startGame,
      togglePause,
   };
};
