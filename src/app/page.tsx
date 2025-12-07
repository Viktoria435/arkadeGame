"use client";

import React, { useState } from "react";
import { Gamepad2, Trophy, Zap, Star } from "lucide-react";
import { useRouter } from "next/navigation";

const ArcadeGamesHome = () => {
   const [hoveredGame, setHoveredGame] = useState<string | null>(null);
   const router = useRouter();
   const games = [
      {
         id: "tetris",
         title: "Tetris",
         description: "Классическая головоломка",
         color: "from-cyan-500 to-blue-600",
         bgColor: "bg-cyan-500/10",
         borderColor: "border-cyan-500/50",
         icon: "🧊",
         difficulty: "Средняя",
         players: "1",
         bestScore: "12,450",
      },
      {
         id: "flappy",
         title: "Flappy Bird",
         description: "Летай и выживай",
         color: "from-yellow-500 to-orange-600",
         bgColor: "bg-yellow-500/10",
         borderColor: "border-yellow-500/50",
         icon: "🐦",
         difficulty: "Сложная",
         players: "1",
         bestScore: "287",
      },
      {
         id: "arkanoid",
         title: "Arkanoid",
         description: "Разбивай блоки",
         color: "from-purple-500 to-pink-600",
         bgColor: "bg-purple-500/10",
         borderColor: "border-purple-500/50",
         icon: "🎯",
         difficulty: "Легкая",
         players: "1",
         bestScore: "8,920",
      },
      {
         id: "blocks",
         title: "Blocks",
         description: "Собирай комбинации",
         color: "from-green-500 to-emerald-600",
         bgColor: "bg-green-500/10",
         borderColor: "border-green-500/50",
         icon: "🧩",
         difficulty: "Средняя",
         players: "1",
         bestScore: "15,680",
      },
   ];

   return (
      <div className="min-h-screen w-full bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 relative overflow-hidden">
         <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(30)].map((_, i) => (
               <div
                  key={i}
                  className="absolute rounded-full mix-blend-multiply"
                  style={{
                     left: `${Math.random() * 100}%`,
                     top: `${Math.random() * 100}%`,
                     width: `${Math.random() * 300 + 50}px`,
                     height: `${Math.random() * 300 + 50}px`,
                     background: `radial-gradient(circle, ${
                        [
                           "rgba(147, 197, 253, 0.15)",
                           "rgba(216, 180, 254, 0.15)",
                           "rgba(251, 207, 232, 0.15)",
                        ][Math.floor(Math.random() * 3)]
                     }, transparent)`,
                     animation: `float ${
                        Math.random() * 10 + 10
                     }s ease-in-out infinite`,
                     animationDelay: `${Math.random() * 5}s`,
                  }}
               />
            ))}
         </div>

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

         <div className="relative z-10 container mx-auto px-6 py-12 max-w-7xl">
            <div className="text-center mb-16 space-y-6">
               <div className="flex items-center justify-center gap-4 mb-4">
                  <Gamepad2 className="w-12 h-12 text-purple-400 animate-pulse" />
                  <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 animate-pulse">
                     ARCADE
                  </h1>
                  <Gamepad2 className="w-12 h-12 text-pink-400 animate-pulse" />
               </div>

               <p className="text-2xl text-purple-600 font-light tracking-wide">
                  Выберите игру и начните приключение
               </p>

               <div className="flex justify-center gap-8 mt-8">
                  <div className="flex items-center gap-2 text-purple-700">
                     <Trophy className="w-5 h-5 text-yellow-500" />
                     <span className="text-sm">
                        Игр доступно:{" "}
                        <span className="font-bold text-purple-900">4</span>
                     </span>
                  </div>
                  <div className="flex items-center gap-2 text-purple-700">
                     <Zap className="w-5 h-5 text-cyan-500" />
                     <span className="text-sm">
                        Всего очков:{" "}
                        <span className="font-bold text-purple-900">
                           37,337
                        </span>
                     </span>
                  </div>
                  <div className="flex items-center gap-2 text-purple-700">
                     <Star className="w-5 h-5 text-pink-500" />
                     <span className="text-sm">
                        Рекордов:{" "}
                        <span className="font-bold text-purple-900">12</span>
                     </span>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
               {games.map((game) => (
                  <div
                     key={game.id}
                     onMouseEnter={() => setHoveredGame(game.id)}
                     onMouseLeave={() => setHoveredGame(null)}
                     className={`group relative`}
                  >
                     <div
                        className={`
                  relative overflow-hidden rounded-3xl border-2 transition-all duration-500
                  ${game.bgColor} ${game.borderColor}
                  ${
                     hoveredGame === game.id
                        ? "scale-105 shadow-2xl shadow-purple-500/50"
                        : "scale-100"
                  }
                `}
                     >
                        {hoveredGame === game.id && (
                           <div
                              className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-20 blur-xl`}
                           />
                        )}

                        <div
                           className={`relative h-64 bg-gradient-to-br ${game.color} flex items-center justify-center overflow-hidden`}
                        >
                                 <div className="text-9xl transform transition-transform duration-500 group-hover:scale-125 group-hover:rotate-12">
                                    {game.icon}
                                 </div>
                                 <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    {[...Array(8)].map((_, i) => (
                                       <div
                                          key={i}
                                          className="absolute w-2 h-2 bg-white rounded-full animate-ping"
                                          style={{
                                             left: `${Math.random() * 100}%`,
                                             top: `${Math.random() * 100}%`,
                                             animationDelay: `${
                                                Math.random() * 2
                                             }s`,
                                             animationDuration: "2s",
                                          }}
                                       />
                                    ))}
                                 </div>
                        </div>

                        <div className="relative p-6 bg-white/60 backdrop-blur-sm">
                           <h3 className="text-2xl font-bold text-gray-800 mb-2 tracking-wide">
                              {game.title}
                           </h3>
                           <p className="text-gray-600 text-sm mb-4">
                              {game.description}
                           </p>

                           <div className="grid grid-cols-3 gap-2 text-xs">
                              <div className="bg-white/70 rounded-lg p-2 text-center border border-gray-200">
                                 <p className="text-gray-500">Сложность</p>
                                 <p className="text-gray-800 font-bold">
                                    {game.difficulty}
                                 </p>
                              </div>
                              {/* <div className="bg-white/70 rounded-lg p-2 text-center border border-gray-200">
                                 <p className="text-gray-500">Игроков</p>
                                 <p className="text-gray-800 font-bold">
                                    {game.players}
                                 </p>
                              </div> */}
                              <div className="bg-white/70 rounded-lg p-2 text-center border border-gray-200">
                                 <p className="text-gray-500">Рекорд</p>
                                 <p className="text-gray-800 font-bold">
                                    {game.bestScore}
                                 </p>
                              </div>
                           </div>

                              <button
                                 onClick={() => router.push(`/${game.id}`)}
                                 className={`
                      w-full mt-4 py-3 rounded-xl font-bold text-white
                      bg-gradient-to-r ${game.color}
                      transform transition-all duration-300
                      hover:shadow-lg hover:scale-105
                      active:scale-95
                    `}
                              >
                                 ИГРАТЬ
                              </button>
                        </div>
                     </div>
                  </div>
               ))}
            </div>

            <div className="text-center space-y-4">
               <div className="flex justify-center gap-4">
                  <button className="px-6 py-3 bg-purple-200 hover:bg-purple-300 border border-purple-300 text-purple-700 rounded-xl font-semibold transition-all duration-300 hover:scale-105">
                     Таблица лидеров
                  </button>
                  <button className="px-6 py-3 bg-pink-200 hover:bg-pink-300 border border-pink-300 text-pink-700 rounded-xl font-semibold transition-all duration-300 hover:scale-105">
                     Достижения
                  </button>
                  {/* <button className="px-6 py-3 bg-cyan-200 hover:bg-cyan-300 border border-cyan-300 text-cyan-700 rounded-xl font-semibold transition-all duration-300 hover:scale-105">
                     Настройки
                  </button> */}
               </div>
            </div>
         </div>

         <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(-40px) translateX(-10px);
          }
          75% {
            transform: translateY(-20px) translateX(10px);
          }
        }
      `}</style>
      </div>
   );
};

export default ArcadeGamesHome;
