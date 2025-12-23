interface CenterHUDProps {
   speed: number;
   distance: number;
}

export const CenterHUD: React.FC<CenterHUDProps> = ({ speed, distance }) => {
   return (
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
         <div className="bg-black/70 p-3 rounded-lg">
            <div className="text-center mb-2">
               <div className="text-cyan-400 text-xs font-semibold">
                  СКОРОСТЬ
               </div>
               <div className="text-white text-xl font-bold">
                  {Math.round(speed * 20)} км/ч
               </div>
            </div>

            <div className="text-center">
               <div className="text-green-400 text-xs font-semibold">
                  ДИСТАНЦИЯ
               </div>
               <div className="text-white text-lg font-bold">
                  {Math.round(distance)} м
               </div>
            </div>
         </div>
      </div>
   );
};
