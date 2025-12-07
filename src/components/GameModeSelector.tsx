import React from "react";

type GameMode = "keyboard" | "voice" | null;

interface GameModeSelectorProps {
   onSelectMode: (mode: GameMode) => void;
   volumeLevel?: number;
   isListening?: boolean;
}

export default function GameModeSelector({
   onSelectMode,
   volumeLevel = 0,
   isListening = false,
}: GameModeSelectorProps) {
   return (
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-blue-400 to-blue-600">
         <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
            <h1 className="text-4xl font-bold text-center mb-2 text-gray-800">
               🐦 Flappy Bird
            </h1>
            <p className="text-center text-gray-600 mb-8">
               Выберите режим управления
            </p>

            <div className="space-y-4">
               <button
                  onClick={() => onSelectMode("keyboard")}
                  className="w-full bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-bold py-6 px-6 rounded-xl shadow-lg transform transition hover:scale-105 active:scale-95"
               >
                  <div className="flex items-center justify-center gap-3">
                     <span className="text-3xl">⌨️</span>
                     <div className="text-left">
                        <div className="text-xl">Клавиатура</div>
                        <div className="text-sm opacity-90">
                           Нажимайте любую клавишу или кликайте мышью
                        </div>
                     </div>
                  </div>
               </button>

               <button
                  onClick={() => onSelectMode("voice")}
                  className="w-full bg-gradient-to-r from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700 text-white font-bold py-6 px-6 rounded-xl shadow-lg transform transition hover:scale-105 active:scale-95"
               >
                  <div className="flex items-center justify-center gap-3">
                     <span className="text-3xl">🎤</span>
                     <div className="text-left">
                        <div className="text-xl">Голос</div>
                        <div className="text-sm opacity-90">
                           Управляйте громкостью звука
                        </div>
                     </div>
                  </div>
               </button>
            </div>

            {isListening && (
               <div className="mt-6 p-4 bg-purple-100 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                     <span className="text-sm font-medium text-purple-800">
                        🎤 Микрофон активен
                     </span>
                     <span className="text-xs text-purple-600">
                        {Math.round(volumeLevel)}
                     </span>
                  </div>
                  <div className="w-full bg-purple-200 rounded-full h-3 overflow-hidden">
                     <div
                        className="bg-gradient-to-r from-purple-400 to-purple-600 h-full transition-all duration-100 rounded-full"
                        style={{
                           width: `${Math.min((volumeLevel / 120) * 100, 100)}%`,
                        }}
                     />
                  </div>
                  <p className="text-xs text-purple-600 mt-2 text-center">
                     Чем громче звук, тем выше птица летит
                  </p>
               </div>
            )}

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
               <h3 className="font-bold text-blue-800 mb-2 text-center">
                  📖 Как играть
               </h3>
               <ul className="text-sm text-blue-700 space-y-1">
                  <li>🎯 Пролетайте между трубами</li>
                  <li>⚡ С каждым уровнем скорость растет</li>
                  <li>🏆 Набирайте максимальный счет</li>
               </ul>
            </div>
         </div>
      </div>
   );
}