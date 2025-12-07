import { GameConfig } from "@/config/matchThree.config";
import { Position } from "@/types/position.t";

export function areAdjacent(a: Position, b: Position): boolean {
   const dr = Math.abs(a.r - b.r);
   const dc = Math.abs(a.c - b.c);
   return (dr === 1 && dc === 0) || (dr === 0 && dc === 1);
}

export function initGrid() {
   const g: (number | null)[][] = [];
   for (let r = 0; r < GameConfig.ROWS; r++) {
      const row: (number | null)[] = [];
      for (let c = 0; c < GameConfig.COLS; c++)
         row.push(Math.floor(Math.random() * GameConfig.COLORS.length));
      g.push(row);
   }
   return g;
}

export function swapTiles(
   grid: (number | null)[][],
   a: Position,
   b: Position
): void {
   const temp = grid[a.r][a.c];
   grid[a.r][a.c] = grid[b.r][b.c];
   grid[b.r][b.c] = temp;
}

export function findMatches(grid: (number | null)[][]): Set<string> {
   const matches = new Set<string>();
   const rows = grid.length;
   const cols = grid[0].length;

   for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols - 2; c++) {
         const v = grid[r][c];
         if (v !== null && v === grid[r][c + 1] && v === grid[r][c + 2]) {
            matches.add(`${r},${c}`);
            matches.add(`${r},${c + 1}`);
            matches.add(`${r},${c + 2}`);
         }
      }
   }

   for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows - 2; r++) {
         const v = grid[r][c];
         if (v !== null && v === grid[r + 1][c] && v === grid[r + 2][c]) {
            matches.add(`${r},${c}`);
            matches.add(`${r + 1},${c}`);
            matches.add(`${r + 2},${c}`);
         }
      }
   }

   return matches;
}

export function removeMatches(grid: (number | null)[][], matches: Set<string>) {
   for (const key of matches) {
      const [r, c] = key.split(",").map(Number);
      grid[r][c] = null;
   }
}

export function collapseGrid(grid: (number | null)[][]) {
   const rows = grid.length;
   const cols = grid[0].length;

   for (let c = 0; c < cols; c++) {
      for (let r = rows - 1; r >= 0; r--) {
         if (grid[r][c] === null) {
            for (let k = r - 1; k >= 0; k--) {
               if (grid[k][c] !== null) {
                  grid[r][c] = grid[k][c];
                  grid[k][c] = null;
                  break;
               }
            }
         }
      }
   }
}

export function refillGrid(grid: (number | null)[][]) {
   const rows = grid.length;
   const cols = grid[0].length;
   for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
         if (grid[r][c] === null) {
            grid[r][c] = Math.floor(Math.random() * 6);
         }
      }
   }
}

export function processMatchesLoop(
   g: (number | null)[][],
   setGrid: React.Dispatch<React.SetStateAction<(number | null)[][]>>,
   setScore: React.Dispatch<React.SetStateAction<number>>,
   setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>
) {
   let totalRemoved = 0;

   function step() {
      const matches = findMatches(g);
      if (matches.size === 0) {
         setGrid(g.map((row) => [...row]));
         setScore((s) => s + totalRemoved * 10);
         setIsProcessing(false);
         return;
      }
      totalRemoved += matches.size;
      removeMatches(g, matches);
      collapseGrid(g);
      refillGrid(g);
      setGrid(g.map((row) => [...row]));
      setTimeout(step, 250);
   }

   step();
}

export function swapAndProcess({
   a,
   b,
   grid,
   setGrid,
   setScore,
   setIsProcessing,
}: {
   a: Position;
   b: Position;
   grid: (number | null)[][];
   setGrid: React.Dispatch<React.SetStateAction<(number | null)[][]>>;
   setScore: React.Dispatch<React.SetStateAction<number>>;
   setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>;
}) {
   swapTiles(grid, a, b);
   const matches = findMatches(grid);

   if (matches.size > 0) {
      setIsProcessing(true);
      processMatchesLoop(grid, setGrid, setScore, setIsProcessing);
   } else {
      swapTiles(grid, a, b);
      setGrid(grid.map((row) => [...row]));
   }
}

export const GridUtils = {
   areAdjacent,
   initGrid,
   swapTiles,
   findMatches,
   removeMatches,
   collapseGrid,
   refillGrid,
   processMatchesLoop,
   swapAndProcess,
};
