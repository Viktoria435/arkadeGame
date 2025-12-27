import { NextRequest, NextResponse } from 'next/server';
import { getUserStats } from '@/lib/userService';
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

function verifyToken(request: NextRequest) {
   const authHeader = request.headers.get('authorization');

   if (!authHeader || !authHeader.startsWith('Bearer ')) {
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

export async function GET(request: NextRequest) {
   try {
      const user = verifyToken(request);

      if (!user) {
         return NextResponse.json(
            { error: 'Не авторизован' },
            { status: 401 }
         );
      }

      const stats = await getUserStats(user.userId);

      return NextResponse.json(stats, { status: 200 });
   } catch (error) {
      console.error('Get stats error:', error);
      return NextResponse.json(
         { error: 'Ошибка при получении статистики' },
         { status: 500 }
      );
   }
}