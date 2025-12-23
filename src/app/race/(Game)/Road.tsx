import { GAME_CONFIG } from "@/types/race.types";

interface RoadProps {
   offset: number;
   startX: number;
   playerColor: string;
}

export const Road: React.FC<RoadProps> = ({ offset, startX, playerColor }) => {
   const laneWidth = GAME_CONFIG.ROAD_WIDTH / GAME_CONFIG.LANE_COUNT;

   return (
      <div
         className="absolute"
         style={{
            left: startX,
            width: GAME_CONFIG.ROAD_WIDTH,
            height: "100%",
         }}
      >
         <div className="absolute inset-0 bg-gray-700">
            {Array.from({ length: GAME_CONFIG.LANE_COUNT - 1 }).map((_, i) => (
               <div
                  key={i}
                  className="absolute w-1 bg-white"
                  style={{
                     left: (i + 1) * laneWidth - 0.5,
                     height: "100%",
                  }}
               >
                  <div className="relative h-full">
                     {Array.from({ length: 20 }).map((_, j) => (
                        <div
                           key={j}
                           className="absolute w-full bg-white"
                           style={{
                              height: "30px",
                              top: `${
                                 (j * 60 + offset) % GAME_CONFIG.CANVAS_HEIGHT
                              }px`,
                           }}
                        />
                     ))}
                  </div>
               </div>
            ))}
            <div
               className="absolute left-0 w-2 h-full"
               style={{ backgroundColor: playerColor }}
            />
            <div
               className="absolute right-0 w-2 h-full"
               style={{ backgroundColor: playerColor }}
            />
         </div>
      </div>
   );
};
