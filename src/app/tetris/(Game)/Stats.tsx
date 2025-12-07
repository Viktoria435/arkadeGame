"use client";

import React from "react";
import type { GameStats } from "@/types/tetris.types";

type StatsProps = GameStats;

export const Stats: React.FC<StatsProps> = ({ score, level, lines }) => (
   <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
      <h3 className="text-cyan-400 text-sm font-bold mb-4 uppercase tracking-wider">
         Статистика
      </h3>
      <div className="space-y-4">
         <div>
            <p className="text-gray-400 text-xs mb-1">Счёт</p>
            <p className="text-white text-3xl font-bold">{score}</p>
         </div>
         <div>
            <p className="text-gray-400 text-xs mb-1">Уровень</p>
            <p className="text-purple-400 text-2xl font-bold">{level}</p>
         </div>
         <div>
            <p className="text-gray-400 text-xs mb-1">Линии</p>
            <p className="text-pink-400 text-2xl font-bold">{lines}</p>
         </div>
      </div>
   </div>
);
