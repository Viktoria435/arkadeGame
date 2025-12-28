import { NextRequest, NextResponse } from "next/server";
import { getUserById } from "@/lib/userService";
import jwt from "jsonwebtoken";

const JWT_SECRET =
   process.env.JWT_SECRET || "your-secret-key-change-in-production";

export async function GET(request: NextRequest) {
   try {
      const authHeader = request.headers.get('authorization');

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
         return NextResponse.json(
            { error: "Токен не предоставлен" },
            { status: 401 }
         );
      }

      const token = authHeader.substring(7); 

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const decoded = jwt.verify(token, JWT_SECRET) as any;

      const user = await getUserById(decoded.userId);

      if (!user) {
         return NextResponse.json(
            { error: "Пользователь не найден" },
            { status: 404 }
         );
      }

      const { passwordHash, ...userWithoutPassword } = user;

      return NextResponse.json(
         {
            user: userWithoutPassword,
         },
         { status: 200 }
      );
   } catch (error) {
      console.error("Token verification error:", error);
      return NextResponse.json(
         { error: "Недействительный токен" },
         { status: 401 }
      );
   }
}
