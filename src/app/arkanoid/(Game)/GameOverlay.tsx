import { GameState } from "@/types/arkanoid.types";

interface GameOverlayProps {
   gameState: GameState;
   score: number;
   onStart: () => void;
   onRestart: () => void;
}

export const GameOverlay: React.FC<GameOverlayProps> = ({
   gameState,
   score,
   onStart,
   onRestart,
}) => {
   if (gameState === GameState.START) {
      return (
         <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-lg">
            <div className="text-center">
               <button
                  onClick={onStart}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-lg text-xl font-semibold hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all shadow-lg"
               >
                  Начать игру
               </button>
            </div>
         </div>
      );
   }

   if (gameState === GameState.PAUSED) {
      return (
         <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-lg">
            <div className="text-center">
               <h2 className="text-4xl font-bold text-white mb-4">ПАУЗА</h2>
               <p className="text-slate-300">Нажмите P для продолжения</p>
            </div>
         </div>
      );
   }

   if (gameState === GameState.GAME_OVER) {
      return (
         <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-lg">
            <div className="text-center">
               <h2 className="text-5xl font-bold text-red-500 mb-4">
                  ИГРА ОКОНЧЕНА
               </h2>
               <p className="text-2xl text-white mb-6">
                  Финальный счёт: {score}
               </p>
               <button
                  onClick={onRestart}
                  className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-8 py-4 rounded-lg text-xl font-semibold hover:from-red-600 hover:to-pink-700 transform hover:scale-105 transition-all shadow-lg"
               >
                  Играть снова
               </button>
            </div>
         </div>
      );
   }

   if (gameState === GameState.WON) {
      return (
         <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-lg">
            <div className="text-center">
               <h2 className="text-5xl font-bold text-green-400 mb-4">
                  🎉 ПОБЕДА! 🎉
               </h2>
               <p className="text-2xl text-white mb-6">Счёт: {score}</p>
               <button
                  onClick={onRestart}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-lg text-xl font-semibold hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 transition-all shadow-lg"
               >
                  Следующий уровень
               </button>
            </div>
         </div>
      );
   }

   return null;
};
