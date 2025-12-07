"use client";

import { createContext, useState, ReactNode, useContext } from "react";
import { IBlocksContext } from "./interfaces/blocks.interface";

const BlocksContext = createContext<IBlocksContext | undefined>(undefined);

interface BlocksProviderProps {
   children: ReactNode;
}

export const BlocksProvider = ({ children }: BlocksProviderProps) => {
   const [board, setBoard] = useState<(string | null)[][]>([]);

   const value: IBlocksContext = {
      board,
      setBoard,
   };
   return (
      <BlocksContext.Provider value={value}>{children}</BlocksContext.Provider>
   );
};

export const useBlocks = () => {
   const context = useContext(BlocksContext);
   if (!context)
      throw new Error("useTheme must be used within a ThemeProvider");
   return context;
};
