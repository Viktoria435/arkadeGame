import { GameConfig } from "@/config/matchThree.config";

const imageCache: HTMLImageElement[] = [];
let imagesLoaded = false;

export const CanvasRenderer = {
   draw(
      ctx: CanvasRenderingContext2D,
      grid: (number | null)[][],
      sel: { r: number; c: number } | null
   ) {
      ctx.clearRect(
         0,
         0,
         GameConfig.COLS * GameConfig.TILE_SIZE,
         GameConfig.ROWS * GameConfig.TILE_SIZE
      );

      for (let r = 0; r < GameConfig.ROWS; r++) {
         for (let c = 0; c < GameConfig.COLS; c++) {
            const val = grid[r][c];
            const x = c * GameConfig.TILE_SIZE;
            const y = r * GameConfig.TILE_SIZE;

            const img = val !== null ? imageCache[val] : null;

            if (
               img &&
               img.complete &&
               img.naturalWidth > 0 &&
               imagesLoaded
            ) {
               ctx.drawImage(
                  img,
                  x,
                  y,
                  GameConfig.TILE_SIZE - 2,
                  GameConfig.TILE_SIZE - 2
               );
            } else {
               ctx.fillStyle = val !== null ? GameConfig.COLORS[val] : "#111";
               ctx.fillRect(
                  x,
                  y,
                  GameConfig.TILE_SIZE - 2,
                  GameConfig.TILE_SIZE - 2
               );
            }
         }
      }

      if (sel) {
         ctx.strokeStyle = "#fff";
         ctx.lineWidth = 3;
         ctx.strokeRect(
            sel.c * GameConfig.TILE_SIZE,
            sel.r * GameConfig.TILE_SIZE,
            GameConfig.TILE_SIZE - 2,
            GameConfig.TILE_SIZE - 2
         );
      }
   },

   preloadImages(callback?: () => void) {
      let loadedCount = 0;

      GameConfig.IMAGES.forEach((src, i) => {
         const img = new Image();
         img.src = src;

         img.onload = () => {
            loadedCount++;
            console.log(`✅ Loaded image: ${src}`);
            if (loadedCount === GameConfig.IMAGES.length) {
               imagesLoaded = true;
               console.log("🎉 All images loaded");
               if (callback) callback();
            }
         };

         img.onerror = () => {
            console.error(`❌ Failed to load image: ${src}`);
         };

         imageCache[i] = img;
      });
   },
};
