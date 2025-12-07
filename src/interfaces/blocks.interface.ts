export interface Position {
   x: number;
   y: number;
}

export interface DraggingTetromino {
   index: number | null;
   id: number | null;
}

export interface ActionsRemaining {
   singleBlock: number;
   clearCells: number;
   updateTetromino: number;
}
