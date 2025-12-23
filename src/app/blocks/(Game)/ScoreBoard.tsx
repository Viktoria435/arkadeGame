interface ScoreBoardProps {
   score: number;
   highScore: number;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({ score, highScore }) => {
   return (
      <div className="flex gap-4 justify-center">
         <div className="bg-gradient-to-br from-blue-600 to-blue-700 px-6 py-4 rounded-lg shadow-xl text-center min-w-[140px]">
            <div className="text-blue-200 text-sm font-semibold uppercase tracking-wider">
               Очки
            </div>
            <div className="text-white text-3xl font-bold mt-1">{score}</div>
         </div>

         <div className="bg-gradient-to-br from-amber-600 to-amber-700 px-6 py-4 rounded-lg shadow-xl text-center min-w-[140px]">
            <div className="text-amber-200 text-sm font-semibold uppercase tracking-wider">
               Рекорд
            </div>
            <div className="text-white text-3xl font-bold mt-1">
               {highScore}
            </div>
         </div>
      </div>
   );
};
