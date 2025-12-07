import React from "react";

export function ControlPanel({
   score,
   onRestart,
   disabled,
}: {
   score: number;
   onRestart: () => void;
   disabled: boolean;
}) {
   return (
      <div className="mt-3 flex flex-col items-center">
         <div>Score: {score}</div>
         <button
            onClick={onRestart}
            disabled={disabled}
            className="mt-2 px-3 py-1 bg-gray-800 text-white rounded disabled:opacity-50"
         >
            Restart
         </button>
      </div>
   );
}
