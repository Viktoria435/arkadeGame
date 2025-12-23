import { Car } from "@/types/race.types";

interface PlayerHUDProps {
   player: Car;
   playerNumber: 1 | 2;
   distance: number;
   speed: number;
}

export const PlayerHUD: React.FC<PlayerHUDProps> = ({
   player,
   playerNumber,
}) => {
   const isLeft = playerNumber === 1;

   return (
      <div className={`absolute top-4 ${isLeft ? "left-4" : "right-4"} z-10`}>
         <div className="bg-black/70 p-3 rounded-lg min-w-[140px]">
            <div
               className="text-center font-bold text-sm mb-2 pb-2 border-b"
               style={{
                  color: player.color,
                  borderColor: player.color + "40",
               }}
            >
               ИГРОК {playerNumber}
            </div>
            <div className="text-center mb-2">
               {player.isAlive ? (
                  <span className="text-green-400 text-xs font-semibold">
                     ✓ ЖИВ
                  </span>
               ) : (
                  <span className="text-red-400 text-xs font-semibold">
                     💥 РАЗБИЛСЯ
                  </span>
               )}
            </div>
            <div className="mb-2">
               <div className="text-yellow-400 text-xs font-semibold">ОЧКИ</div>
               <div className="text-white text-xl font-bold">
                  {player.score}
               </div>
            </div>
            <div className="mb-2">
               <div className="text-yellow-300 text-xs font-semibold">
                  МОНЕТЫ
               </div>
               <div className="text-white text-lg font-bold">
                  🪙 {player.coins}
               </div>
            </div>
            <div className="mt-3 pt-2 border-t border-gray-600 text-xs text-slate-400">
               {isLeft ? "← A | D →" : "← ← | → →"}
            </div>
         </div>
      </div>
   );
};
