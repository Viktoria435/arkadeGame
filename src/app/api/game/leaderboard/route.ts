import { NextRequest, NextResponse } from 'next/server';
import { getGameLeaderboard } from '@/lib/userService';

export async function GET(request: NextRequest) {
   try {
      const { searchParams } = new URL(request.url);
      const game = searchParams.get('game');
      const limit = parseInt(searchParams.get('limit') || '10');

      if (!game) {
         return NextResponse.json(
            { error: 'Параметр game обязателен' },
            { status: 400 }
         );
      }

      const validGames = ['tetris', 'flappy', 'arkanoid', 'blocks', 'race'];
      if (!validGames.includes(game)) {
         return NextResponse.json(
            { error: 'Неверное название игры' },
            { status: 400 }
         );
      }

      const leaderboard = await getGameLeaderboard(game, limit);

      return NextResponse.json(
         {
            game,
            leaderboard,
         },
         { status: 200 }
      );
   } catch (error) {
      console.error('Leaderboard error:', error);
      console.error('Error details:', {
         message: error instanceof Error ? error.message : 'Unknown error',
         stack: error instanceof Error ? error.stack : undefined
      });
      return NextResponse.json(
         { error: 'Ошибка при получении таблицы лидеров' },
         { status: 500 }
      );
   }
}