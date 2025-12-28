import { Tetromino } from "@/types/blocks.types";

interface TetrominoPreviewProps {
   tetromino: Tetromino;
   isSelected: boolean;
   onSelect: () => void;
   disabled?: boolean;
}

export const TetrominoPreview: React.FC<TetrominoPreviewProps> = ({
   tetromino,
   isSelected,
   onSelect,
   disabled = false,
}) => {
   const { shape, color } = tetromino;

   return (
      <button
         onClick={onSelect}
         disabled={disabled}
         className={`
      p-2 w-35 bg-black/30 rounded-lg transition-all duration-200
        ${
           isSelected
              ? "ring-4 ring-blue-500 scale-105 bg-slate-600"
              : "hover:bg-slate-600"
        }
        ${
           disabled
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer hover:scale-105"
        }
        shadow-lg
      `}
      >
         <div className="flex flex-col gap-1">
            {shape.map((row, rowIndex) => (
               <div key={rowIndex} className="flex gap-1">
                  {row.map((cell, colIndex) => (
                     <div
                        key={`${rowIndex}-${colIndex}`}
                        className={`
                  w-6 h-6 sm:w-8 sm:h-8 rounded transition-all
                  ${cell ? "" : "opacity-0"}
                `}
                        style={{
                           backgroundColor: cell ? color : "transparent",
                           boxShadow: cell ? `0 2px 4px ${color}60` : undefined,
                        }}
                     />
                  ))}
               </div>
            ))}
         </div>
      </button>
   );
};
