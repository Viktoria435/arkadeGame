'use client';

import React from 'react';

interface ControlsProps {
  onPause: () => void;
  isPaused: boolean;
}

export const Controls: React.FC<ControlsProps> = ({ onPause, isPaused }) => (
  <div className="flex flex-col gap-4">
    <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
      <h3 className="text-cyan-400 text-sm font-bold mb-4 uppercase tracking-wider">Управление</h3>
      <div className="space-y-3 text-sm text-gray-300">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-600/30 border border-purple-500 rounded flex items-center justify-center font-bold text-purple-400">←→</div>
          <span>Движение</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-pink-600/30 border border-pink-500 rounded flex items-center justify-center font-bold text-pink-400">↑</div>
          <span>Поворот</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-cyan-600/30 border border-cyan-500 rounded flex items-center justify-center font-bold text-cyan-400">↓</div>
          <span>Ускорение</span>
        </div>
        {/* <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-600/30 border border-orange-500 rounded flex items-center justify-center font-bold text-orange-400 text-xs">SPC</div>
          <span>Сброс</span>
        </div> */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-600/30 border border-yellow-500 rounded flex items-center justify-center font-bold text-yellow-400 text-xs">P</div>
          <span>Пауза</span>
        </div>
      </div>
    </div>

    <button
      onClick={onPause}
      className={`${
        isPaused ? 'bg-green-600/20 border-green-500 text-green-400' : 'bg-red-600/20 border-red-500 text-red-400'
      } hover:bg-opacity-40 border px-6 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105`}
    >
      {isPaused ? 'Продолжить' : 'Пауза'}
    </button>
  </div>
);