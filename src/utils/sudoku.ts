
// Function to generate a valid Sudoku puzzle
export const generatePuzzle = (difficulty: string): [number[][], boolean[][]] => {
  // For this demo, we'll use a simple preset puzzle
  // In a real implementation, you'd want to generate random valid puzzles
  const puzzle = Array(9).fill(null).map(() => Array(9).fill(null));
  const fixed = Array(9).fill(null).map(() => Array(9).fill(false));
  
  // Number of cells to reveal based on difficulty
  const cellsToReveal = {
    easy: 40,
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

  // Remove numbers based on difficulty
  let cellsToHide = 81 - cellsToReveal;
  while (cellsToHide > 0) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    if (puzzle[row][col] !== null) {
      puzzle[row][col] = null;
      fixed[row][col] = false;
      cellsToHide--;
    }
  }

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
