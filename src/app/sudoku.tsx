import React, { useCallback, useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OnboardingBackground } from '@/components/OnboardingBackground';
import { generateSudoku, SudokuDifficulty, SudokuGrid } from '@/lib/sudoku';

const DIFFICULTIES: SudokuDifficulty[] = ['easy', 'medium', 'hard'];

export default function SudokuScreen() {
  const [difficulty, setDifficulty] = useState<SudokuDifficulty>('easy');
  const [puzzle, setPuzzle] = useState<SudokuGrid | null>(null);
  const [solution, setSolution] = useState<SudokuGrid | null>(null);
  const [fixedMask, setFixedMask] = useState<boolean[][] | null>(null);
  const [selected, setSelected] = useState<{ row: number; col: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPuzzle = useCallback(async (level: SudokuDifficulty) => {
    setLoading(true);
    setError(null);
    setSelected(null);
    try {
      const generated = await generateSudoku(level);
      setPuzzle(generated.puzzle.map((row) => [...row]));
      setSolution(generated.solution);
      setFixedMask(generated.puzzle.map((row) => row.map((cell) => cell !== null)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load puzzle.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {

    loadPuzzle(difficulty);
  }, [difficulty, loadPuzzle]);

  function handleCellPress(row: number, col: number) {
    if (!fixedMask || fixedMask[row][col]) return;
    setSelected({ row, col });
  }

  function handleDigitPress(digit: number) {
    if (!selected) return;
    const { row, col } = selected;
    setPuzzle((prev) => {
      if (!prev) return prev;
      const next = prev.map((r) => [...r]);
      next[row][col] = digit;
      return next;
    });
  }

  function handleErase() {
    if (!selected) return;
    const { row, col } = selected;
    setPuzzle((prev) => {
      if (!prev) return prev;
      const next = prev.map((r) => [...r]);
      next[row][col] = null;
      return next;
    });
  }

  function handleClearAll() {
    if (!fixedMask) return;
    setPuzzle((prev) => {
      if (!prev) return prev;
      return prev.map((row, r) => row.map((cell, c) => (fixedMask[r][c] ? cell : null)));
    });
  }

  function handleCheck() {
    if (!puzzle || !solution) return;
    const isComplete = puzzle.every((row) => row.every((cell) => cell !== null));
    if (!isComplete) {
      Alert.alert('Keep going', 'Fill in every cell before checking.');
      return;
    }
    const isCorrect = puzzle.every((row, r) => row.every((cell, c) => cell === solution[r][c]));
    Alert.alert(
      isCorrect ? 'Solved!' : 'Not quite',
      isCorrect
        ? 'Great job, the puzzle is correct.'
        : "Some numbers don't match the solution yet."
    );
  }

  return (
    <OnboardingBackground>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton} activeOpacity={0.7}>
              <Text style={styles.backArrow}>‹</Text>
              <Text style={styles.headerTitle}>Sudoku</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.difficultyRow}>
            {DIFFICULTIES.map((level) => {
              const isSelected = difficulty === level;
              return (
                <TouchableOpacity
                  key={level}
                  style={[styles.difficultyPill, isSelected && styles.selectedDifficultyPill]}
                  onPress={() => setDifficulty(level)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[styles.difficultyText, isSelected && styles.selectedDifficultyText]}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </Text>
                </TouchableOpacity>
              );
            })}
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
              <TouchableOpacity
                style={styles.retryButton}
                onPress={() => loadPuzzle(difficulty)}
                activeOpacity={0.85}
              >
                <Text style={styles.retryButtonText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          )}

          {!loading && !error && puzzle && fixedMask && (
            <>
              <View style={styles.grid}>
                {puzzle.map((row, r) => (
                  <View key={r} style={styles.gridRow}>
                    {row.map((cell, c) => {
                      const isFixed = fixedMask[r][c];
                      const isSelected = selected?.row === r && selected?.col === c;
                      return (
                        <TouchableOpacity
                          key={c}
                          style={[
                            styles.cell,
                            isFixed && styles.cellFixedBg,
                            c % 3 === 2 && c !== 8 && styles.cellThickRight,
                            r % 3 === 2 && r !== 8 && styles.cellThickBottom,
                            isSelected && styles.cellSelected,
                          ]}
                          onPress={() => handleCellPress(r, c)}
                          activeOpacity={isFixed ? 1 : 0.7}
                          disabled={isFixed}
                        >
                          <Text style={[styles.cellText, isFixed && styles.cellTextFixed]}>
                            {cell ?? ''}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                ))}
              </View>

              <View style={styles.numberPad}>
                {Array.from({ length: 9 }, (_, i) => i + 1).map((digit) => (
                  <TouchableOpacity
                    key={digit}
                    style={[styles.digitButton, !selected && styles.digitButtonDisabled]}
                    onPress={() => handleDigitPress(digit)}
                    activeOpacity={0.8}
                    disabled={!selected}
                  >
                    <Text style={styles.digitText}>{digit}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={[styles.eraseButton, !selected && styles.digitButtonDisabled]}
                onPress={handleErase}
                activeOpacity={0.8}
                disabled={!selected}
              >
                <Text style={styles.eraseButtonText}>Erase</Text>
              </TouchableOpacity>

              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.secondaryButton]}
                  onPress={handleClearAll}
                  activeOpacity={0.85}
                >
                  <Text style={styles.secondaryButtonText}>Clear</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.secondaryButton]}
                  onPress={() => loadPuzzle(difficulty)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.secondaryButtonText}>New Puzzle</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.primaryButton]}
                  onPress={handleCheck}
                  activeOpacity={0.85}
                >
                  <Text style={styles.primaryButtonText}>Check</Text>
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
  difficultyRow: {
    flexDirection: 'row',
    width: '100%',
    maxWidth: 340,
    gap: 10,
    marginTop: 8,
    marginBottom: 20,
  },
  difficultyPill: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DFE5D8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  selectedDifficultyPill: {
    backgroundColor: '#87A46E',
    borderColor: '#738F5C',
  },
  difficultyText: {
    fontSize: 14,
    color: '#38472E',
    fontWeight: '600',
  },
  selectedDifficultyText: {
    color: '#FFFFFF',
  },
  centerBox: {
    alignItems: 'center',
    gap: 14,
    marginTop: 60,
  },
  loadingText: {
    fontSize: 15,
    color: '#556847',
  },
  errorText: {
    fontSize: 15,
    color: '#7A3B3B',
    textAlign: 'center',
    maxWidth: 300,
  },
  retryButton: {
    backgroundColor: '#7D9A63',
    height: 44,
    paddingHorizontal: 28,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
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
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 0.5,
    borderColor: '#DFE5D8',
  },
  cellFixedBg: {
    backgroundColor: '#F1EFE7',
  },
  cellThickRight: {
    borderRightWidth: 2,
    borderRightColor: '#5B6E4E',
  },
  cellThickBottom: {
    borderBottomWidth: 2,
    borderBottomColor: '#5B6E4E',
  },
  cellSelected: {
    backgroundColor: '#CFE0BE',
  },
  cellText: {
    fontSize: 17,
    fontWeight: '500',
    color: '#4A6741',
  },
  cellTextFixed: {
    fontWeight: '700',
    color: '#2E3D27',
  },
  numberPad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
    marginTop: 24,
    maxWidth: 340,
  },
  digitButton: {
    width: 32,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DFE5D8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  digitButtonDisabled: {
    opacity: 0.4,
  },
  digitText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#38472E',
  },
  eraseButton: {
    marginTop: 14,
    height: 40,
    paddingHorizontal: 24,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DFE5D8',
  },
  eraseButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#38472E',
  },
  actionsRow: {
    flexDirection: 'row',
    width: '100%',
    maxWidth: 340,
    gap: 10,
    marginTop: 28,
  },
  actionButton: {
    flex: 1,
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
    fontSize: 14,
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: '#7D9A63',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
