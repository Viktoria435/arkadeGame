"use client";
import { useState } from "react";
import { GameConfig } from "@/config/matchThree.config";
import { GridUtils } from "@/utils/gridUtils";

export function useMatch3Logic() {
   const [grid, setGrid] = useState(() => GridUtils.initGrid());
   const [selected, setSelected] = useState<{ r: number; c: number } | null>(
      null
   );
   const [score, setScore] = useState(0);
   const [isProcessing, setIsProcessing] = useState(false);

   function handleTileClick(
      e: React.MouseEvent,
      canvasRef: React.RefObject<HTMLCanvasElement | null>
   ) {
      if (isProcessing || !canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const c = Math.floor(x / GameConfig.TILE_SIZE);
      const r = Math.floor(y / GameConfig.TILE_SIZE);

      if (r < 0 || r >= GameConfig.ROWS || c < 0 || c >= GameConfig.COLS)
         return;
      const pos = { r, c };

      if (!selected) return setSelected(pos);
      if (selected.r === r && selected.c === c) return setSelected(null);
      if (!GridUtils.areAdjacent(selected, pos)) return setSelected(pos);

      GridUtils.swapAndProcess({
         a: selected,
         b: pos,
         grid,
         setGrid,
         setScore,
         setIsProcessing,
      });
      setSelected(null);
   }

   function restart() {
      if (isProcessing) return;
      setGrid(GridUtils.initGrid());
      setScore(0);
      setSelected(null);
   }

   return { grid, score, selected, isProcessing, handleTileClick, restart };
}
