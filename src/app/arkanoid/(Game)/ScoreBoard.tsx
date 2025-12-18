interface ScoreBoardProps {
   score: number;
   lives: number;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({ score, lives }) => {
   return (
      <div className="flex gap-8 text-white text-xl font-semibold">
         <div className="bg-slate-800/50 px-6 py-3 rounded-lg backdrop-blur-sm border border-slate-600">
            Очки: <span className="text-yellow-400">{score}</span>
         </div>
         <div className="bg-slate-800/50 px-6 py-3 rounded-lg backdrop-blur-sm border border-slate-600">
            Жизни: <span className="text-red-400">{"❤️".repeat(lives)}</span>
         </div>
      </div>
   );
};
