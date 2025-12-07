"use client";


import React, { forwardRef, CSSProperties, MouseEvent, memo } from 'react';

interface TetrominoProps {
  shape: number[][];
  color: string;
  onMouseDown: (e: MouseEvent<HTMLDivElement>, idx: number, id: number) => void;
  id: number;
  idx: number;
  position: { x: number; y: number };
  isDragging: boolean;
  className?: string;
  style?: CSSProperties;
}

const TetrominoComponent = forwardRef<HTMLDivElement, TetrominoProps>(
  (
    { shape, color, onMouseDown, id, idx, position, isDragging, className = '', style },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`tetromino ${className}`}
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${shape[0].length}, 40px)`,
          gap: '0px',
          position: isDragging ? 'absolute' : 'relative',
          left: isDragging ? `${position.x}px` : '0',
          top: isDragging ? `${position.y}px` : '0',
          zIndex: isDragging ? 1000 : 'auto',
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none',
          border: 'none',
          boxShadow: 'none',
          ...style,
        }}
      >
        {shape.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className="rounded-md"
              onMouseDown={(e) => {
                if (cell) {
                  onMouseDown(e, idx, id);
                }
              }}
              style={{
                backgroundColor: cell ? color : 'transparent',
                border: cell ? '1px solid #ccc' : 'none',
                width: '40px',
                height: '40px',
                boxSizing: 'border-box',
                pointerEvents: cell ? 'auto' : 'none',
              }}
            />
          ))
        )}
      </div>
    );
  }
);

TetrominoComponent.displayName = 'FigureProperties';

const FigureProperties = memo(TetrominoComponent, (prev, next) => {
  return (
    prev.shape === next.shape &&
    prev.color === next.color &&
    prev.isDragging === next.isDragging &&
    prev.position.x === next.position.x &&
    prev.position.y === next.position.y &&
    prev.idx === next.idx &&
    prev.id === next.id &&
    prev.className === next.className &&
    prev.style === next.style
  );
});

FigureProperties.displayName = 'FigureProperties';

export default FigureProperties;
