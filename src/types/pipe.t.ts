export interface Pipe {
   x: number;
   top: number;
   scored?: boolean;
}

export interface GameState {
   birdY: number;
   velocity: number;
   pipes: Pipe[];
   score: number;
   level: number;
   gameOver: boolean;
   speed: number;
   frame: number;
}
