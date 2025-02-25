
import React from 'react';
import { cn } from "@/lib/utils";

interface Props {
  onNumberClick: (number: number) => void;
  onErase: () => void;
  selectedNumber: number | null;
}

const NumberPad: React.FC<Props> = ({ onNumberClick, onErase, selectedNumber }) => {
  return (
    <div className="grid grid-cols-5 gap-2 max-w-[400px] w-full mx-auto mt-6">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
        <button
          key={number}
          onClick={() => onNumberClick(number)}
          className={cn(
            "number-button",
            "bg-secondary text-secondary-foreground",
            selectedNumber === number && "bg-primary text-primary-foreground"
          )}
        >
          {number}
        </button>
      ))}
      <button
        onClick={onErase}
        className="number-button bg-destructive text-destructive-foreground hover:bg-destructive/90"
      >
        ✕
      </button>
    </div>
  );
};

export default NumberPad;
