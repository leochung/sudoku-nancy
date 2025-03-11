import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import SudokuBoard from '@/components/SudokuBoard';
import NumberPad from '@/components/NumberPad';
import GameControls from '@/components/GameControls';
import { generatePuzzle } from '@/utils/sudoku';
import { Github } from 'lucide-react';
import { toast } from 'sonner';

const Index = () => {
  // Initialize with a 9x9 array of nulls
  const initialPuzzle = Array(9).fill(null).map(() => Array(9).fill(null));
  const initialFixed = Array(9).fill(null).map(() => Array(9).fill(false));

  const [puzzle, setPuzzle] = useState<(number | null)[][]>(initialPuzzle);
  const [fixedNumbers, setFixedNumbers] = useState<boolean[][]>(initialFixed);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [difficulty, setDifficulty] = useState('medium');
  const [time, setTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const { theme, setTheme } = useTheme();

  // Generate puzzle immediately on mount
  useEffect(() => {
    const [newPuzzle, newFixed] = generatePuzzle(difficulty);
    setPuzzle(newPuzzle);
    setFixedNumbers(newFixed);
    setSelectedCell(null);
    setSelectedNumber(null);
    setTime(0);
    setIsPaused(false);
    setIsSolved(false);
  }, [difficulty]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (!isPaused && !isSolved) {
      interval = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPaused, isSolved]);

  const handleCellClick = (row: number, col: number) => {
    if (!fixedNumbers[row][col]) {
      setSelectedCell([row, col]);
      setSelectedNumber(puzzle[row][col]);
    }
  };

  const handleNumberClick = (number: number) => {
    if (selectedCell) {
      const [row, col] = selectedCell;
      if (!fixedNumbers[row][col]) {
        const newPuzzle = puzzle.map((r) => [...r]);
        newPuzzle[row][col] = number;
        setPuzzle(newPuzzle);
        setSelectedNumber(number);
        
        // Check if the puzzle is solved after updating
        checkIfPuzzleIsSolved(newPuzzle);
      }
    }
  };

  const handleErase = () => {
    if (selectedCell) {
      const [row, col] = selectedCell;
      if (!fixedNumbers[row][col]) {
        const newPuzzle = puzzle.map((r) => [...r]);
        newPuzzle[row][col] = null;
        setPuzzle(newPuzzle);
        setSelectedNumber(null);
      }
    }
  };

  const startNewGame = () => {
    const [newPuzzle, newFixed] = generatePuzzle(difficulty);
    setPuzzle(newPuzzle);
    setFixedNumbers(newFixed);
    setSelectedCell(null);
    setSelectedNumber(null);
    setTime(0);
    setIsPaused(false);
    setIsSolved(false);
  };

  const checkIfPuzzleIsSolved = (currentPuzzle: (number | null)[][]) => {
    // Check if there are any empty cells
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (currentPuzzle[i][j] === null) {
          return false;
        }
      }
    }

    // Check rows
    for (let row = 0; row < 9; row++) {
      const seen = new Set();
      for (let col = 0; col < 9; col++) {
        seen.add(currentPuzzle[row][col]);
      }
      if (seen.size !== 9) return false;
    }

    // Check columns
    for (let col = 0; col < 9; col++) {
      const seen = new Set();
      for (let row = 0; row < 9; row++) {
        seen.add(currentPuzzle[row][col]);
      }
      if (seen.size !== 9) return false;
    }

    // Check 3x3 boxes
    for (let boxRow = 0; boxRow < 3; boxRow++) {
      for (let boxCol = 0; boxCol < 3; boxCol++) {
        const seen = new Set();
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            seen.add(currentPuzzle[boxRow * 3 + i][boxCol * 3 + j]);
          }
        }
        if (seen.size !== 9) return false;
      }
    }

    // If we get here, the puzzle is solved
    setIsSolved(true);
    
    // Display a congratulations message
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    toast.success("Congratulations!", {
      description: `You solved the ${difficulty} puzzle in ${timeString}!`,
      duration: 5000,
    });
    
    return true;
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-[500px] mb-12">
        <GameControls
          difficulty={difficulty}
          onDifficultyChange={setDifficulty}
          onNewGame={startNewGame}
          isPaused={isPaused}
          onPauseToggle={() => setIsPaused(!isPaused)}
          time={time}
          theme={theme || 'light'}
          onThemeToggle={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        />

        <div className="relative">
          {isPaused && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center">
              <p className="text-2xl font-medium">Paused</p>
            </div>
          )}
          <SudokuBoard
            puzzle={puzzle}
            selectedCell={selectedCell}
            onCellClick={handleCellClick}
            fixedNumbers={fixedNumbers}
          />
        </div>

        <NumberPad
          onNumberClick={handleNumberClick}
          onErase={handleErase}
          selectedNumber={selectedNumber}
        />
      </div>

      <footer className="mt-auto text-center space-y-2">
        <p className="text-sm text-muted-foreground">
          Created by{" "}
          <a
            href="https://twitter.com/leo_chung"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            Leo Chung
          </a>
        </p>
      </footer>
    </div>
  );
};

export default Index;
