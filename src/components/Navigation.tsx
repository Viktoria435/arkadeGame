"use client";

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { User, LogOut, Trophy, Gamepad2 } from 'lucide-react';

export const Navigation: React.FC = () => {
   const { user, logout } = useAuth();
   const router = useRouter();

   const handleLogout = () => {
      logout();
      router.push('/login');
   };

   const handleProfile = () => {
      router.push('/profile');
   };

   const handleHome = () => {
      router.push('/');
   };


   return (
      <nav className="bg-purple-100/40 fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-purple-200 shadow-lg">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
               <div className="flex items-center gap-4">
                  <button
                     onClick={handleHome}
                     className="flex items-center gap-2 text-purple-600 hover:text-purple-800 transition-colors"
                  >
                     <Gamepad2 className="w-6 h-6" />
                     <span className="font-bold text-lg">ARCADE</span>
                  </button>
               </div>

               <div className="flex items-center gap-4">
                  {user ? (
                     <>
                        <div className="hidden md:flex items-center gap-4 text-sm">
                           <div className="flex items-center gap-1 text-purple-600">
                              <Trophy className="w-4 h-4" />
                              <span>{user.totalScore.toLocaleString()}</span>
                           </div>
                           <div className="flex items-center gap-1 text-purple-600">
                              <Gamepad2 className="w-4 h-4" />
                              <span>{user.totalGamesPlayed}</span>
                           </div>
                        </div>

                        <span className="text-gray-700 font-medium">
                           {user.username}
                        </span>

                        <button
                           onClick={handleProfile}
                           className="p-2 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-lg transition-colors"
                           title="Профиль"
                        >
                           <User className="w-5 h-5" />
                        </button>

                        <button
                           onClick={handleLogout}
                           className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300"
                        >
                           <LogOut className="w-4 h-4" />
                           <span className="hidden sm:inline">Выйти</span>
                        </button>
                     </>
                  ) : (
                     <div className="flex items-center gap-2">
                        <button
                           onClick={() => router.push('/login')}
                           className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300"
                        >
                           Войти
                        </button>
                     </div>
                  )}
               </div>
            </div>
         </div>
      </nav>
   );
};
