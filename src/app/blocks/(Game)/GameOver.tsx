interface GameOverProps {
  score: number;
  highScore: number;
  onRestart: () => void;
}

export const GameOver: React.FC<GameOverProps> = ({ score, highScore, onRestart }) => {
  const isNewRecord = score === highScore && score > 0;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 border-2 border-slate-700">
        <div className="text-center">
          <div className="text-6xl mb-4">😢</div>
          <h2 className="text-4xl font-bold text-white mb-2">Игра окончена!</h2>
          
          {isNewRecord && (
            <div className="mb-4">
              <div className="text-5xl mb-2">🎉</div>
              <p className="text-2xl font-bold text-yellow-400 animate-pulse">
                Новый рекорд!
              </p>
            </div>
          )}

          <div className="my-6 p-4 bg-slate-700 rounded-lg">
            <p className="text-slate-300 text-sm mb-2">Ваш счёт</p>
            <p className="text-5xl font-bold text-white">{score}</p>
          </div>

          <div className="mb-6 p-3 bg-slate-700 rounded-lg">
            <p className="text-slate-400 text-xs mb-1">Лучший результат</p>
            <p className="text-2xl font-bold text-amber-400">{highScore}</p>
          </div>

          <button
            onClick={onRestart}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-lg text-xl transition-all transform hover:scale-105 shadow-lg"
          >
            🔄 Играть снова
          </button>

          <p className="text-slate-400 text-sm mt-4">
            Нет места для новых фигур
          </p>
        </div>
      </div>
    </div>
  );
};