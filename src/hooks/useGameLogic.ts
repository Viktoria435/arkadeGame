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
   SKY_COLOR,
} from "@/config/bird.config";
import { useEffect, useRef, useState } from "react";

type GameMode = "keyboard" | "voice" | null;

export default function useGameLogic() {
   const canvasRef = useRef<HTMLCanvasElement | null>(null);
   const requestRef = useRef<number>(0);

   const birdY = useRef(PIPE_SPAWN_DISTANCE);
   const velocity = useRef(0);
   const frame = useRef(0);

   const pipes = useRef<{ x: number; top: number; scored?: boolean }[]>([]);
   const [score, setScore] = useState(0);
   const [level, setLevel] = useState(1);

   const [gameMode, setGameMode] = useState<GameMode>(null);
   const [gameStarted, setGameStarted] = useState(false);
   const [gameOver, setGameOver] = useState(false);
   const [isListening, setIsListening] = useState(false);
   const [volumeLevel, setVolumeLevel] = useState(0);

   const speed = useRef(INITIAL_SPEED);

   const birdImgs = useRef<HTMLImageElement[]>([]);
   const imagesLoadedCount = useRef(0);
   const imageLoaded = useRef(false);

   const audioContextRef = useRef<AudioContext | null>(null);
   const analyserRef = useRef<AnalyserNode | null>(null);
   const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
   const dataArrayRef = useRef<Uint8Array | null>(null);
   const streamRef = useRef<MediaStream | null>(null);

   const startVoiceControl = async () => {
      try {
         const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
         });
         streamRef.current = stream;

         const audioContext = new AudioContext();
         audioContextRef.current = audioContext;

         const analyser = audioContext.createAnalyser();
         analyser.fftSize = 256;
         analyserRef.current = analyser;

         const microphone = audioContext.createMediaStreamSource(stream);
         microphoneRef.current = microphone;
         microphone.connect(analyser);

         const bufferLength = analyser.frequencyBinCount;
         const dataArray = new Uint8Array(bufferLength);
         dataArrayRef.current = dataArray;

         setIsListening(true);
      } catch (error) {
         console.error("Ошибка доступа к микрофону:", error);
         alert("Не удалось получить доступ к микрофону");
      }
   };

   const stopVoiceControl = async () => {
      if (streamRef.current) {
         streamRef.current.getTracks().forEach((track) => track.stop());
         streamRef.current = null;
      }

      if (audioContextRef.current) {
         try {
            if (audioContextRef.current.state !== "closed") {
               await audioContextRef.current.close();
            }
         } catch (error) {
            console.warn("Ошибка при закрытии AudioContext:", error);
         }
         audioContextRef.current = null;
      }

      setIsListening(false);
   };

   useEffect(() => {
      if (!isListening || !analyserRef.current) return;

      let smoothedVolume = 0;

      const checkVolume = () => {
         if (!analyserRef.current || gameOver) return;

         const analyser = analyserRef.current;
         const dataArray = new Uint8Array(analyser.frequencyBinCount);
         analyser.getByteFrequencyData(dataArray);

         let sum = 0;
         for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
         const normalized = sum / dataArray.length / 255;

         smoothedVolume = smoothedVolume * 0.7 + normalized * 0.3;
         setVolumeLevel(smoothedVolume * 100);

         if (gameMode === "voice" && gameStarted && !gameOver) {
            const threshold = 0.04;
            const baseLift = -4;
            const maxLift = -9;

            if (smoothedVolume > threshold) {
               const t = Math.min(
                  (smoothedVolume - threshold) / (1 - threshold),
                  1
               );
               const liftPower = baseLift + t * (maxLift - baseLift);
               velocity.current = velocity.current * 0.5 + liftPower * 0.5;
            } else {
               if (velocity.current < 0) {
                  velocity.current += GRAVITY * 0.02;
               } else {
                  velocity.current += GRAVITY * 0.05;
               }
            }
         }

         requestAnimationFrame(checkVolume);
      };

      checkVolume();
   }, [isListening, gameMode, gameStarted, gameOver]);

   const resetGame = () => {
      birdY.current = PIPE_SPAWN_DISTANCE;
      velocity.current = 0;
      pipes.current = [];
      setScore(0);
      setLevel(1);
      speed.current = INITIAL_SPEED;
      frame.current = 0;
      setGameOver(false);
   };

   const spawnPipe = (canvasWidth: number) => {
      const top = Math.random() * 250 + 30;
      pipes.current.push({ x: canvasWidth, top });
   };

   const animate = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.fillStyle = SKY_COLOR;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

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
            BIRD_X - 17,
            birdY.current - BIRD_RADIUS,
            34,
            24
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

      for (const pipe of pipes.current) {
         const inPipeX =
            BIRD_X + BIRD_RADIUS > pipe.x &&
            BIRD_X - BIRD_RADIUS < pipe.x + PIPE_WIDTH;

         const hitTop = birdY.current - BIRD_RADIUS < pipe.top;
         const hitBottom = birdY.current + BIRD_RADIUS > pipe.top + PIPE_GAP;

         if (inPipeX && (hitTop || hitBottom)) {
            setGameOver(true);
            if (gameMode === "voice") {
               stopVoiceControl();
            }
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
         if (gameMode === "voice") {
            stopVoiceControl();
         }
         return;
      }

      requestRef.current = requestAnimationFrame(animate);
   };

   useEffect(() => {
      imagesLoadedCount.current = 0;
      birdImgs.current = [];

      BIRD_IMAGE_URLS.forEach((url: string, i: number) => {
         const img = new Image();
         img.onload = async () => {
            imagesLoadedCount.current++;
            if (
               imagesLoadedCount.current === BIRD_IMAGE_URLS.length &&
               gameStarted
            ) {
               imageLoaded.current = true;
               if (gameMode === "voice") {
                  await startVoiceControl();
               }
               animate();
            }
         };
         img.src = url;
         birdImgs.current[i] = img;
      });
   }, [gameStarted, gameMode]);

   useEffect(() => {
      const jump = () => {
         if (!gameOver && gameMode === "keyboard") {
            velocity.current = JUMP;
         }
      };

      if (gameMode === "keyboard") {
         window.addEventListener("mousedown", jump);
         window.addEventListener("keydown", jump);
      }

      return () => {
         if (gameMode === "keyboard") {
            window.removeEventListener("mousedown", jump);
            window.removeEventListener("keydown", jump);
         }
      };
   }, [gameMode, gameOver]);

   const handleStartGame = async (mode: GameMode) => {
      setGameMode(mode);
      setGameStarted(true);
      resetGame();
   };

   return {
      canvasRef,
      score,
      level,
      gameOver,
      gameMode,
      gameStarted,
      isListening,
      volumeLevel,
      handleStartGame,
   };
}
