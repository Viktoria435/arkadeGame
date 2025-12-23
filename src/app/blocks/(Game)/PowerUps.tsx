import { PowerUp } from "@/types/blocks.types";

interface PowerUpsProps {
   powerUps: {
      bomb: PowerUp;
      shuffle: PowerUp;
      single: PowerUp;
   };
   onUseBomb: () => void;
   onShuffle: () => void;
   onUseSingle: () => void;
   isBombMode: boolean;
}

export const PowerUps: React.FC<PowerUpsProps> = ({
   powerUps,
   onUseBomb,
   onShuffle,
   onUseSingle,
   isBombMode,
}) => {
   return (
      <div className="bg-transparent flex justify-end rounded-lg">
         <div className="flex flex-col gap-3">
            <button
               onClick={onUseBomb}
               disabled={powerUps.bomb.count <= 0}
               className={`
            flex items-center gap-3 p-3 rounded-lg transition-all
            ${
               isBombMode
                  ? "bg-red-600 ring-2 ring-red-400 scale-105"
                  : powerUps.bomb.count > 0
                  ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 hover:scale-105"
                  : "bg-slate-600 opacity-50 cursor-not-allowed"
            }
          `}
            >
               <span className="text-3xl">💣</span>
               <div className="flex-1 text-left">
                  <div className="text-white font-semibold">Бомба 3×3</div>
                  <div className="text-xs text-slate-200">
                     {powerUps.bomb.count}/{powerUps.bomb.maxCount}
                  </div>
               </div>
            </button>

            <button
               onClick={onShuffle}
               disabled={powerUps.shuffle.count <= 0}
               className={`
            flex items-center gap-3 p-3 rounded-lg transition-all
            ${
               powerUps.shuffle.count > 0
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:scale-105"
                  : "bg-slate-600 opacity-50 cursor-not-allowed"
            }
          `}
            >
               <span className="text-3xl">🔄</span>
               <div className="flex-1 text-left">
                  <div className="text-white font-semibold">Перемешать</div>
                  <div className="text-xs text-slate-200">
                     {powerUps.shuffle.count}/{powerUps.shuffle.maxCount}
                  </div>
               </div>
            </button>

            <button
               onClick={onUseSingle}
               disabled={powerUps.single.count <= 0}
               className={`
            flex items-center gap-3 p-3 rounded-lg transition-all
            ${
               powerUps.single.count > 0
                  ? "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 hover:scale-105"
                  : "bg-slate-600 opacity-50 cursor-not-allowed"
            }
          `}
            >
               <span className="text-3xl">🟪</span>
               <div className="flex-1 text-left">
                  <div className="text-white font-semibold">Одиночный блок</div>
                  <div className="text-xs text-slate-200">
                     {powerUps.single.count}/{powerUps.single.maxCount}
                  </div>
               </div>
            </button>
         </div>
      </div>
   );
};
