/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from "bcryptjs";
import db from "./couchdb";
import type { User, GameScore, GameRecord, UserGameStats } from "@/types/user";

const initUserStats = (): UserGameStats => ({
   tetris: { bestScore: 0, gamesPlayed: 0, totalScore: 0 },
   flappy: { bestScore: 0, gamesPlayed: 0, totalScore: 0 },
   arkanoid: { bestScore: 0, gamesPlayed: 0, totalScore: 0 },
   blocks: { bestScore: 0, gamesPlayed: 0, totalScore: 0 },
   race: { bestScore: 0, gamesPlayed: 0, totalScore: 0 },
});

/**
 * Создание нового пользователя
 */
export async function createUser(
   username: string,
   email: string,
   password: string
): Promise<User> {
   const database = await db;

   const existingEmail = await database.find({
      selector: {
         type: "user",
         email: email.toLowerCase(),
      },
      limit: 1,
   });

   if (existingEmail.docs.length > 0) {
      throw new Error("Email уже используется");
   }

   const existingUsername = await database.find({
      selector: {
         type: "user",
         username: username.toLowerCase(),
      },
      limit: 1,
   });

   if (existingUsername.docs.length > 0) {
      throw new Error("Имя пользователя уже занято");
   }

   const passwordHash = await bcrypt.hash(password, 10);

   const user: User = {
      _id: `user:${Date.now()}:${username.toLowerCase()}`,
      type: "user",
      username: username,
      email: email.toLowerCase(),
      passwordHash,
      createdAt: new Date(),
      updatedAt: new Date(),
      stats: initUserStats(),
      totalGamesPlayed: 0,
      totalScore: 0,
      achievements: [],
   };

   const response = await database.insert(user);

   return {
      ...user,
      _rev: response.rev,
   };
}

// Авторизация пользователя
export async function authenticateUser(
   email: string,
   password: string
): Promise<User | null> {
   const database = await db;

   const result = await database.find({
      selector: {
         type: "user",
         email: email.toLowerCase(),
      },
      limit: 1,
   });

   if (result.docs.length === 0) {
      return null;
   }

   const user = result.docs[0] as User;
   const isValid = await bcrypt.compare(password, user.passwordHash);

   if (!isValid) {
      return null;
   }

   return user;
}

// Получение пользователя по ID
export async function getUserById(userId: string): Promise<User | null> {
   const database = await db;

   try {
      const user = await database.get(userId);
      return user as User;
   } catch (error: unknown) {
      console.error("Error getting user by ID:", error);
      return null;
   }
}

// Получение пользователя по email
export async function getUserByEmail(email: string): Promise<User | null> {
   const database = await db;

   const result = await database.find({
      selector: {
         type: "user",
         email: email.toLowerCase(),
      },
      limit: 1,
   });

   if (result.docs.length === 0) {
      return null;
   }

   return result.docs[0] as User;
}

 // Сохранение результата игры
export async function saveGameScore(
   userId: string,
   gameScore: GameScore
): Promise<{ user: User; record: GameRecord; isNewRecord: boolean }> {
   const database = await db;

   const user = (await database.get(userId)) as User;
   if (!user) {
      throw new Error("Пользователь не найден");
   }

   const { game, score, level, duration } = gameScore;

   const gameRecord: GameRecord = {
      _id: `record:${userId}:${game}:${Date.now()}`,
      type: "game_record",
      userId: user._id,
      username: user.username,
      game,
      score,
      level,
      duration,
      timestamp: new Date(),
   };

   await database.insert(gameRecord);

   const gameStats = user.stats[game];
   const isNewRecord = score > gameStats.bestScore;

   gameStats.gamesPlayed += 1;
   gameStats.totalScore += score;
   gameStats.lastPlayed = new Date();

   if (isNewRecord) {
      gameStats.bestScore = score;
   }

   user.totalGamesPlayed += 1;
   user.totalScore += score;
   user.updatedAt = new Date();

   user.achievements = checkAchievements(user);

   const updatedUser = await database.insert(user);

   return {
      user: { ...user, _rev: updatedUser.rev },
      record: gameRecord,
      isNewRecord,
   };
}


 // Получение рекордов пользователя для конкретной игры
export async function getUserGameRecords(
   userId: string,
   game: string,
   limit: number = 10
): Promise<GameRecord[]> {
   const database = await db;

   const result = await database.find({
      selector: {
         type: "game_record",
         userId,
         game,
      },
      sort: [{ score: "desc" }],
      limit,
   });

   return result.docs as GameRecord[];
}


 // Получение топ рекордов по игре (таблица лидеров)
 export async function getGameLeaderboard(
   game: string,
   limit: number = 10
): Promise<Array<{ userId: string; username: string; score: number; rank: number; date: string }>> {
   const database = await db;

   const result = await database.find({
      selector: {
         type: "game_record",
         game,
      },
   });

   const sortedDocs = result.docs
      .sort((a: any, b: any) => (b.score || 0) - (a.score || 0))
      .slice(0, limit);

   return sortedDocs.map((doc: any, index: number) => ({
      userId: doc._id || doc.userId || `user_${index}`,
      username: doc.username,
      score: doc.score || 0,
      rank: index + 1,
      date: doc.timestamp ? new Date(doc.timestamp).toISOString() : new Date().toISOString(),
   }));
}


 // Получение общей статистики пользователя
export async function getUserStats(userId: string) {
   const database = await db;
   const user = (await database.get(userId)) as User;

   if (!user) {
      throw new Error("Пользователь не найден");
   }

   return {
      username: user.username,
      totalGamesPlayed: user.totalGamesPlayed,
      totalScore: user.totalScore,
      achievements: user.achievements,
      stats: user.stats,
   };
}


 // Получение всех игр пользователя
export async function getUserAllGameRecords(
   userId: string,
   limit: number = 50
): Promise<GameRecord[]> {
   const database = await db;

   const result = await database.find({
      selector: {
         type: "game_record",
         userId,
      },
      sort: [{ timestamp: "desc" }],
      limit,
   });

   return result.docs as GameRecord[];
}


 // Проверка и присвоение достижений
function checkAchievements(user: User): string[] {
   const achievements: string[] = [...user.achievements];

   // Первая игра
   if (user.totalGamesPlayed === 1 && !achievements.includes("first_game")) {
      achievements.push("first_game");
   }

   // 10 игр
   if (user.totalGamesPlayed >= 10 && !achievements.includes("ten_games")) {
      achievements.push("ten_games");
   }

   // 100 игр
   if (user.totalGamesPlayed >= 100 && !achievements.includes("one_hundred_games")) {
      achievements.push("one_hundred_games");
   }

   // Общий счет > 1000
   if (user.totalScore >= 1000 && !achievements.includes("score_1k")) {
      achievements.push("score_1k");
   }

   // Cыграл во все 5 игр
   const playedGames = Object.values(user.stats).filter(
      (stat) => stat.gamesPlayed > 0
   ).length;
   if (playedGames === 5 && !achievements.includes("all_games_master")) {
      achievements.push("all_games_master");
   }

   return achievements;
}


