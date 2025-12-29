'use client';

import { useState, useEffect } from 'react';

interface LeaderboardEntry {
  userId: string;
  username: string;
  score: number;
  rank: number;
  date: string;
}

interface LeaderboardData {
  game: string;
  leaderboard: LeaderboardEntry[];
}

const GAMES = [
  { id: 'tetris', name: 'Тетрис', icon: '🧩' },
  { id: 'flappy', name: 'Flappy Bird', icon: '🐦' },
  { id: 'arkanoid', name: 'Арканоид', icon: '🎮' },
  { id: 'blocks', name: 'Блоки', icon: '🟦' },
  { id: 'race', name: 'Гонки', icon: '🏎️' },
];

export default function Leaderboard() {
  const [selectedGame, setSelectedGame] = useState('tetris');
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLeaderboard();
  }, [selectedGame]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/game/leaderboard?game=${selectedGame}&limit=10`);
      
      if (!response.ok) {
        throw new Error('Ошибка при загрузке данных');
      }
      
      const data = await response.json();
      setLeaderboardData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
    } finally {
      setLoading(false);
    }
  };

  const formatScore = (score: number) => {
    return score.toLocaleString('ru-RU');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getMedalEmoji = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return `${rank}.`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
            🏆 Таблица лидеров
          </h1>
          <p className="text-xl text-purple-200">
            Лучшие игроки в наших играх
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8 shadow-2xl">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {GAMES.map((game) => (
              <button
                key={game.id}
                onClick={() => setSelectedGame(game.id)}
                className={`
                  p-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105
                  ${
                    selectedGame === game.id
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg scale-105'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }
                `}
              >
                <div className="text-3xl mb-2">{game.icon}</div>
                <div className="text-sm">{game.name}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-400"></div>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">😢</div>
              <p className="text-xl text-red-300">{error}</p>
              <button
                onClick={fetchLeaderboard}
                className="mt-6 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors"
              >
                Попробовать снова
              </button>
            </div>
          ) : leaderboardData?.leaderboard.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🎮</div>
              <p className="text-xl text-purple-200">
                Пока нет результатов для этой игры
              </p>
              <p className="text-md text-purple-300 mt-2">
                Будь первым, кто установит рекорд!
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-black/30">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-yellow-300 uppercase tracking-wider">
                      Место
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-yellow-300 uppercase tracking-wider">
                      Игрок
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-bold text-yellow-300 uppercase tracking-wider">
                      Счёт
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-bold text-yellow-300 uppercase tracking-wider">
                      Дата
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {leaderboardData?.leaderboard.map((entry, index) => (
                    <tr
                      key={entry.userId}
                      className={`
                        transition-all duration-200 hover:bg-white/10
                        ${index < 3 ? 'bg-gradient-to-r from-yellow-500/20 to-transparent' : ''}
                      `}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-2xl font-bold text-white">
                          {getMedalEmoji(entry.rank)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold mr-3">
                            {entry.username.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-lg font-semibold text-white">
                            {entry.username}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className="text-xl font-bold text-yellow-300">
                          {formatScore(entry.score)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className="text-sm text-purple-200">
                          {formatDate(entry.date)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="text-center mt-8 text-purple-200">
          <p className="text-sm">
            🎯 Таблица обновляется автоматически
          </p>
          <p className="text-xs mt-2 opacity-75">
            Играйте больше, чтобы попасть в топ!
          </p>
        </div>
      </div>
    </div>
  );
}