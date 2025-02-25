
import React from 'react';
import { cn } from "@/lib/utils";

interface Props {
  puzzle: (number | null)[][];
  selectedCell: [number, number] | null;
  onCellClick: (row: number, col: number) => void;
  fixedNumbers: boolean[][];
}

const SudokuBoard: React.FC<Props> = ({
  puzzle,
  selectedCell,
  onCellClick,
  fixedNumbers,
}) => {
  const isHighlighted = (row: number, col: number) => {
    if (!selectedCell) return false;
    const [selRow, selCol] = selectedCell;
    return row === selRow || col === selCol;
  };

  const getBlockBorder = (row: number, col: number) => {
    const isRightBorder = (col + 1) % 3 === 0 && col !== 8;
    const isBottomBorder = (row + 1) % 3 === 0 && row !== 8;
    
    return cn(
      "border border-border/50",
      isRightBorder && "border-r-2 border-r-primary",
      isBottomBorder && "border-b-2 border-b-primary"
    );
  };

  return (
    <div className="grid grid-cols-9 border-2 border-primary rounded-lg overflow-hidden aspect-square max-w-[500px] w-full mx-auto">
      {Array(9).fill(null).map((_, row) => (
        Array(9).fill(null).map((_, col) => {
          const value = puzzle[row][col];
          return (
            <button
              key={`${row}-${col}`}
              onClick={() => onCellClick(row, col)}
              className={cn(
                "aspect-square flex items-center justify-center text-lg font-medium",
                getBlockBorder(row, col),
                isHighlighted(row, col) && "bg-primary/5",
                fixedNumbers[row][col] && "font-bold",
                selectedCell?.[0] === row && selectedCell?.[1] === col && 
                "bg-primary/10"
              )}
              disabled={fixedNumbers[row][col]}
            >
              {value || ""}
            </button>
          );
        })
      ))}
    </div>
  );
};

export default SudokuBoard;
