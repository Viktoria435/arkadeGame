import React from "react";
import FigureProperties from "../(tetromino)/figureProperties";

interface Props {
   nextTetrominoes: (number | null)[];
   colors: string[];
   tetrominoes: number[][][];
   onMouseDown: (
      e: React.MouseEvent<HTMLDivElement>,
      idx: number,
      id: number
   ) => void;
}

const NextTetrominoes: React.FC<Props> = ({
   nextTetrominoes,
   colors,
   tetrominoes,
   onMouseDown,
}) => (
   <div
      style={{
         display: "grid",
         gridTemplateColumns: "repeat(3, 100px)",
         gap: 20,
         justifyItems: "center",
      }}
   >
      {nextTetrominoes.map((tetrominoIndex, idx) =>
         tetrominoIndex !== null ? (
            <FigureProperties
               key={idx}
               id={tetrominoIndex}
               idx={idx}
               shape={tetrominoes[tetrominoIndex]}
               color={colors[tetrominoIndex]}
               onMouseDown={onMouseDown}
               position={{ x: idx * 100, y: 0 }}
               isDragging={false}
            />
         ) : null
      )}
   </div>
);

export default NextTetrominoes;
