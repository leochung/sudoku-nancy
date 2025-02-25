
import React from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sun, Moon, Timer, RefreshCw } from "lucide-react";

interface Props {
  difficulty: string;
  onDifficultyChange: (value: string) => void;
  onNewGame: () => void;
  isPaused: boolean;
  onPauseToggle: () => void;
  time: number;
  theme: string;
  onThemeToggle: () => void;
}

const GameControls: React.FC<Props> = ({
  difficulty,
  onDifficultyChange,
  onNewGame,
  isPaused,
  onPauseToggle,
  time,
  theme,
  onThemeToggle,
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 max-w-[500px] w-full mx-auto mb-6">
      <div className="flex items-center gap-4">
        <Select value={difficulty} onValueChange={onDifficultyChange}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="easy">Easy</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="hard">Hard</SelectItem>
          </SelectContent>
        </Select>
        
        <Button variant="outline" size="icon" onClick={onThemeToggle}>
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-secondary px-3 py-1.5 rounded-md">
          <Timer className="h-4 w-4" />
          <span className="font-medium">{formatTime(time)}</span>
        </div>

        <Button variant="outline" size="icon" onClick={onNewGame}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default GameControls;
