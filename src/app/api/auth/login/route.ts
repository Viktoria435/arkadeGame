import { NextRequest, NextResponse } from "next/server";
import { authenticateUser } from "@/lib/userService";
import jwt from "jsonwebtoken";

const JWT_SECRET =
   process.env.JWT_SECRET || "your-secret-key-change-in-production";

export async function POST(request: NextRequest) {
   try {
      const body = await request.json();
      const { email, password } = body;

      if (!email || !password) {
         return NextResponse.json(
            { error: "Email и пароль обязательны" },
            { status: 400 }
         );
      }

      const user = await authenticateUser(email, password);

      if (!user) {
         return NextResponse.json(
            { error: "Неверный email или пароль" },
            { status: 401 }
         );
      }

      const token = jwt.sign(
         {
            userId: user._id,
            username: user.username,
            email: user.email,
         },
         JWT_SECRET,
         { expiresIn: "7d" }
      );

      const { passwordHash, ...userWithoutPassword } = user;

      return NextResponse.json(
         {
            message: "Успешный вход",
            token,
            user: userWithoutPassword,
         },
         { status: 200 }
      );
   } catch (error) {
      console.error("Login error:", error);
      return NextResponse.json({ error: "Ошибка при входе" }, { status: 500 });
   }
}
