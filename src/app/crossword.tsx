import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OnboardingBackground } from '@/components/OnboardingBackground';
import {
  analyzeCrossword,
  CrosswordClue,
  CrosswordDifficulty,
  generateCrossword,
  GeneratedCrossword,
} from '@/lib/crossword';

const DIFFICULTIES: CrosswordDifficulty[] = ['easy', 'medium', 'hard'];

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
];

type Direction = 'across' | 'down';
type CheckStatus = 'correct' | 'incorrect' | null;

export default function CrosswordScreen() {
  const { width: windowWidth } = useWindowDimensions();
  const [difficulty, setDifficulty] = useState<CrosswordDifficulty>('easy');
  const [puzzle, setPuzzle] = useState<GeneratedCrossword | null>(null);
  const [userGrid, setUserGrid] = useState<(string | null)[][]>([]);
  const [checkMask, setCheckMask] = useState<CheckStatus[][]>([]);
  const [selected, setSelected] = useState<{ row: number; col: number } | null>(null);
  const [direction, setDirection] = useState<Direction>('across');
  const [clueTab, setClueTab] = useState<Direction>('across');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPuzzle = useCallback(async (level: CrosswordDifficulty, force = false) => {
    setLoading(true);
    setError(null);
    setSelected(null);
    try {
      const generated = await generateCrossword(level, force);
      setPuzzle(generated);
      const initialUserGrid = generated.grid.map((row) =>
        row.map((cell) => (cell === null ? null : ''))
      );
      setUserGrid(initialUserGrid);
      setCheckMask(generated.grid.map((row) => row.map(() => null)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load crossword.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPuzzle(difficulty);
  }, [difficulty, loadPuzzle]);

  const analysis = useMemo(() => {
    if (!puzzle) return null;
    return analyzeCrossword(puzzle);
  }, [puzzle]);

  // Current active clue based on selection & direction
  const activeClue = useMemo<CrosswordClue | null>(() => {
    if (!selected || !analysis) return null;
    const cell = analysis.cellMap[selected.row]?.[selected.col];
    if (!cell) return null;

    const clueNum = direction === 'across' ? cell.acrossNumber : cell.downNumber;
    if (clueNum) {
      const clues = direction === 'across' ? analysis.across : analysis.down;
      return clues.find((c) => c.number === clueNum) ?? null;
    }

    // Fallback to the other direction if cell only belongs to one
    const altClueNum = direction === 'across' ? cell.downNumber : cell.acrossNumber;
    if (altClueNum) {
      const altClues = direction === 'across' ? analysis.down : analysis.across;
      return altClues.find((c) => c.number === altClueNum) ?? null;
    }

    return null;
  }, [selected, direction, analysis]);

  // Check which clues are completely and correctly solved
  const completedClueNumbers = useMemo(() => {
    const acrossSet = new Set<number>();
    const downSet = new Set<number>();

    if (!puzzle || !analysis || userGrid.length === 0) {
      return { across: acrossSet, down: downSet };
    }

    analysis.across.forEach((clue) => {
      if (clue.row === undefined || clue.col === undefined) return;
      const letters = clue.answer.split('');
      const isComplete = letters.every((char, i) => {
        const u = userGrid[clue.row!]?.[clue.col! + i];
        return u && u.toUpperCase() === char.toUpperCase();
      });
      if (isComplete) acrossSet.add(clue.number);
    });

    analysis.down.forEach((clue) => {
      if (clue.row === undefined || clue.col === undefined) return;
      const letters = clue.answer.split('');
      const isComplete = letters.every((char, i) => {
        const u = userGrid[clue.row! + i]?.[clue.col!];
        return u && u.toUpperCase() === char.toUpperCase();
      });
      if (isComplete) downSet.add(clue.number);
    });

    return { across: acrossSet, down: downSet };
  }, [puzzle, analysis, userGrid]);

  // Handle cell click
  function handleCellPress(row: number, col: number) {
    if (!puzzle || puzzle.grid[row][col] === null) return;

    // Clear check highlight on the clicked cell so user can re-edit
    clearCellCheck(row, col);

    if (selected && selected.row === row && selected.col === col) {
      // Toggle direction when tapping the currently selected cell
      setDirection((prev) => (prev === 'across' ? 'down' : 'across'));
    } else {
      setSelected({ row, col });
      const cell = analysis?.cellMap[row]?.[col];
      if (cell) {
        if (cell.acrossNumber && !cell.downNumber) {
          setDirection('across');
        } else if (cell.downNumber && !cell.acrossNumber) {
          setDirection('down');
        }
      }
    }
  }

  function clearCellCheck(r: number, c: number) {
    setCheckMask((prev) => {
      if (!prev[r] || prev[r][c] === null) return prev;
      const next = prev.map((row) => [...row]);
      next[r][c] = null;
      return next;
    });
  }

  // Handle selecting a clue from the clue list
  function handleCluePress(clue: CrosswordClue, dir: Direction) {
    setDirection(dir);
    setClueTab(dir);
    if (clue.row !== undefined && clue.col !== undefined) {
      setSelected({ row: clue.row, col: clue.col });
      clearCellCheck(clue.row, clue.col);
    }
  }

  // Handle typing a letter into the selected cell
  function handleKeyPress(letter: string) {
    if (!selected || !puzzle) return;
    const { row, col } = selected;

    clearCellCheck(row, col);

    setUserGrid((prev) => {
      const next = prev.map((r) => [...r]);
      next[row][col] = letter.toUpperCase();
      return next;
    });

    moveToNextCell(row, col);
  }

  function handleBackspace() {
    if (!selected || !puzzle) return;
    const { row, col } = selected;

    clearCellCheck(row, col);

    setUserGrid((prev) => {
      const next = prev.map((r) => [...r]);
      next[row][col] = '';
      return next;
    });

    moveToPrevCell(row, col);
  }

  function moveToNextCell(r: number, c: number) {
    if (!puzzle) return;
    const maxR = puzzle.grid.length;
    const maxC = puzzle.grid[0].length;

    if (direction === 'across') {
      let nextC = c + 1;
      while (nextC < maxC && puzzle.grid[r][nextC] !== null) {
        if (userGrid[r][nextC] === '') {
          setSelected({ row: r, col: nextC });
          return;
        }
        nextC++;
      }
      if (c + 1 < maxC && puzzle.grid[r][c + 1] !== null) {
        setSelected({ row: r, col: c + 1 });
      }
    } else {
      let nextR = r + 1;
      while (nextR < maxR && puzzle.grid[nextR][c] !== null) {
        if (userGrid[nextR][c] === '') {
          setSelected({ row: nextR, col: c });
          return;
        }
        nextR++;
      }
      if (r + 1 < maxR && puzzle.grid[r + 1][c] !== null) {
        setSelected({ row: r + 1, col: c });
      }
    }
  }

  function moveToPrevCell(r: number, c: number) {
    if (!puzzle) return;
    if (direction === 'across') {
      if (c - 1 >= 0 && puzzle.grid[r][c - 1] !== null) {
        setSelected({ row: r, col: c - 1 });
      }
    } else {
      if (r - 1 >= 0 && puzzle.grid[r - 1][c] !== null) {
        setSelected({ row: r - 1, col: c });
      }
    }
  }

  // Reveal correct (green) and incorrect (red) feedback on the grid
  function handleCheck() {
    if (!puzzle) return;
    let filledCount = 0;
    let totalPlayable = 0;
    let correctCount = 0;
    let incorrectCount = 0;

    const newMask: CheckStatus[][] = puzzle.grid.map((row, r) =>
      row.map((sol, c) => {
        if (sol === null) return null;
        totalPlayable++;
        const userChar = userGrid[r]?.[c] ?? '';
        if (!userChar) return null;

        filledCount++;
        const isMatch = userChar.toUpperCase() === sol.toUpperCase();
        if (isMatch) {
          correctCount++;
          return 'correct';
        } else {
          incorrectCount++;
          return 'incorrect';
        }
      })
    );

    setCheckMask(newMask);

    if (filledCount === 0) {
      showAlert('Start Solving', 'Type letters into the crossword puzzle before checking.');
      return;
    }

    if (correctCount === totalPlayable) {
      showAlert('Solved! 🎉', 'Congratulations! You solved the entire crossword correctly!');
    } else if (incorrectCount === 0) {
      showAlert(
        'Looking Great!',
        `All ${correctCount} letters entered so far are correct! Keep going to complete the puzzle.`
      );
    } else {
      showAlert(
        'Check Results',
        `Correct letters are highlighted in green, and incorrect letters in red.`
      );
    }
  }

  function handleClear() {
    if (!puzzle) return;
    showAlert('Clear Puzzle', 'Are you sure you want to clear your answers?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: () => {
          setUserGrid(puzzle.grid.map((row) => row.map((cell) => (cell === null ? null : ''))));
          setCheckMask(puzzle.grid.map((row) => row.map(() => null)));
        },
      },
    ]);
  }

  function showAlert(title: string, message: string, buttons?: { text: string; style?: 'cancel' | 'destructive'; onPress?: () => void }[]) {
    if (Platform.OS === 'web') {
      window.alert(`${title}\n\n${message}`);
    } else {
      Alert.alert(title, message, buttons);
    }
  }

  // Calculate dynamic cell size for board
  const gridSize = puzzle?.grid.length ?? 15;
  const cellSize = Math.max(26, Math.min(36, Math.floor((windowWidth - 48) / gridSize)));

  return (
    <OnboardingBackground>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton} activeOpacity={0.7}>
              <Text style={styles.backArrow}>‹</Text>
              <Text style={styles.headerTitle}>Crossword</Text>
            </TouchableOpacity>
          </View>

          {/* Difficulty selector */}
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
                  <Text style={[styles.difficultyText, isSelected && styles.selectedDifficultyText]}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Loading */}
          {loading && (
            <View style={styles.centerBox}>
              <ActivityIndicator size="large" color="#6F8B52" />
              <Text style={styles.loadingText}>Generating puzzle…</Text>
            </View>
          )}

          {/* Error */}
          {!loading && error && (
            <View style={styles.centerBox}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={() => loadPuzzle(difficulty, true)}
                activeOpacity={0.85}
              >
                <Text style={styles.retryButtonText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Puzzle Content */}
          {!loading && !error && puzzle && analysis && (
            <>
              {/* Active Clue Banner */}
              <View style={styles.activeClueBanner}>
                {activeClue ? (
                  <View style={styles.clueBannerContent}>
                    <View style={styles.clueBannerTag}>
                      <Text style={styles.clueBannerTagText}>
                        {activeClue.number} {direction.toUpperCase()}
                      </Text>
                    </View>
                    <Text style={styles.clueBannerText} numberOfLines={2}>
                      {activeClue.clue}
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.clueBannerPlaceholder}>
                    Tap any square to view its clue and begin typing
                  </Text>
                )}
              </View>

              {/* Crossword Grid */}
              <View style={styles.gridContainer}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.horizontalGridScroll}
                >
                  <View style={styles.grid}>
                    {puzzle.grid.map((row, r) => (
                      <View key={r} style={styles.gridRow}>
                        {row.map((cell, c) => {
                          const isBlack = cell === null;
                          if (isBlack) {
                            return (
                              <View
                                key={c}
                                style={[styles.cell, styles.cellBlack, { width: cellSize, height: cellSize }]}
                              />
                            );
                          }

                          const isSelected = selected?.row === r && selected?.col === c;
                          const cellInfo = analysis.cellMap[r]?.[c];
                          const isInActiveClue =
                            activeClue &&
                            ((direction === 'across' && cellInfo?.acrossNumber === activeClue.number) ||
                              (direction === 'down' && cellInfo?.downNumber === activeClue.number));

                          const userLetter = userGrid[r]?.[c] ?? '';
                          const checkStatus = checkMask[r]?.[c] ?? null;

                          return (
                            <TouchableOpacity
                              key={c}
                              style={[
                                styles.cell,
                                { width: cellSize, height: cellSize },
                                isInActiveClue && styles.cellInActiveWord,
                                checkStatus === 'correct' && styles.cellCorrect,
                                checkStatus === 'incorrect' && styles.cellIncorrect,
                                isSelected && styles.cellSelected,
                              ]}
                              onPress={() => handleCellPress(r, c)}
                              activeOpacity={0.7}
                            >
                              {cellInfo?.number !== undefined && (
                                <Text
                                  style={[
                                    styles.cellNumber,
                                    checkStatus === 'correct' && styles.cellNumberCorrect,
                                    checkStatus === 'incorrect' && styles.cellNumberIncorrect,
                                  ]}
                                >
                                  {cellInfo.number}
                                </Text>
                              )}
                              <Text
                                style={[
                                  styles.cellLetter,
                                  checkStatus === 'correct' && styles.cellLetterCorrect,
                                  checkStatus === 'incorrect' && styles.cellLetterIncorrect,
                                  isSelected && styles.cellLetterSelected,
                                  { fontSize: Math.floor(cellSize * 0.58) },
                                ]}
                              >
                                {userLetter}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    ))}
                  </View>
                </ScrollView>
              </View>

              {/* Action buttons (Check, Clear, Toggle Direction) */}
              <View style={styles.controlsRow}>
                <TouchableOpacity
                  style={[styles.controlBtn, styles.directionBtn]}
                  onPress={() => setDirection((prev) => (prev === 'across' ? 'down' : 'across'))}
                  activeOpacity={0.8}
                >
                  <Text style={styles.directionBtnText}>
                    Mode: {direction === 'across' ? 'Across →' : 'Down ↓'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.controlBtn, styles.checkBtn]}
                  onPress={handleCheck}
                  activeOpacity={0.8}
                >
                  <Text style={styles.checkBtnText}>Check</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.controlBtn, styles.clearBtn]}
                  onPress={handleClear}
                  activeOpacity={0.8}
                >
                  <Text style={styles.clearBtnText}>Clear</Text>
                </TouchableOpacity>
              </View>

              {/* On-Screen Letter Keypad */}
              <View style={styles.keyboardContainer}>
                {KEYBOARD_ROWS.map((row, rIdx) => (
                  <View key={rIdx} style={styles.keyboardRow}>
                    {row.map((letter) => (
                      <TouchableOpacity
                        key={letter}
                        style={styles.keyBtn}
                        onPress={() => handleKeyPress(letter)}
                        activeOpacity={0.65}
                      >
                        <Text style={styles.keyText}>{letter}</Text>
                      </TouchableOpacity>
                    ))}
                    {rIdx === 2 && (
                      <TouchableOpacity
                        style={[styles.keyBtn, styles.backspaceKey]}
                        onPress={handleBackspace}
                        activeOpacity={0.65}
                      >
                        <Text style={styles.backspaceText}>⌫</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </View>

              {/* Clues Section */}
              <View style={styles.cluesContainer}>
                <View style={styles.clueTabs}>
                  <TouchableOpacity
                    style={[styles.clueTabBtn, clueTab === 'across' && styles.clueTabBtnActive]}
                    onPress={() => setClueTab('across')}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.clueTabBtnText,
                        clueTab === 'across' && styles.clueTabBtnTextActive,
                      ]}
                    >
                      Across ({analysis.across.length})
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.clueTabBtn, clueTab === 'down' && styles.clueTabBtnActive]}
                    onPress={() => setClueTab('down')}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.clueTabBtnText,
                        clueTab === 'down' && styles.clueTabBtnTextActive,
                      ]}
                    >
                      Down ({analysis.down.length})
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.clueList}>
                  {(clueTab === 'across' ? analysis.across : analysis.down).map((clue) => {
                    const isCurrent =
                      activeClue?.number === clue.number && direction === clueTab;
                    const isSolved = (
                      clueTab === 'across'
                        ? completedClueNumbers.across
                        : completedClueNumbers.down
                    ).has(clue.number);

                    return (
                      <TouchableOpacity
                        key={clue.number}
                        style={[
                          styles.clueItem,
                          isCurrent && styles.clueItemActive,
                          isSolved && styles.clueItemSolved,
                        ]}
                        onPress={() => handleCluePress(clue, clueTab)}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            styles.clueItemNumber,
                            isCurrent && styles.clueItemNumberActive,
                            isSolved && styles.clueItemNumberSolved,
                          ]}
                        >
                          {clue.number}.
                        </Text>
                        <Text
                          style={[
                            styles.clueItemText,
                            isCurrent && styles.clueItemTextActive,
                            isSolved && styles.clueItemTextSolved,
                          ]}
                        >
                          {clue.clue}{' '}
                          <Text style={styles.clueLengthText}>
                            ({clue.length ?? clue.answer.length})
                          </Text>
                        </Text>
                        {isSolved && <Text style={styles.solvedCheckmark}>✓</Text>}
                      </TouchableOpacity>
                    );
                  })}
                </View>
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
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingRight: 12,
  },
  backArrow: {
    fontSize: 34,
    lineHeight: 34,
    color: '#2D3B24',
    marginRight: 4,
    fontWeight: '300',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2D3B24',
    letterSpacing: 0.3,
  },
  difficultyRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 14,
  },
  difficultyPill: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#C8D5C0',
  },
  selectedDifficultyPill: {
    backgroundColor: '#6F8B52',
    borderColor: '#6F8B52',
  },
  difficultyText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B4A31',
  },
  selectedDifficultyText: {
    color: '#FFFFFF',
  },
  centerBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    gap: 12,
  },
  loadingText: {
    fontSize: 15,
    color: '#55654C',
  },
  errorText: {
    fontSize: 15,
    color: '#9C3A3A',
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  retryButton: {
    marginTop: 8,
    backgroundColor: '#6F8B52',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 18,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },
  activeClueBanner: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    minHeight: 56,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D3DFCC',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
      },
      android: { elevation: 2 },
      web: { boxShadow: '0 2px 8px rgba(0,0,0,0.04)' },
    }),
  },
  clueBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  clueBannerTag: {
    backgroundColor: '#6F8B52',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  clueBannerTagText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  clueBannerText: {
    flex: 1,
    fontSize: 14,
    color: '#2D3B24',
    fontWeight: '500',
    lineHeight: 18,
  },
  clueBannerPlaceholder: {
    fontSize: 13,
    color: '#7A8C71',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  gridContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: '#CFDBCB',
    marginBottom: 14,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
      },
      android: { elevation: 3 },
      web: { boxShadow: '0 4px 12px rgba(0,0,0,0.06)' },
    }),
  },
  horizontalGridScroll: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  grid: {
    alignSelf: 'center',
  },
  gridRow: {
    flexDirection: 'row',
  },
  cell: {
    borderWidth: 0.5,
    borderColor: '#BAC7B3',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cellBlack: {
    backgroundColor: '#263320',
    borderColor: '#263320',
  },
  cellInActiveWord: {
    backgroundColor: '#E8F1E4',
  },
  cellCorrect: {
    backgroundColor: '#D9ECD0',
    borderColor: '#739F63',
  },
  cellIncorrect: {
    backgroundColor: '#FDE5E5',
    borderColor: '#E17A78',
  },
  cellSelected: {
    backgroundColor: '#B4D1A3',
    borderColor: '#547239',
    borderWidth: 1.5,
  },
  cellNumber: {
    position: 'absolute',
    top: 1,
    left: 2,
    fontSize: 8,
    fontWeight: '700',
    color: '#4B5E40',
  },
  cellNumberCorrect: {
    color: '#2E5F1E',
  },
  cellNumberIncorrect: {
    color: '#9C2A28',
  },
  cellLetter: {
    fontWeight: '700',
    color: '#22301B',
  },
  cellLetterCorrect: {
    color: '#205513',
  },
  cellLetterIncorrect: {
    color: '#B32624',
  },
  cellLetterSelected: {
    color: '#16240F',
  },
  controlsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  controlBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  directionBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#6F8B52',
  },
  directionBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#556E3B',
  },
  checkBtn: {
    backgroundColor: '#6F8B52',
  },
  checkBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  clearBtn: {
    backgroundColor: '#E4ECE0',
  },
  clearBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4D623C',
  },
  keyboardContainer: {
    backgroundColor: '#D9E3D3',
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 14,
    gap: 6,
    marginBottom: 16,
  },
  keyboardRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
  },
  keyBtn: {
    flex: 1,
    maxWidth: 34,
    height: 42,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: { elevation: 1 },
      web: { boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
    }),
  },
  keyText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D3B24',
  },
  backspaceKey: {
    maxWidth: 46,
    backgroundColor: '#C5D6BF',
  },
  backspaceText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D3B24',
  },
  cluesContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#CFDBCB',
  },
  clueTabs: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E6EFE2',
    paddingBottom: 8,
  },
  clueTabBtn: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: 8,
  },
  clueTabBtnActive: {
    backgroundColor: '#EAF1E6',
  },
  clueTabBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7A8C71',
  },
  clueTabBtnTextActive: {
    color: '#435832',
    fontWeight: '700',
  },
  clueList: {
    gap: 10,
  },
  clueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  clueItemActive: {
    backgroundColor: '#EBF3E7',
  },
  clueItemSolved: {
    opacity: 0.65,
  },
  clueItemNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: '#556E3B',
    width: 28,
  },
  clueItemNumberActive: {
    color: '#344922',
  },
  clueItemNumberSolved: {
    color: '#437533',
  },
  clueItemText: {
    flex: 1,
    fontSize: 14,
    color: '#36472D',
    lineHeight: 19,
  },
  clueItemTextActive: {
    color: '#1F2E18',
    fontWeight: '600',
  },
  clueItemTextSolved: {
    color: '#5A6E52',
    textDecorationLine: 'line-through',
  },
  clueLengthText: {
    fontSize: 12,
    color: '#839679',
    fontWeight: '400',
  },
  solvedCheckmark: {
    fontSize: 14,
    color: '#3F782D',
    fontWeight: '700',
    marginLeft: 6,
  },
});
