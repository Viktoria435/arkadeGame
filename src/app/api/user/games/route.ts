import { NextRequest, NextResponse } from "next/server";
import { getUserAllGameRecords } from "@/lib/userService";
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

      const records = await getUserAllGameRecords(decoded.userId, 20);

      return NextResponse.json(
         {
            records,
         },
         { status: 200 }
      );
   } catch (error) {
      console.error("Error fetching user games:", error);
      return NextResponse.json(
         { error: "Ошибка при получении данных" },
         { status: 500 }
      );
   }
}
