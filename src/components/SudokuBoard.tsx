
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

  return (
    <div className="grid grid-cols-3 gap-0 border-2 border-primary rounded-lg overflow-hidden aspect-square max-w-[500px] w-full mx-auto">
      {[0, 1, 2].map((blockRow) => (
        <div key={blockRow} className="grid grid-cols-3">
          {[0, 1, 2].map((blockCol) => (
            <div key={`${blockRow}-${blockCol}`} className="grid-3x3 grid grid-cols-3">
              {[0, 1, 2].map((cellRow) => (
                Array(3).fill(null).map((_, cellCol) => {
                  const row = blockRow * 3 + cellRow;
                  const col = blockCol * 3 + cellCol;
                  const value = puzzle[row][col];
                  
                  return (
                    <button
                      key={`${row}-${col}`}
                      onClick={() => onCellClick(row, col)}
                      className={cn(
                        "sudoku-cell",
                        isHighlighted(row, col) && "sudoku-cell-highlight",
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
          ))}
        </div>
      ))}
    </div>
  );
};

export default SudokuBoard;
