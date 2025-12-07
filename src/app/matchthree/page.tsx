"use client";
import React, { useEffect, useRef, useState } from "react";
import { GameConfig } from "@/config/matchThree.config";
import { useMatch3Logic } from "@/hooks/useMatch3Logic";
import { CanvasRenderer } from "@/components/CanvasRenderer";
import { ControlPanel } from "@/components/ControlPanel";

export default function MatchThree() {
   const canvasRef = useRef<HTMLCanvasElement | null>(null);
   const [isLoaded, setIsLoaded] = useState(false);

   const { grid, score, selected, isProcessing, handleTileClick, restart } =
      useMatch3Logic();

   useEffect(() => {
      CanvasRenderer.preloadImages(() => {
         setIsLoaded(true);
      });
   }, []);

   useEffect(() => {
      if (!isLoaded) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      CanvasRenderer.draw(ctx, grid, selected);
   }, [grid, selected, isLoaded]);

   if (!isLoaded) {
      return (
         <div className="flex items-center justify-center h-screen bg-gray-900 text-white text-2xl font-semibold">
            Loading...
         </div>
      );
   }

   return (
      <div className="flex flex-col items-center p-4">
         <h2 className="text-xl font-semibold mb-2">Match-3</h2>
         <canvas
            ref={canvasRef}
            width={GameConfig.COLS * GameConfig.TILE_SIZE}
            height={GameConfig.ROWS * GameConfig.TILE_SIZE}
            onClick={(e) => handleTileClick(e, canvasRef)}
            style={{ border: "2px solid #fff", cursor: "pointer", background: "#fff" }}
         />
         <ControlPanel
            score={score}
            onRestart={restart}
            disabled={isProcessing}
         />
      </div>
   );
}
