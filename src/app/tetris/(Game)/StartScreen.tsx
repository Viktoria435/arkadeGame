'use client';

import React from 'react';

interface StartScreenProps {
  onStart: () => void;
  score: number;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart, score }) => (
  <div className="relative z-10 flex flex-col items-center gap-8 p-12 bg-black/40 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl">
    <div className="text-center">
      <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-4 animate-pulse">
        TETRIS
      </h1>
      <p className="text-gray-300 text-lg">Классическая головоломка</p>
      {score > 0 && (
        <div className="mt-6 p-4 bg-white/10 rounded-xl">
          <p className="text-gray-400 text-sm">Ваш счёт</p>
          <p className="text-white text-4xl font-bold">{score}</p>
        </div>
      )}
    </div>
    
    <button
      onClick={onStart}
      className="group relative px-12 py-5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-2xl font-bold rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-110 hover:shadow-2xl"
    >
      <span className="relative z-10">{score > 0 ? 'Играть снова' : 'Начать игру'}</span>
      <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>

    <div className="flex gap-8 text-gray-300 text-sm flex-wrap justify-center">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-purple-500 rounded flex items-center justify-center font-bold">←</div>
        <div className="w-8 h-8 bg-purple-500 rounded flex items-center justify-center font-bold">→</div>
        <span>Движение</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-pink-500 rounded flex items-center justify-center font-bold">↑</div>
        <span>Поворот</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-cyan-500 rounded flex items-center justify-center font-bold">↓</div>
        <span>Ускорение</span>
      </div>
    </div>
  </div>
);