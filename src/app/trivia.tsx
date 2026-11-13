import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OnboardingBackground } from '@/components/OnboardingBackground';
import {
  GENRES,
  DIFFICULTY_COUNTS,
  TriviaDifficulty,
  TriviaGenre,
  TriviaQuestion,
  getTriviaQuestions,
} from '@/lib/trivia';

const DIFFICULTIES: TriviaDifficulty[] = ['easy', 'medium', 'hard'];

type ScreenState = 'setup' | 'playing' | 'completed';

export default function TriviaScreen() {
  const [screenState, setScreenState] = useState<ScreenState>('setup');
  const [difficulty, setDifficulty] = useState<TriviaDifficulty>('easy');
  const [selectedGenre, setSelectedGenre] = useState<TriviaGenre>('geography');

  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  function handleStartGame() {
    const list = getTriviaQuestions(selectedGenre, difficulty);
    setQuestions(list);
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setScreenState('playing');
  }

  function handleSelectOption(index: number) {
    if (selectedOption !== null) return;
    setSelectedOption(index);
    if (index === questions[currentIndex].correctIndex) {
      setScore((prev) => prev + 1);
    }
  }

  function handleNextQuestion() {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      setScreenState('completed');
    }
  }

  function handleBackToSetup() {
    setScreenState('setup');
    setSelectedOption(null);
    setCurrentIndex(0);
  }

  const currentQuestion = questions[currentIndex];
  const isAnswered = selectedOption !== null;
  const isCorrect = isAnswered && selectedOption === currentQuestion?.correctIndex;
  const currentGenreObj = GENRES.find((g) => g.id === selectedGenre);

  const incorrectCount = questions.length - score;

  return (
    <OnboardingBackground>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {screenState === 'setup' && (
            <>
              <View style={styles.header}>
                <TouchableOpacity
                  onPress={() => router.back()}
                  style={styles.backButton}
                  activeOpacity={0.7}
                >
                  <Text style={styles.backArrow}>‹</Text>
                  <Text style={styles.headerTitle}>Game Selection</Text>
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
                        {level.charAt(0).toUpperCase() + level.slice(1)} ({DIFFICULTY_COUNTS[level]})
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={styles.selectionArea}>
                <Text style={styles.sectionLabel}>Select Category</Text>
                {GENRES.map((genre) => {
                  const isSelected = selectedGenre === genre.id;
                  return (
                    <TouchableOpacity
                      key={genre.id}
                      style={[styles.genreCard, isSelected && styles.selectedGenreCard]}
                      onPress={() => setSelectedGenre(genre.id)}
                      activeOpacity={0.85}
                    >
                      <View style={styles.genreCardHeader}>
                        <Text
                          style={[
                            styles.genreCardTitle,
                            isSelected && styles.selectedGenreCardTitle,
                          ]}
                        >
                          {genre.title}
                        </Text>
                        <View
                          style={[
                            styles.radioIndicator,
                            isSelected && styles.selectedRadioIndicator,
                          ]}
                        >
                          {isSelected && <View style={styles.radioInnerDot} />}
                        </View>
                      </View>
                      <Text style={styles.genreCardSubtitle}>{genre.subtitle}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.primaryButton]}
                  onPress={handleStartGame}
                  activeOpacity={0.85}
                >
                  <Text style={styles.primaryButtonText}>Start Game</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {screenState === 'playing' && currentQuestion && (
            <>
              <View style={styles.header}>
                <TouchableOpacity
                  onPress={handleBackToSetup}
                  style={styles.backButton}
                  activeOpacity={0.7}
                >
                  <Text style={styles.backArrow}>‹</Text>
                  <Text style={styles.headerTitle}>Trivia</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.metaRow}>
                <Text style={styles.metaText}>
                  {currentGenreObj?.title} • {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </Text>
                <Text style={styles.metaText}>
                  Question {currentIndex + 1} of {questions.length}
                </Text>
              </View>

              <View style={styles.questionCard}>
                <Text style={styles.questionText}>{currentQuestion.question}</Text>
              </View>

              <View style={styles.optionsList}>
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = selectedOption === idx;
                  const isAnswerCorrect = idx === currentQuestion.correctIndex;

                  let optionStyle = styles.optionButton;
                  let optionTextStyle = styles.optionText;

                  if (isAnswered) {
                    if (isAnswerCorrect) {
                      optionStyle = styles.optionCorrect;
                      optionTextStyle = styles.optionTextCorrect;
                    } else if (isSelected) {
                      optionStyle = styles.optionIncorrect;
                      optionTextStyle = styles.optionTextIncorrect;
                    } else {
                      optionStyle = styles.optionDimmed;
                    }
                  }

                  const letter = String.fromCharCode(65 + idx);

                  return (
                    <TouchableOpacity
                      key={idx}
                      style={[styles.baseOption, optionStyle]}
                      onPress={() => handleSelectOption(idx)}
                      disabled={isAnswered}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.optionLetter, optionTextStyle]}>{letter}.</Text>
                      <Text style={[styles.baseOptionText, optionTextStyle]}>{option}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {isAnswered && (
                <View
                  style={[
                    styles.explanationBox,
                    isCorrect ? styles.explanationBoxCorrect : styles.explanationBoxIncorrect,
                  ]}
                >
                  <Text
                    style={[
                      styles.resultStatusText,
                      isCorrect ? styles.resultCorrect : styles.resultIncorrect,
                    ]}
                  >
                    {isCorrect ? 'Correct' : 'Incorrect'}
                  </Text>
                  <Text style={styles.explanationText}>{currentQuestion.explanation}</Text>

                  <TouchableOpacity
                    style={[styles.actionButton, styles.primaryButton, styles.nextButton]}
                    onPress={handleNextQuestion}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.primaryButtonText}>
                      {currentIndex + 1 < questions.length ? 'Next Question' : 'See Results'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}

          {screenState === 'completed' && (
            <>
              <View style={styles.header}>
                <TouchableOpacity
                  onPress={handleBackToSetup}
                  style={styles.backButton}
                  activeOpacity={0.7}
                >
                  <Text style={styles.backArrow}>‹</Text>
                  <Text style={styles.headerTitle}>Trivia</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.completedCard}>
                <Text style={styles.completedCongratulations}>Congratulations!</Text>
                <Text style={styles.completedMessage}>
                  Well done on completing the trivia challenge.
                </Text>

                <View style={styles.ratioContainer}>
                  <View style={styles.ratioItem}>
                    <Text style={styles.ratioNumberCorrect}>{score}</Text>
                    <Text style={styles.ratioLabel}>Correct</Text>
                  </View>
                  <View style={styles.ratioDivider} />
                  <View style={styles.ratioItem}>
                    <Text style={styles.ratioNumberIncorrect}>{incorrectCount}</Text>
                    <Text style={styles.ratioLabel}>Incorrect</Text>
                  </View>
                </View>

                <Text style={styles.ratioSummary}>
                  {score} / {questions.length} answered correctly
                </Text>
              </View>

              <View style={styles.actionsColumn}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.primaryButton]}
                  onPress={() => router.replace('/home')}
                  activeOpacity={0.85}
                >
                  <Text style={styles.primaryButtonText}>Back to Home</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, styles.secondaryButton]}
                  onPress={handleBackToSetup}
                  activeOpacity={0.85}
                >
                  <Text style={styles.secondaryButtonText}>Play Another Category</Text>
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
    fontSize: 13,
    color: '#38472E',
    fontWeight: '600',
  },
  selectedDifficultyText: {
    color: '#FFFFFF',
  },
  selectionArea: {
    width: '100%',
    maxWidth: 340,
    gap: 12,
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#34452C',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  genreCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#DFE5D8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  selectedGenreCard: {
    borderColor: '#738F5C',
    borderWidth: 2,
    backgroundColor: '#F7FAF4',
  },
  genreCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  genreCardTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#2E3D27',
  },
  selectedGenreCardTitle: {
    color: '#2E3D27',
  },
  radioIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#DFE5D8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedRadioIndicator: {
    borderColor: '#738F5C',
  },
  radioInnerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#738F5C',
  },
  genreCardSubtitle: {
    fontSize: 13,
    color: '#556847',
    marginTop: 4,
    lineHeight: 18,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 340,
    marginBottom: 12,
  },
  metaText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#556847',
  },
  questionCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#DFE5D8',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  questionText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#2E3D27',
    lineHeight: 24,
  },
  optionsList: {
    width: '100%',
    maxWidth: 340,
    gap: 10,
  },
  baseOption: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 50,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  optionButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#DFE5D8',
  },
  optionCorrect: {
    backgroundColor: '#EBF4E5',
    borderColor: '#6F8B52',
    borderWidth: 2,
  },
  optionIncorrect: {
    backgroundColor: '#FDEAEA',
    borderColor: '#D9534F',
    borderWidth: 2,
  },
  optionDimmed: {
    backgroundColor: '#FFFFFF',
    borderColor: '#DFE5D8',
    opacity: 0.6,
  },
  optionLetter: {
    fontSize: 15,
    fontWeight: '700',
    marginRight: 8,
  },
  baseOptionText: {
    fontSize: 15,
    fontWeight: '500',
    flex: 1,
  },
  optionText: {
    color: '#38472E',
  },
  optionTextCorrect: {
    color: '#2E4A1D',
  },
  optionTextIncorrect: {
    color: '#8A1F1D',
  },
  explanationBox: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 14,
    padding: 16,
    marginTop: 18,
    borderWidth: 1,
  },
  explanationBoxCorrect: {
    backgroundColor: '#EBF4E5',
    borderColor: '#C8DEC0',
  },
  explanationBoxIncorrect: {
    backgroundColor: '#FDEAEA',
    borderColor: '#F2C2C2',
  },
  resultStatusText: {
    fontSize: 15,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  resultCorrect: {
    color: '#2E4A1D',
  },
  resultIncorrect: {
    color: '#8A1F1D',
  },
  explanationText: {
    fontSize: 14,
    color: '#38472E',
    lineHeight: 20,
    marginTop: 6,
  },
  nextButton: {
    marginTop: 14,
  },
  completedCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#DFE5D8',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  completedCongratulations: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2E3D27',
    textAlign: 'center',
  },
  completedMessage: {
    fontSize: 14,
    color: '#556847',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 20,
  },
  ratioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F6F8F3',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 28,
    width: '100%',
    borderWidth: 1,
    borderColor: '#E2EAD8',
  },
  ratioItem: {
    flex: 1,
    alignItems: 'center',
  },
  ratioDivider: {
    width: 1,
    height: 36,
    backgroundColor: '#DFE5D8',
  },
  ratioNumberCorrect: {
    fontSize: 26,
    fontWeight: '700',
    color: '#2E5A1E',
  },
  ratioNumberIncorrect: {
    fontSize: 26,
    fontWeight: '700',
    color: '#8A1F1D',
  },
  ratioLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#556847',
    marginTop: 2,
    textTransform: 'uppercase',
  },
  ratioSummary: {
    fontSize: 13,
    color: '#556847',
    marginTop: 14,
    fontWeight: '500',
  },
  actionsRow: {
    flexDirection: 'row',
    width: '100%',
    maxWidth: 340,
    gap: 10,
    marginTop: 12,
  },
  actionsColumn: {
    width: '100%',
    maxWidth: 340,
    gap: 10,
    marginTop: 4,
  },
  actionButton: {
    width: '100%',
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

