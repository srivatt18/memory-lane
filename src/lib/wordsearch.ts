export type WordSearchGrid = string[][];
export type WordSearchDifficulty = 'easy' | 'medium' | 'hard';

interface GeneratedWordSearch {
  grid: WordSearchGrid;
  words: string[];
}

// Words used for grid
const THEMED_WORDS = ['MEMORY', 'MUSIC', 'SUNSET', 'FAMILY', 'PEACE', 'COMFORT'];

export async function generateWordSearch(
  difficulty: WordSearchDifficulty = 'easy',
  size = 10
): Promise<GeneratedWordSearch> {
  const apiKey = process.env.EXPO_PUBLIC_APIVERVE_KEY;
  if (!apiKey) {
    throw new Error('Missing EXPO_PUBLIC_APIVERVE_KEY. Add your APIVerve key to .env.');
  }

  const response = await fetch('https://api.apiverve.com/v1/wordsearch', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ words: THEMED_WORDS, size, difficulty }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Word Search API error (${response.status}): ${body}`);
  }

  const result = await response.json();
  if (result.status !== 'ok') {
    throw new Error(result.error ?? 'Word Search API returned an error.');
  }

  const grid: WordSearchGrid = result.data.grid.map((row: string[]) =>
    row.map((letter) => letter.toUpperCase())
  );

  return { grid, words: THEMED_WORDS };
}
