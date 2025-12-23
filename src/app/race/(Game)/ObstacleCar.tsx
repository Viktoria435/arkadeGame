import { Obstacle } from "@/types/race.types";

interface ObstacleCarProps {
   obstacle: Obstacle;
}

export const ObstacleCar: React.FC<ObstacleCarProps> = ({ obstacle }) => {
   const getObstacleContent = () => {
      switch (obstacle.type) {
         case "car":
            return (
               <div className="absolute inset-0 bg-yellow-600 rounded-lg shadow-lg">
                  <div className="absolute left-1/4 bottom-2 w-1/2 h-1/3 bg-yellow-800 rounded-b-lg" />
                  <div className="absolute left-1/4 bottom-2 w-1/2 h-1/4 bg-cyan-200 rounded-b-lg opacity-70" />
                  <div className="absolute top-1 left-1 w-2 h-2 bg-red-400 rounded-full" />
                  <div className="absolute top-1 right-1 w-2 h-2 bg-red-400 rounded-full" />
               </div>
            );
         case "tree":
            return (
               <div className="flex items-center justify-center text-5xl">
                  🌳
               </div>
            );
         case "cone":
            return (
               <div className="flex items-center justify-center text-4xl">
                  🚧
               </div>
            );
      }
   };

   return (
      <div
         className="absolute"
         style={{
            left: obstacle.x,
            top: obstacle.y,
            width: obstacle.width,
            height: obstacle.height,
         }}
      >
         {getObstacleContent()}
      </div>
   );
};
