import { BoardCell } from "@/types/cell.t";
import React from "react";

interface Props {
  board: BoardCell[][];
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const BoardGrid: React.FC<Props> = ({ board, onClick }) => (
  <div onClick={onClick} className="grid grid-cols-9 gap-[2px]">
    {board.map((row, r) =>
      row.map((cell, c) => (
        <div key={`${r}-${c}`} className={cell === "shake" ? "shake rounded-md" : "rounded-md"} style={{ backgroundColor: cell && cell !== "shake" ? cell : "#2a3881", width: 40, height: 40 }} />
      ))
    )}
  </div>
);

export default BoardGrid;
