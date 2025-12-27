import { NextRequest, NextResponse } from 'next/server';
import { createUser } from '@/lib/userService';

export async function POST(request: NextRequest) {
   try {
      const body = await request.json();
      const { username, email, password } = body;
      if (!username || !email || !password) {
         return NextResponse.json(
            { error: 'Все поля обязательны' },
            { status: 400 }
         );
      }

      if (username.length < 3) {
         return NextResponse.json(
            { error: 'Имя пользователя должно быть минимум 3 символа' },
            { status: 400 }
         );
      }

      if (password.length < 8) {
         return NextResponse.json(
            { error: 'Пароль должен быть минимум 8 символов' },
            { status: 400 }
         );
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
         return NextResponse.json(
            { error: 'Неверный формат email' },
            { status: 400 }
         );
      }

      const user = await createUser(username, email, password);

      const { passwordHash, ...userWithoutPassword } = user;

      return NextResponse.json(
         {
            message: 'Пользователь успешно создан',
            user: userWithoutPassword,
         },
         { status: 201 }
      );
   } catch (error: unknown) {
      console.error('Registration error:', error);

      if (error instanceof Error && (error.message.includes('уже используется') || error.message.includes('уже занято'))) {
         return NextResponse.json(
            { error: error.message },
            { status: 409 }
         );
      }

      return NextResponse.json(
         { error: 'Ошибка при создании пользователя' },
         { status: 500 }
      );
   }
}