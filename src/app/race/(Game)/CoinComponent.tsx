import { Coin } from "@/types/race.types";

interface CoinComponentProps {
   coin: Coin;
}

export const CoinComponent: React.FC<CoinComponentProps> = ({ coin }) => {
   if (coin.collected) return null;

   return (
      <div
         className="absolute flex items-center justify-center text-2xl"
         style={{
            left: coin.x,
            top: coin.y,
            width: coin.size,
            height: coin.size,
            animation: "spin 2s linear infinite",
         }}
      >
         🪙
      </div>
   );
};
