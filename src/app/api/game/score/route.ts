import { NextRequest, NextResponse } from "next/server";
import { saveGameScore } from "@/lib/userService";
import jwt from "jsonwebtoken";

const JWT_SECRET =
   process.env.JWT_SECRET || "your-secret-key-change-in-production";

function verifyToken(request: NextRequest) {
   const authHeader = request.headers.get("authorization");

   if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
   }

   const token = authHeader.substring(7);

   try {
      const decoded = jwt.verify(token, JWT_SECRET) as {
         userId: string;
         username: string;
         email: string;
      };
      return decoded;
   } catch (error) {
      return null;
   }
}

export async function POST(request: NextRequest) {
   try {
      const user = verifyToken(request);

      if (!user) {
         return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
      }

      const body = await request.json();
      const { game, score, level, duration } = body;

      if (!game || score === undefined) {
         return NextResponse.json(
            { error: "Игра и счет обязательны" },
            { status: 400 }
         );
      }

      const validGames = ["tetris", "flappy", "arkanoid", "blocks", "race"];
      if (!validGames.includes(game)) {
         return NextResponse.json(
            { error: "Неверное название игры" },
            { status: 400 }
         );
      }

      if (typeof score !== "number" || score < 0) {
         return NextResponse.json(
            { error: "Счет должен быть положительным числом" },
            { status: 400 }
         );
      }

      const result = await saveGameScore(user.userId, {
         game,
         score,
         level,
         duration,
         timestamp: new Date(),
      });

      const { passwordHash, ...userWithoutPassword } = result.user;

      return NextResponse.json(
         {
            message: result.isNewRecord
               ? "Новый рекорд! Поздравляем!"
               : "Результат сохранен",
            isNewRecord: result.isNewRecord,
            user: userWithoutPassword,
            record: result.record,
         },
         { status: 201 }
      );
   } catch (error) {
      console.error("Save score error:", error);
      return NextResponse.json(
         { error: "Ошибка при сохранении результата" },
         { status: 500 }
      );
   }
}
