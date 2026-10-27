export type SudokuCell = number | null;
export type SudokuGrid = SudokuCell[][];
export type SudokuDifficulty = 'easy' | 'medium' | 'hard';

interface GeneratedSudoku {
  puzzle: SudokuGrid;
  solution: SudokuGrid;
}

export async function generateSudoku(difficulty: SudokuDifficulty): Promise<GeneratedSudoku> {
  const apiKey = process.env.EXPO_PUBLIC_API_NINJAS_KEY;
  if (!apiKey) {
    throw new Error('Missing EXPO_PUBLIC_API_NINJAS_KEY. Add your API Ninjas key to .env.');
  }

  const response = await fetch(
    `https://api.api-ninjas.com/v1/sudokugenerate?difficulty=${difficulty}`,
    { headers: { 'X-Api-Key': apiKey } }
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Sudoku API error (${response.status}): ${body}`);
  }

  const data = await response.json();
  return { puzzle: data.puzzle, solution: data.solution };
}
