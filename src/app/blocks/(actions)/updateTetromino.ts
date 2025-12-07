"use client";


export const updateTetromino = (
   setNextTetrominoes: React.Dispatch<React.SetStateAction<(number | null)[]>>,
   tetrominoes: string
) => {
   const newTetrominoes = Array(3)
      .fill(0)
      .map(() => Math.floor(Math.random() * tetrominoes.length));
   setNextTetrominoes(newTetrominoes);
};
