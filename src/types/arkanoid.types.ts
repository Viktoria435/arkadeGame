export interface Position {
   x: number;
   y: number;
 }
 
 export interface Velocity {
   x: number;
   y: number;
 }
 
 export interface Ball {
   id: number;
   position: Position;
   velocity: Velocity;
   radius: number;
 }
 
 export interface Paddle {
   x: number;
   y: number;
   width: number;
   height: number;
   speed: number;
   hasGun: boolean;
 }
 
 export interface Brick {
   x: number;
   y: number;
   width: number;
   height: number;
   visible: boolean;
   color: string;
   points: number;
   hits: number;
   hasPowerUp: boolean;
   powerUpType?: PowerUpType;
 }
 
 export type PowerUpType = 'multiBall' | 'gun' | 'expandPaddle' | 'slowBall';
 
 export interface PowerUp {
   id: number;
   x: number;
   y: number;
   width: number;
   height: number;
   type: PowerUpType;
   velocity: number;
   color: string;
   icon: string;
 }
 
 export interface Bullet {
   id: number;
   x: number;
   y: number;
   width: number;
   height: number;
   velocity: number;
 }
 
 export interface GameState {
   score: number;
   lives: number;
   level: number;
   gameOver: boolean;
   isPaused: boolean;
   isStarted: boolean;
 }