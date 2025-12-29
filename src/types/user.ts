export interface GameScore {
    game: 'tetris' | 'flappy' | 'arkanoid' | 'blocks' | 'race';
    score: number;
    timestamp: Date;
    level?: number;
    duration?: number;
 }
 
 export interface UserGameStats {
    tetris: {
       bestScore: number;
       gamesPlayed: number;
       totalScore: number;
       lastPlayed?: Date;
    };
    flappy: {
       bestScore: number;
       gamesPlayed: number;
       totalScore: number;
       lastPlayed?: Date;
    };
    arkanoid: {
       bestScore: number;
       gamesPlayed: number;
       totalScore: number;
       lastPlayed?: Date;
    };
    blocks: {
       bestScore: number;
       gamesPlayed: number;
       totalScore: number;
       lastPlayed?: Date;
    };
    race: {
       bestScore: number;
       gamesPlayed: number;
       totalScore: number;
       lastPlayed?: Date;
    };
 }
 
 export interface User {
    _id: string;
    _rev?: string;
    type: 'user';
    username: string;
    email: string;
    passwordHash: string;
    createdAt: Date;
    updatedAt: Date;
    stats: UserGameStats;
    totalGamesPlayed: number;
    totalScore: number;
    achievements: string[];
 }
 
 export interface GameRecord {
    _id: string;
    _rev?: string;
    type: 'game_record';
    userId: string;
    username: string;
    game: 'tetris' | 'flappy' | 'arkanoid' | 'blocks' | 'race';
    score: number;
    level?: number;
    duration?: number;
    timestamp: Date;
 }