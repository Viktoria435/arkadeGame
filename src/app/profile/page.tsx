"use client";

import React from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { Trophy, Gamepad2, Target, Calendar, Award } from "lucide-react";
import { ACHIEVEMENT_DESCRIPTIONS, ACHIEVEMENT_LABELS } from "@/types/achievements.t";

const ProfilePage = () => {
   const { user } = useAuth();

   if (!user) return null;

   const gameNames = {
      tetris: "Tetris",
      flappy: "Flappy Bird",
      arkanoid: "Arkanoid",
      blocks: "Blocks",
      race: "Race",
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
                        <h3 className="text-xl font-bold text-gray-800">
                           Общий счет
                        </h3>
                     </div>
                     <p className="text-3xl font-black text-purple-600">
                        {user.totalScore.toLocaleString()}
                     </p>
                  </div>

                  <div className="bg-white/80 backdrop-blur-xl rounded-3xl border-2 border-purple-200 shadow-xl p-6">
                     <div className="flex items-center gap-3 mb-4">
                        <Gamepad2 className="w-8 h-8 text-blue-500" />
                        <h3 className="text-xl font-bold text-gray-800">
                           Игр сыграно
                        </h3>
                     </div>
                     <p className="text-3xl font-black text-purple-600">
                        {user.totalGamesPlayed}
                     </p>
                  </div>

                  <div className="bg-white/80 backdrop-blur-xl rounded-3xl border-2 border-purple-200 shadow-xl p-6">
                     <div className="flex items-center gap-3 mb-4">
                        <Award className="w-8 h-8 text-pink-500" />
                        <h3 className="text-xl font-bold text-gray-800">
                           Достижений
                        </h3>
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
                        <div
                           key={game}
                           className="bg-purple-50/50 rounded-xl p-4 border border-purple-200"
                        >
                           <h3 className="font-bold text-gray-800 mb-2">
                              {gameNames[game as keyof typeof gameNames]}
                           </h3>
                           <div className="space-y-1 text-sm text-gray-600">
                              <p>
                                 Лучший счет:{" "}
                                 <span className="font-bold text-purple-600">
                                    {stats.bestScore.toLocaleString()}
                                 </span>
                              </p>
                              <p>
                                 Сыграно:{" "}
                                 <span className="font-bold text-purple-600">
                                    {stats.gamesPlayed}
                                 </span>
                              </p>
                              <p>
                                 Общий счет:{" "}
                                 <span className="font-bold text-purple-600">
                                    {stats.totalScore.toLocaleString()}
                                 </span>
                              </p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Recent Games */}
               <div className="bg-white/80 backdrop-blur-xl rounded-3xl border-2 border-purple-200 shadow-xl p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                     <Calendar className="w-6 h-6 text-purple-500" />
                     Достижения
                  </h2>

                  <div className="space-y-3">
                     {user.achievements.map((achievementKey) => (
                        <div
                           key={achievementKey}
                           className="p-4 bg-purple-50 rounded-lg border border-purple-200"
                        >
                           <h3 className="font-bold text-purple-800">
                              🏆{" "}
                              {ACHIEVEMENT_LABELS[achievementKey] ||
                                 achievementKey}
                           </h3>
                           <p className="text-sm text-purple-600">
                              {ACHIEVEMENT_DESCRIPTIONS[achievementKey]}
                           </p>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </ProtectedRoute>
   );
};

export default ProfilePage;
