import { useState } from "react";
import { Position, DraggingTetromino } from "@/interfaces/blocks.interface";

export const useDragging = () => {
  const [draggingTetromino, setDraggingTetromino] = useState<DraggingTetromino>({ index: null, id: null });
  const [draggingPosition, setDraggingPosition] = useState<Position>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  const [initialPosition, setInitialPosition] = useState<Position>({ x: 0, y: 0 });

  return {
    draggingTetromino,
    setDraggingTetromino,
    draggingPosition,
    setDraggingPosition,
    isDragging,
    setIsDragging,
    dragOffset,
    setDragOffset,
    initialPosition,
    setInitialPosition,
  };
};
