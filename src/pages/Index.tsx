
import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import SudokuBoard from '@/components/SudokuBoard';
import NumberPad from '@/components/NumberPad';
import GameControls from '@/components/GameControls';
import { generatePuzzle } from '@/utils/sudoku';
import { Github } from 'lucide-react';

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
  }, [difficulty]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (!isPaused) {
      interval = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPaused]);

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
        <div className="flex items-center justify-center gap-4">
          <a
            href="https://twitter.com/leo_chung"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link text-sm"
          >
            Follow on Twitter
          </a>
          <a
            href="https://github.com/sponsors/leochung"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link text-sm"
          >
            Support my work
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Index;
