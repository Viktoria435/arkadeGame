'use client';

import React from 'react';
import type { GameState } from '@/types/arkanoid.types';
import { Heart, Trophy, Target } from 'lucide-react';

interface ArkanoidStatsProps {
  gameState: GameState;
  onStart: () => void;
  onPause: () => void;
}

export const ArkanoidStats: React.FC<ArkanoidStatsProps> = ({ gameState, onStart, onPause }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-2 border-purple-300">
        <h3 className="text-purple-700 text-lg font-bold mb-4 uppercase tracking-wider">Статистика</h3>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <div>
              <p className="text-gray-600 text-xs">Счёт</p>
              <p className="text-purple-900 text-2xl font-bold">{gameState.score}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Target className="w-6 h-6 text-blue-500" />
            <div>
              <p className="text-gray-600 text-xs">Уровень</p>
              <p className="text-purple-900 text-2xl font-bold">{gameState.level}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Heart className="w-6 h-6 text-red-500" />
            <div>
              <p className="text-gray-600 text-xs">Жизни</p>
              <div className="flex gap-1">
                {[...Array(gameState.lives)].map((_, i) => (
                  <Heart key={i} className="w-5 h-5 fill-red-500 text-red-500" />
                ))}
                {[...Array(3 - gameState.lives)].map((_, i) => (
                  <Heart key={i + gameState.lives} className="w-5 h-5 text-gray-300" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-2 border-purple-300">
        <h3 className="text-purple-700 text-lg font-bold mb-4 uppercase tracking-wider">Управление</h3>
        
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              <div className="w-10 h-10 bg-purple-200 border-2 border-purple-400 rounded flex items-center justify-center font-bold text-purple-700">←</div>
              <div className="w-10 h-10 bg-purple-200 border-2 border-purple-400 rounded flex items-center justify-center font-bold text-purple-700">→</div>
            </div>
            <span className="text-gray-700">Управление ракеткой</span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-pink-200 border-2 border-pink-400 rounded flex items-center justify-center font-bold text-pink-700 text-xs">P</div>
            <span className="text-gray-700">Пауза</span>
          </div>
        </div>
      </div>

      {!gameState.isStarted && (
        <button
          onClick={onStart}
          className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
        >
          {gameState.gameOver ? 'НАЧАТЬ ЗАНОВО' : 'СТАРТ'}
        </button>
      )}

      {gameState.isStarted && !gameState.gameOver && (
        <button
          onClick={onPause}
          className={`w-full py-4 font-bold rounded-xl shadow-lg transition-all duration-300 hover:scale-105 ${
            gameState.isPaused
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
              : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600'
          } text-white`}
        >
          {gameState.isPaused ? 'ПРОДОЛЖИТЬ' : 'ПАУЗА'}
        </button>
      )}
    </div>
  );
};