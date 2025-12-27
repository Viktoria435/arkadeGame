"use client";

import {
   BIRD_IMAGE_URLS,
   BIRD_RADIUS,
   BIRD_X,
   GRAVITY,
   MAX_SPEED,
   PIPE_COLORS,
   PIPE_WIDTH,
   PIPE_GAP,
   JUMP,
   PIPE_SPAWN_DISTANCE,
   INITIAL_SPEED,
} from "@/config/bird.config";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function useFlappyBird() {
   const { user, updateUser } = useAuth();
   const canvasRef = useRef<HTMLCanvasElement | null>(null);
   const requestRef = useRef<number>(0);

   const birdY = useRef(PIPE_SPAWN_DISTANCE);
   const velocity = useRef(0);
   const frame = useRef(0);

   const pipes = useRef<{ x: number; top: number; scored?: boolean }[]>([]);
   const [score, setScore] = useState(0);
   const [level, setLevel] = useState(1);

   const gameStarted = true;
   const [gameOver, setGameOver] = useState(false);
   const [gameStartTime, setGameStartTime] = useState<Date | null>(null);
   const speed = useRef(INITIAL_SPEED);

   const birdImgs = useRef<HTMLImageElement[]>([]);
   const imagesLoadedCount = useRef(0);
   const imageLoaded = useRef(false);

   const backgroundImg = useRef<HTMLImageElement | null>(null);
   const groundImg = useRef<HTMLImageElement | null>(null);
   const backgroundLoaded = useRef(false);
   const groundLoaded = useRef(false);


const saveGameResult = useCallback(async (finalScore: number, finalLevel: number) => {
   if (!user || finalScore === 0) return;

   try {
      const duration = gameStartTime
         ? Math.floor((new Date().getTime() - gameStartTime.getTime()) / 1000)
         : undefined;

      const response = await fetch('/api/game/score', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
         },
         body: JSON.stringify({
            game: 'flappy',
            score: finalScore,
            level: finalLevel,
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
}, [user, gameStartTime, updateUser]);

   const spawnPipe = (canvasWidth: number) => {
      const top = Math.random() * 250 + 30;
      pipes.current.push({ x: canvasWidth, top });
   };

   const createBackgroundImage = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 400;
      canvas.height = 600;
      const ctx = canvas.getContext("2d");

      if (!ctx) return null;

      const skyGradient = ctx.createLinearGradient(0, 0, 0, 300);
      skyGradient.addColorStop(0, "#87CEEB");
      skyGradient.addColorStop(1, "#E0F6FF");

      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, 400, 600);

      ctx.fillStyle = "#FFD700";
      ctx.beginPath();
      ctx.arc(350, 80, 30, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      ctx.beginPath();
      ctx.arc(80, 100, 25, 0, Math.PI * 2);
      ctx.arc(100, 90, 30, 0, Math.PI * 2);
      ctx.arc(130, 100, 25, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(250, 70, 20, 0, Math.PI * 2);
      ctx.arc(270, 65, 25, 0, Math.PI * 2);
      ctx.arc(290, 70, 20, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(180, 120, 15, 0, Math.PI * 2);
      ctx.arc(195, 115, 20, 0, Math.PI * 2);
      ctx.arc(210, 120, 15, 0, Math.PI * 2);
      ctx.fill();

      const treePositions = [50, 120, 200, 280, 350];

      treePositions.forEach((x) => {
         const treeHeight = 80 + Math.random() * 40;
         const trunkWidth = 8 + Math.random() * 6;

         ctx.fillStyle = "#8B4513";
         ctx.fillRect(
            x - trunkWidth / 2,
            600 - treeHeight,
            trunkWidth,
            treeHeight
         );

         ctx.strokeStyle = "#654321";
         ctx.lineWidth = 1;
         for (let line = 0; line < trunkWidth; line += 3) {
            ctx.beginPath();
            ctx.moveTo(x - trunkWidth / 2 + line, 600 - treeHeight);
            ctx.lineTo(x - trunkWidth / 2 + line, 600);
            ctx.stroke();
         }

         const crownY = 600 - treeHeight - 15;
         const crownRadius = 20 + Math.random() * 15;
         ctx.fillStyle = "#228B22";
         ctx.beginPath();
         ctx.ellipse(
            x,
            crownY,
            crownRadius,
            crownRadius * 0.7,
            0,
            0,
            Math.PI * 2
         );
         ctx.fill();

         ctx.fillStyle = "#32CD32";
         ctx.beginPath();
         ctx.ellipse(
            x - crownRadius * 0.3,
            crownY - crownRadius * 0.2,
            crownRadius * 0.6,
            crownRadius * 0.4,
            -0.3,
            0,
            Math.PI * 2
         );
         ctx.fill();

         ctx.beginPath();
         ctx.ellipse(
            x + crownRadius * 0.3,
            crownY - crownRadius * 0.2,
            crownRadius * 0.6,
            crownRadius * 0.4,
            0.3,
            0,
            Math.PI * 2
         );
         ctx.fill();

         ctx.strokeStyle = "#228B22";
         ctx.lineWidth = 2;
         ctx.beginPath();
         ctx.moveTo(x - trunkWidth / 2, 600 - treeHeight * 0.7);
         ctx.lineTo(x - crownRadius * 0.5, crownY + crownRadius * 0.3);
         ctx.moveTo(x + trunkWidth / 2, 600 - treeHeight * 0.6);
         ctx.lineTo(x + crownRadius * 0.4, crownY + crownRadius * 0.4);
         ctx.stroke();
      });

      const img = new Image();
      img.src = canvas.toDataURL();
      return img;
   };

   const createGroundImage = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 400;
      canvas.height = 50;
      const ctx = canvas.getContext("2d");

      if (!ctx) return null;

      const groundGradient = ctx.createLinearGradient(0, 0, 0, 50);
      groundGradient.addColorStop(0, "#8B4513");
      groundGradient.addColorStop(1, "#654321");

      ctx.fillStyle = groundGradient;
      ctx.fillRect(0, 20, 400, 30);

      ctx.fillStyle = "#228B22";
      ctx.fillRect(0, 15, 400, 10);

      ctx.fillStyle = "#32CD32";
      for (let i = 0; i < 400; i += 8) {
         const height = Math.random() * 5 + 3;
         ctx.fillRect(i, 15 - height, 2, height);
      }

      const img = new Image();
      img.src = canvas.toDataURL();
      return img;
   };

   const animate = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      if (backgroundLoaded.current && backgroundImg.current) {
         ctx.drawImage(
            backgroundImg.current,
            0,
            0,
            canvas.width,
            canvas.height
         );
      } else {
         const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
         skyGradient.addColorStop(0, "#87CEEB");
         skyGradient.addColorStop(1, "#E0F6FF");
         ctx.fillStyle = skyGradient;
         ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      velocity.current += GRAVITY;
      birdY.current += velocity.current;

      frame.current++;
      if (frame.current % 100 === 0) {
         speed.current += 0.1;
         if (speed.current > MAX_SPEED) speed.current = MAX_SPEED;
      }

      if (
         pipes.current.length === 0 ||
         pipes.current[pipes.current.length - 1].x < canvas.width - 200
      ) {
         spawnPipe(canvas.width);
      }

      if (imageLoaded.current && birdImgs.current.length === 3) {
         const spriteFrame = Math.floor((frame.current / 6) % 3);
         ctx.drawImage(
            birdImgs.current[spriteFrame],
            BIRD_X - 20,
            birdY.current - BIRD_RADIUS,
            40,
            28
         );
      } else {
         ctx.fillStyle = "#FFD700";
         ctx.beginPath();
         ctx.arc(BIRD_X, birdY.current, BIRD_RADIUS, 0, Math.PI * 2);
         ctx.fill();
         ctx.strokeStyle = "#FF6347";
         ctx.lineWidth = 2;
         ctx.stroke();
      }

      pipes.current.forEach((pipe) => {
         pipe.x -= speed.current;
         ctx.fillStyle = PIPE_COLORS.main;
         ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.top - 20);

         const gradient1 = ctx.createLinearGradient(
            pipe.x,
            0,
            pipe.x + PIPE_WIDTH,
            0
         );
         gradient1.addColorStop(0, PIPE_COLORS.light);
         gradient1.addColorStop(0.5, PIPE_COLORS.main);
         gradient1.addColorStop(1, PIPE_COLORS.dark);
         ctx.fillStyle = gradient1;
         ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.top - 20);

         ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
         ctx.fillRect(pipe.x + 5, 0, 8, pipe.top - 20);

         const capHeight = 25;
         ctx.fillStyle = PIPE_COLORS.cap;
         ctx.fillRect(pipe.x - 5, pipe.top - 25, PIPE_WIDTH + 10, capHeight);

         const capGradient1 = ctx.createLinearGradient(
            pipe.x - 5,
            pipe.top - 25,
            pipe.x - 5,
            pipe.top
         );
         capGradient1.addColorStop(0, PIPE_COLORS.light);
         capGradient1.addColorStop(0.5, PIPE_COLORS.cap);
         capGradient1.addColorStop(1, PIPE_COLORS.dark);
         ctx.fillStyle = capGradient1;
         ctx.fillRect(pipe.x - 5, pipe.top - 25, PIPE_WIDTH + 10, capHeight);

         ctx.strokeStyle = PIPE_COLORS.dark;
         ctx.lineWidth = 2;
         ctx.strokeRect(pipe.x - 5, pipe.top - 25, PIPE_WIDTH + 10, capHeight);

         const bottomPipeTop = pipe.top + PIPE_GAP;

         ctx.fillStyle = PIPE_COLORS.cap;
         ctx.fillRect(pipe.x - 5, bottomPipeTop, PIPE_WIDTH + 10, capHeight);

         const capGradient2 = ctx.createLinearGradient(
            pipe.x - 5,
            bottomPipeTop,
            pipe.x - 5,
            bottomPipeTop + capHeight
         );
         capGradient2.addColorStop(0, PIPE_COLORS.dark);
         capGradient2.addColorStop(0.5, PIPE_COLORS.cap);
         capGradient2.addColorStop(1, PIPE_COLORS.light);
         ctx.fillStyle = capGradient2;
         ctx.fillRect(pipe.x - 5, bottomPipeTop, PIPE_WIDTH + 10, capHeight);

         ctx.strokeStyle = PIPE_COLORS.dark;
         ctx.lineWidth = 2;
         ctx.strokeRect(pipe.x - 5, bottomPipeTop, PIPE_WIDTH + 10, capHeight);

         ctx.fillStyle = PIPE_COLORS.main;
         ctx.fillRect(
            pipe.x,
            bottomPipeTop + capHeight,
            PIPE_WIDTH,
            canvas.height - bottomPipeTop - capHeight
         );

         const gradient2 = ctx.createLinearGradient(
            pipe.x,
            0,
            pipe.x + PIPE_WIDTH,
            0
         );
         gradient2.addColorStop(0, PIPE_COLORS.light);
         gradient2.addColorStop(0.5, PIPE_COLORS.main);
         gradient2.addColorStop(1, PIPE_COLORS.dark);
         ctx.fillStyle = gradient2;
         ctx.fillRect(
            pipe.x,
            bottomPipeTop + capHeight,
            PIPE_WIDTH,
            canvas.height - bottomPipeTop - capHeight
         );

         ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
         ctx.fillRect(
            pipe.x + 5,
            bottomPipeTop + capHeight,
            8,
            canvas.height - bottomPipeTop - capHeight
         );
      });
      pipes.current = pipes.current.filter((p) => p.x + PIPE_WIDTH > 0);

      if (groundLoaded.current && groundImg.current) {
         ctx.drawImage(
            groundImg.current,
            0,
            canvas.height - 50,
            canvas.width,
            50
         );
      } else {
         ctx.fillStyle = "#8B4513";
         ctx.fillRect(0, canvas.height - 50, canvas.width, 50);
         ctx.fillStyle = "#228B22";
         ctx.fillRect(0, canvas.height - 50, canvas.width, 10);
      }

      for (const pipe of pipes.current) {
         const inPipeX =
            BIRD_X + BIRD_RADIUS > pipe.x &&
            BIRD_X - BIRD_RADIUS < pipe.x + PIPE_WIDTH;

         const hitTop = birdY.current - BIRD_RADIUS < pipe.top;
         const hitBottom = birdY.current + BIRD_RADIUS > pipe.top + PIPE_GAP;

         if (inPipeX && (hitTop || hitBottom)) {
            setGameOver(true);
            return;
         }

         if (pipe.x + PIPE_WIDTH < BIRD_X && !pipe.scored) {
            pipe.scored = true;
            setScore((s) => {
               const newScore = s + 1;
               if (newScore % 10 === 0) setLevel((l) => l + 1);
               return newScore;
            });
         }
      }

      if (birdY.current > canvas.height || birdY.current < 0) {
         setGameOver(true);
         return;
      }

      requestRef.current = requestAnimationFrame(animate);
   };

   useEffect(() => {
      imagesLoadedCount.current = 0;
      birdImgs.current = [];

      backgroundImg.current = createBackgroundImage();
      if (backgroundImg.current) {
         backgroundImg.current.onload = () => {
            backgroundLoaded.current = true;
         };
      }

      groundImg.current = createGroundImage();
      if (groundImg.current) {
         groundImg.current.onload = () => {
            groundLoaded.current = true;
         };
      }

      BIRD_IMAGE_URLS.forEach((url: string, i: number) => {
         const img = new Image();
         img.onload = async () => {
            imagesLoadedCount.current++;
            if (imagesLoadedCount.current === BIRD_IMAGE_URLS.length) {
               imageLoaded.current = true;
               setGameStartTime(new Date());
               animate();
            }
         };
         img.src = url;
         birdImgs.current[i] = img;
      });
   }, []);

   useEffect(() => {
      const jump = () => {
         if (!gameOver) {
            velocity.current = JUMP;
         }
      };

      window.addEventListener("mousedown", jump);
      window.addEventListener("keydown", jump);

      return () => {
         window.removeEventListener("mousedown", jump);
         window.removeEventListener("keydown", jump);
      };
   }, [gameOver]);

   useEffect(() => {
      if (gameOver) {
         saveGameResult(score, level);
      }
   }, [gameOver]);

   return {
      canvasRef,
      score,
      level,
      gameOver,
      gameStarted,
   };
}
