import { Car } from "@/types/race.types";

interface PlayerCarProps {
   car: Car;
}

export const PlayerCar: React.FC<PlayerCarProps> = ({ car }) => {
   if (!car.isAlive) {
      return (
         <div
            className="absolute flex items-center justify-center text-6xl animate-pulse"
            style={{
               left: car.x - 20,
               top: car.y - 20,
               width: car.width + 40,
               height: car.height + 40,
            }}
         >
            💥
         </div>
      );
   }

   return (
      <div
         className="absolute transition-all duration-75"
         style={{
            left: car.x,
            top: car.y,
            width: car.width,
            height: car.height,
         }}
      >
         <div className="relative w-full h-full">
            <div
               className="absolute inset-0 rounded-lg shadow-lg"
               style={{ backgroundColor: car.color }}
            >
               <div
                  className="absolute left-1/4 top-2 w-1/2 h-1/3 rounded-t-lg opacity-80"
                  style={{
                     backgroundColor:
                        car.id === "player1" ? "#1e40af" : "#7f1d1d",
                  }}
               />
               <div className="absolute left-1/4 top-2 w-1/2 h-1/4 bg-cyan-200 rounded-t-lg opacity-70" />
               <div className="absolute bottom-1 left-1 w-2 h-2 bg-yellow-300 rounded-full" />
               <div className="absolute bottom-1 right-1 w-2 h-2 bg-yellow-300 rounded-full" />
            </div>
         </div>
      </div>
   );
};
