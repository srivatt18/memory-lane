export type CrosswordDifficulty = 'easy' | 'medium' | 'hard';

export interface CrosswordClue {
  number: number;
  clue: string;
  answer: string;
  length?: number;
  row?: number;
  col?: number;
}

export interface GeneratedCrossword {
  size: number;
  difficulty: CrosswordDifficulty;
  grid: (string | null)[][]; // Uppercase solution letter or null for black cells
  across: CrosswordClue[];
  down: CrosswordClue[];
}

export interface CellInfo {
  solution: string | null;
  number?: number;
  acrossNumber?: number;
  downNumber?: number;
}

// Built-in fallback puzzle for offline / quota safety
const FALLBACK_PUZZLE: GeneratedCrossword = {
  size: 7,
  difficulty: 'easy',
  grid: [
    ['P', 'E', 'A', 'C', 'E', null, null],
    ['L', null, 'L', null, 'A', null, null],
    ['A', null, 'O', null, 'R', 'A', 'N'],
    ['N', 'O', 'T', 'E', 'T', null, null],
    ['T', null, 'E', null, 'H', 'E', 'N'],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
  ],
  across: [
    { number: 1, clue: 'Freedom from disturbance and tranquil calm', answer: 'PEACE', length: 5 },
    { number: 4, clue: 'Moved swiftly on foot (past tense)', answer: 'RAN', length: 3 },
    { number: 5, clue: 'Brief written record or musical pitch', answer: 'NOTE', length: 4 },
    { number: 6, clue: 'Female chicken', answer: 'HEN', length: 3 },
  ],
  down: [
    { number: 1, clue: 'Living organism such as a flower or shrub', answer: 'PLANT', length: 5 },
    { number: 2, clue: 'A large amount or quantity', answer: 'ALOT', length: 4 },
    { number: 3, clue: 'Our home planet', answer: 'EARTH', length: 5 },
  ],
};

// Annotate grid cells with clue numbers and associations
export function analyzeCrossword(puzzle: GeneratedCrossword) {
  const rows = puzzle.grid.length;
  const cols = puzzle.grid[0].length;

  const cellMap: CellInfo[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({ solution: null }))
  );

  let currentNumber = 1;
  const acrossClueMap = new Map<number, CrosswordClue>();
  const downClueMap = new Map<number, CrosswordClue>();

  puzzle.across.forEach((clue) => acrossClueMap.set(clue.number, clue));
  puzzle.down.forEach((clue) => downClueMap.set(clue.number, clue));

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const char = puzzle.grid[r][c];
      if (!char) continue;

      cellMap[r][c].solution = char.toUpperCase();

      const startsAcross =
        (c === 0 || puzzle.grid[r][c - 1] === null) &&
        c + 1 < cols &&
        puzzle.grid[r][c + 1] !== null;

      const startsDown =
        (r === 0 || puzzle.grid[r - 1][c] === null) &&
        r + 1 < rows &&
        puzzle.grid[r + 1][c] !== null;

      if (startsAcross || startsDown) {
        cellMap[r][c].number = currentNumber;

        if (startsAcross && acrossClueMap.has(currentNumber)) {
          const clue = acrossClueMap.get(currentNumber)!;
          clue.row = r;
          clue.col = c;
        }

        if (startsDown && downClueMap.has(currentNumber)) {
          const clue = downClueMap.get(currentNumber)!;
          clue.row = r;
          clue.col = c;
        }

        currentNumber++;
      }
    }
  }

  // Associate each cell with its across and down clue numbers
  for (let r = 0; r < rows; r++) {
    let activeAcrossNum: number | undefined;
    for (let c = 0; c < cols; c++) {
      if (cellMap[r][c].solution === null) {
        activeAcrossNum = undefined;
      } else {
        const cellNum = cellMap[r][c].number;
        if (cellNum && acrossClueMap.has(cellNum)) {
          activeAcrossNum = cellNum;
        }
        if (activeAcrossNum) {
          cellMap[r][c].acrossNumber = activeAcrossNum;
        }
      }
    }
  }

  for (let c = 0; c < cols; c++) {
    let activeDownNum: number | undefined;
    for (let r = 0; r < rows; r++) {
      if (cellMap[r][c].solution === null) {
        activeDownNum = undefined;
      } else {
        const cellNum = cellMap[r][c].number;
        if (cellNum && downClueMap.has(cellNum)) {
          activeDownNum = cellNum;
        }
        if (activeDownNum) {
          cellMap[r][c].downNumber = activeDownNum;
        }
      }
    }
  }

  return { cellMap, across: puzzle.across, down: puzzle.down };
}

// In-memory cache to conserve user's API quota
const puzzleCache: Partial<Record<CrosswordDifficulty, GeneratedCrossword>> = {};

export async function generateCrossword(
  difficulty: CrosswordDifficulty = 'easy',
  forceRefresh = false
): Promise<GeneratedCrossword> {
  if (!forceRefresh && puzzleCache[difficulty]) {
    return puzzleCache[difficulty]!;
  }

  const apiKey = process.env.EXPO_PUBLIC_APIVERVE_KEY;
  if (!apiKey) {
    console.warn('Missing EXPO_PUBLIC_APIVERVE_KEY, using fallback puzzle.');
    return FALLBACK_PUZZLE;
  }

  try {
    const response = await fetch(
      `https://api.apiverve.com/v1/crossword?difficulty=${difficulty}`,
      {
        headers: {
          'x-api-key': apiKey,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`Crossword API error (${response.status}): ${errorText}`);
      return puzzleCache[difficulty] ?? FALLBACK_PUZZLE;
    }

    const result = await response.json();
    if (result.status !== 'ok' || !result.data?.grid) {
      console.warn('Invalid Crossword API response, using fallback:', result.error);
      return puzzleCache[difficulty] ?? FALLBACK_PUZZLE;
    }

    const { size, grid, across, down } = result.data;
    const formatted: GeneratedCrossword = {
      size: size ?? grid.length,
      difficulty,
      grid: grid.map((row: (string | null)[]) =>
        row.map((cell) => (cell ? cell.toUpperCase() : null))
      ),
      across: across ?? [],
      down: down ?? [],
    };

    puzzleCache[difficulty] = formatted;
    return formatted;
  } catch (err) {
    console.warn('Network or parse error fetching crossword, using fallback:', err);
    return puzzleCache[difficulty] ?? FALLBACK_PUZZLE;
  }
}
