export interface IBlocksContext {
    board: (string | null)[][];
    setBoard: React.Dispatch<React.SetStateAction<(string | null)[][]>>;
}
