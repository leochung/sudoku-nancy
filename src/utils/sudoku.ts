
// Function to generate a valid Sudoku puzzle
export const generatePuzzle = (difficulty: string): [number[][], boolean[][]] => {
  // Create an empty puzzle
  const puzzle = Array(9).fill(null).map(() => Array(9).fill(null));
  const fixed = Array(9).fill(null).map(() => Array(9).fill(false));
  
  // Number of cells to reveal based on difficulty
  const cellsToReveal = {
    easy: 38,
    medium: 30,
    hard: 25,
  }[difficulty];

  // Fill diagonal blocks (which are independent of each other)
  for (let i = 0; i < 9; i += 3) {
    fillBlock(puzzle, i, i);
  }

  // Fill the rest of the puzzle
  solveSudoku(puzzle);

  // Create a copy of the solved puzzle
  const solution = puzzle.map(row => [...row]);

  // Remove numbers based on difficulty using a strategy that ensures uniqueness
  removeNumbersWithUniqueSolution(puzzle, 81 - cellsToReveal);

  // Mark remaining numbers as fixed
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (puzzle[i][j] !== null) {
        fixed[i][j] = true;
      }
    }
  }

  return [puzzle, fixed];
};

// Helper function to fill a 3x3 block with random numbers
const fillBlock = (puzzle: number[][], startRow: number, startCol: number) => {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const randomIndex = Math.floor(Math.random() * numbers.length);
      puzzle[startRow + i][startCol + j] = numbers[randomIndex];
      numbers.splice(randomIndex, 1);
    }
  }
};

// Helper function to check if a number can be placed in a cell
const isValid = (puzzle: number[][], row: number, col: number, num: number): boolean => {
  // Check row
  for (let x = 0; x < 9; x++) {
    if (puzzle[row][x] === num) return false;
  }

  // Check column
  for (let x = 0; x < 9; x++) {
    if (puzzle[x][col] === num) return false;
  }

  // Check 3x3 box
  const startRow = row - (row % 3), startCol = col - (col % 3);
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (puzzle[i + startRow][j + startCol] === num) return false;
    }
  }

  return true;
};

// Helper function to solve the Sudoku puzzle
const solveSudoku = (puzzle: number[][]): boolean => {
  let row = 0, col = 0, isEmpty = false;
  
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (puzzle[i][j] === null) {
        row = i;
        col = j;
        isEmpty = true;
        break;
      }
    }
    if (isEmpty) break;
  }

  if (!isEmpty) return true;

  for (let num = 1; num <= 9; num++) {
    if (isValid(puzzle, row, col, num)) {
      puzzle[row][col] = num;
      if (solveSudoku(puzzle)) return true;
      puzzle[row][col] = null;
    }
  }

  return false;
};

// Count the number of solutions for a given puzzle
const countSolutions = (puzzle: number[][]): number => {
  // Make a copy of the puzzle to avoid modifying the original
  const puzzleCopy = puzzle.map(row => [...row]);
  let count = 0;
  
  // Find an empty cell
  let row = -1, col = -1;
  for (let i = 0; i < 9 && row === -1; i++) {
    for (let j = 0; j < 9; j++) {
      if (puzzleCopy[i][j] === null) {
        row = i;
        col = j;
        break;
      }
    }
  }
  
  // If no empty cell found, we have a solution
  if (row === -1) return 1;
  
  // Try each number in the empty cell
  for (let num = 1; num <= 9; num++) {
    if (isValid(puzzleCopy, row, col, num)) {
      puzzleCopy[row][col] = num;
      count += countSolutions(puzzleCopy);
      // If we've found more than one solution, no need to continue
      if (count > 1) return count;
      puzzleCopy[row][col] = null;
    }
  }
  
  return count;
};

// Remove numbers while ensuring a unique solution
const removeNumbersWithUniqueSolution = (puzzle: number[][], cellsToRemove: number) => {
  const cells: [number, number][] = [];
  
  // Create a list of all cells with numbers
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      cells.push([i, j]);
    }
  }
  
  // Shuffle the cells to ensure random removal
  shuffleArray(cells);
  
  // Try to remove numbers while maintaining a unique solution
  for (let i = 0; i < cells.length && cellsToRemove > 0; i++) {
    const [row, col] = cells[i];
    const temp = puzzle[row][col];
    puzzle[row][col] = null;
    
    // Count the number of solutions
    const numSolutions = countSolutions(puzzle);
    
    // If there are multiple solutions, put the number back
    if (numSolutions !== 1) {
      puzzle[row][col] = temp;
    } else {
      cellsToRemove--;
    }
  }
};

// Fisher-Yates shuffle algorithm
const shuffleArray = <T>(array: T[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};
