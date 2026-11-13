import React, { useCallback, useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OnboardingBackground } from '@/components/OnboardingBackground';
import { generateWordSearch, WordSearchGrid } from '@/lib/wordsearch';

type CellPos = { row: number; col: number };

function cellKey(row: number, col: number) {
  return `${row}-${col}`;
}

export default function WordSearchScreen() {
  const [grid, setGrid] = useState<WordSearchGrid | null>(null);
  const [words, setWords] = useState<string[]>([]);
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [foundCells, setFoundCells] = useState<Set<string>>(new Set());
  const [selectionStart, setSelectionStart] = useState<CellPos | null>(null);
  const [status, setStatus] = useState('Tap a letter, then tap the last letter of a word.');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPuzzle = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSelectionStart(null);
    setFoundWords(new Set());
    setFoundCells(new Set());
    setStatus('Tap a letter, then tap the last letter of a word.');
    try {
      const generated = await generateWordSearch();
      setGrid(generated.grid);
      setWords(generated.words);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load puzzle.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPuzzle();
  }, [loadPuzzle]);

  function handleCellPress(row: number, col: number) {
    if (!grid) return;

    if (!selectionStart) {
      setSelectionStart({ row, col });
      return;
    }

    const start = selectionStart;
    setSelectionStart(null);

    if (start.row === row && start.col === col) {
      return;
    }

    const dRow = row - start.row;
    const dCol = col - start.col;
    const isStraightLine = dRow === 0 || dCol === 0 || Math.abs(dRow) === Math.abs(dCol);
    if (!isStraightLine) {
      setStatus('Select letters in a straight line.');
      return;
    }

    const steps = Math.max(Math.abs(dRow), Math.abs(dCol));
    const stepRow = Math.sign(dRow);
    const stepCol = Math.sign(dCol);
    const path: CellPos[] = [];
    for (let i = 0; i <= steps; i++) {
      path.push({ row: start.row + stepRow * i, col: start.col + stepCol * i });
    }

    const letters = path.map((p) => grid[p.row][p.col]).join('');
    const reversed = [...letters].reverse().join('');
    const match = words.find((w) => !foundWords.has(w) && (w === letters || w === reversed));

    if (match) {
      setFoundWords((prev) => new Set(prev).add(match));
      setFoundCells((prev) => {
        const next = new Set(prev);
        path.forEach((p) => next.add(cellKey(p.row, p.col)));
        return next;
      });
      setStatus(
        foundWords.size + 1 === words.length ? 'All words found!' : `Found ${match}!`
      );
    } else {
      setStatus('try again.');
    }
  }

  const allFound = words.length > 0 && foundWords.size === words.length;

  return (
    <OnboardingBackground>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.push('/games')} style={styles.backButton} activeOpacity={0.7}>
              <Text style={styles.backArrow}>‹</Text>
              <Text style={styles.headerTitle}>Game Selection</Text>
            </TouchableOpacity>
          </View>

          {loading && (
            <View style={styles.centerBox}>
              <ActivityIndicator size="large" color="#6F8B52" />
              <Text style={styles.loadingText}>Generating puzzle…</Text>
            </View>
          )}

          {!loading && error && (
            <View style={styles.centerBox}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={loadPuzzle} activeOpacity={0.85}>
                <Text style={styles.retryButtonText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          )}

          {!loading && !error && grid && (
            <>
              <Text style={styles.statusText}>{status}</Text>

              <View style={styles.grid}>
                {grid.map((row, r) => (
                  <View key={r} style={styles.gridRow}>
                    {row.map((letter, c) => {
                      const key = cellKey(r, c);
                      const isFound = foundCells.has(key);
                      const isSelected = selectionStart?.row === r && selectionStart?.col === c;
                      return (
                        <TouchableOpacity
                          key={c}
                          style={[
                            styles.cell,
                            isFound && styles.cellFound,
                            isSelected && styles.cellSelected,
                          ]}
                          onPress={() => handleCellPress(r, c)}
                          activeOpacity={0.7}
                        >
                          <Text style={[styles.cellText, isFound && styles.cellTextFound]}>
                            {letter}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                ))}
              </View>

              <View style={styles.wordList}>
                {words.map((word) => {
                  const isFound = foundWords.has(word);
                  return (
                    <View key={word} style={[styles.wordPill, isFound && styles.wordPillFound]}>
                      <Text style={[styles.wordText, isFound && styles.wordTextFound]}>{word}</Text>
                    </View>
                  );
                })}
              </View>

              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={[styles.actionButton, allFound ? styles.primaryButton : styles.secondaryButton]}
                  onPress={loadPuzzle}
                  activeOpacity={0.85}
                >
                  <Text style={allFound ? styles.primaryButtonText : styles.secondaryButtonText}>
                    New Puzzle
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </OnboardingBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 40,
    alignItems: 'center',
  },
  header: {
    width: '100%',
    maxWidth: 340,
    paddingTop: 10,
    paddingBottom: 10,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backArrow: {
    fontSize: 28,
    color: '#34452C',
    lineHeight: 30,
    fontWeight: '300',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#34452C',
  },
  centerBox: {
    alignItems: 'center',
    gap: 14,
    marginTop: 60,
  },
  loadingText: {
    fontSize: 17,
    color: '#556847',
  },
  errorText: {
    fontSize: 17,
    color: '#7A3B3B',
    textAlign: 'center',
    maxWidth: 300,
  },
  retryButton: {
    backgroundColor: '#7D9A63',
    height: 48,
    paddingHorizontal: 28,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  statusText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#425338',
    textAlign: 'center',
    marginBottom: 16,
    maxWidth: 320,
  },
  grid: {
    borderWidth: 2,
    borderColor: '#5B6E4E',
    borderRadius: 4,
    overflow: 'hidden',
  },
  gridRow: {
    flexDirection: 'row',
  },
  cell: {
    width: 34,
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 0.5,
    borderColor: '#DFE5D8',
  },
  cellSelected: {
    backgroundColor: '#CFE0BE',
  },
  cellFound: {
    backgroundColor: '#87A46E',
  },
  cellText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4A6741',
  },
  cellTextFound: {
    color: '#FFFFFF',
  },
  wordList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginTop: 24,
    maxWidth: 340,
  },
  wordPill: {
    height: 42,
    paddingHorizontal: 18,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DFE5D8',
  },
  wordPillFound: {
    backgroundColor: '#87A46E',
    borderColor: '#738F5C',
  },
  wordText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#38472E',
  },
  wordTextFound: {
    color: '#FFFFFF',
    textDecorationLine: 'line-through',
  },
  actionsRow: {
    width: '100%',
    maxWidth: 340,
    marginTop: 28,
  },
  actionButton: {
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DFE5D8',
  },
  secondaryButtonText: {
    color: '#38472E',
    fontSize: 17,
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: '#7D9A63',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
});
