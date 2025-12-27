"use client";

import React, { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { Trophy, Gamepad2, Target, Star, Calendar, Award } from 'lucide-react';

const ProfilePage = () => {
   const { user } = useAuth();
   const [recentGames, setRecentGames] = useState<any[]>([]);
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      if (user) {
         fetchRecentGames();
      }
   }, [user]);

   const fetchRecentGames = async () => {
      try {
         const token = localStorage.getItem('token');
         const response = await fetch('/api/user/games', {
            headers: {
               'Authorization': `Bearer ${token}`
            }
         });
         if (response.ok) {
            const data = await response.json();
            setRecentGames(data.records || []);
         }
      } catch (error) {
         console.error('Error fetching recent games:', error);
      } finally {
         setIsLoading(false);
      }
   };

   if (!user) return null;

   const gameNames = {
      tetris: 'Tetris',
      flappy: 'Flappy Bird',
      arkanoid: 'Arkanoid',
      blocks: 'Blocks',
      race: 'Race'
   };

   const formatDate = (date: Date) => {
      return new Date(date).toLocaleDateString('ru-RU', {
         day: '2-digit',
         month: '2-digit',
         year: 'numeric',
         hour: '2-digit',
         minute: '2-digit'
      });
   };

   return (
      <ProtectedRoute>
         <div className="min-h-screen w-full bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
            <div
               className="absolute inset-0 opacity-5 pointer-events-none"
               style={{
                  backgroundImage: `
                  linear-gradient(rgba(139, 92, 246, 0.15) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(139, 92, 246, 0.15) 1px, transparent 1px)
               `,
                  backgroundSize: "50px 50px",
               }}
            />

            <div className="relative z-10 container mx-auto px-6 py-12 max-w-6xl">
               {/* Profile Header */}
               <div className="mb-8">
                  <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 mb-2">
                     Профиль игрока
                  </h1>
                  <p className="text-xl text-purple-600 font-light">
                     Добро пожаловать, {user.username}!
                  </p>
               </div>

               {/* Stats Overview */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white/80 backdrop-blur-xl rounded-3xl border-2 border-purple-200 shadow-xl p-6">
                     <div className="flex items-center gap-3 mb-4">
                        <Trophy className="w-8 h-8 text-yellow-500" />
                        <h3 className="text-xl font-bold text-gray-800">Общий счет</h3>
                     </div>
                     <p className="text-3xl font-black text-purple-600">
                        {user.totalScore.toLocaleString()}
                     </p>
                  </div>

                  <div className="bg-white/80 backdrop-blur-xl rounded-3xl border-2 border-purple-200 shadow-xl p-6">
                     <div className="flex items-center gap-3 mb-4">
                        <Gamepad2 className="w-8 h-8 text-blue-500" />
                        <h3 className="text-xl font-bold text-gray-800">Игр сыграно</h3>
                     </div>
                     <p className="text-3xl font-black text-purple-600">
                        {user.totalGamesPlayed}
                     </p>
                  </div>

                  <div className="bg-white/80 backdrop-blur-xl rounded-3xl border-2 border-purple-200 shadow-xl p-6">
                     <div className="flex items-center gap-3 mb-4">
                        <Award className="w-8 h-8 text-pink-500" />
                        <h3 className="text-xl font-bold text-gray-800">Достижений</h3>
                     </div>
                     <p className="text-3xl font-black text-purple-600">
                        {user.achievements.length}
                     </p>
                  </div>
               </div>

               {/* Game Statistics */}
               <div className="bg-white/80 backdrop-blur-xl rounded-3xl border-2 border-purple-200 shadow-xl p-6 mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                     <Target className="w-6 h-6 text-purple-500" />
                     Статистика по играм
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                     {Object.entries(user.stats).map(([game, stats]) => (
                        <div key={game} className="bg-purple-50/50 rounded-xl p-4 border border-purple-200">
                           <h3 className="font-bold text-gray-800 mb-2">
                              {gameNames[game as keyof typeof gameNames]}
                           </h3>
                           <div className="space-y-1 text-sm text-gray-600">
                              <p>Лучший счет: <span className="font-bold text-purple-600">{stats.bestScore.toLocaleString()}</span></p>
                              <p>Сыграно: <span className="font-bold text-purple-600">{stats.gamesPlayed}</span></p>
                              <p>Общий счет: <span className="font-bold text-purple-600">{stats.totalScore.toLocaleString()}</span></p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Recent Games */}
               <div className="bg-white/80 backdrop-blur-xl rounded-3xl border-2 border-purple-200 shadow-xl p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                     <Calendar className="w-6 h-6 text-purple-500" />
                     Последние игры
                  </h2>

                  {isLoading ? (
                     <div className="text-center py-8">
                        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                        <p className="text-gray-600">Загрузка...</p>
                     </div>
                  ) : recentGames.length > 0 ? (
                     <div className="space-y-3">
                        {recentGames.slice(0, 10).map((game, index) => (
                           <div key={index} className="flex items-center justify-between p-4 bg-purple-50/50 rounded-xl border border-purple-200">
                              <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold">
                                    {gameNames[game.game]?.[0]}
                                 </div>
                                 <div>
                                    <p className="font-bold text-gray-800">{gameNames[game.game]}</p>
                                    <p className="text-sm text-gray-600">{formatDate(game.timestamp)}</p>
                                 </div>
                              </div>
                              <div className="text-right">
                                 <p className="text-lg font-bold text-purple-600">{game.score.toLocaleString()}</p>
                                 {game.level && <p className="text-sm text-gray-600">Уровень {game.level}</p>}
                              </div>
                           </div>
                        ))}
                     </div>
                  ) : (
                     <p className="text-center text-gray-600 py-8">Игр пока не сыграно</p>
                  )}
               </div>
            </div>
         </div>
      </ProtectedRoute>
   );
};

export default ProfilePage;
