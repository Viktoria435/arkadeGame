'use client';

import React from 'react';
import type { Tetromino } from '@/types/tetris.types';

interface NextPiecePreviewProps {
  piece: Tetromino | null;
}

export const NextPiecePreview: React.FC<NextPiecePreviewProps> = ({ piece }) => {
  if (!piece) return null;

  return (
    <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
      <h3 className="text-cyan-400 text-sm font-bold mb-4 uppercase tracking-wider">Следующая</h3>
      <div className="w-24 h-24 bg-gray-900/50 rounded-lg flex items-center justify-center">
        <div 
          className="grid gap-1"
          style={{
            gridTemplateColumns: `repeat(${piece.shape[0].length}, 1fr)`
          }}
        >
          {piece.shape.flat().map((cell, i) => (
            <div 
              key={i} 
              className={`w-4 h-4 rounded-sm ${
                cell ? `${piece.color} ${piece.shadow} shadow-lg` : 'bg-transparent'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};