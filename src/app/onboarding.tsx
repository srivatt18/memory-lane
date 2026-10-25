import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OnboardingBackground } from '@/components/OnboardingBackground';
import { useAuth } from '@/context/AuthContext';
import { OnboardingData } from '@/types/auth';

const AUDIO_GENRES = [
  'Classical Music',
  'Ambient Noise',
  'Ocean Waves',
  'Lo-Fi Music',
  'Binaural Beats',
  'Nature Sounds',
];

const BRAIN_GAMES = [
  'Sudoku',
  'Crossword',
  'Logic Puzzles',
  'Memorization',
  'Pattern Match',
  'Vocabulary',
];

const AGE_RANGES = ['Under 30', '30 - 49', '50 - 70', '70+'];

export default function OnboardingScreen() {
  const { signUpWithOnboarding } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState<OnboardingData>({
    fullName: '',
    email: '',
    password: '',
    ageRange: '50 - 70',
    cognitiveWellnessRating: 5,
    stressRating: 7,
    responsibilityRating: 8,
    audioGenres: ['Classical Music', 'Nature Sounds'],
    brainGames: ['Sudoku', 'Crossword'],
    notificationsEnabled: true,
    reminderHour: '08',
    reminderMinute: '40',
    reminderPeriod: 'PM',
  });

  function handleBack() {
    if (step > 1) {
      // If going back from step 11 and user had notifications turned off, skip step 10
      if (step === 11 && !formData.notificationsEnabled) {
        setStep(9);
      } else {
        setStep(step - 1);
      }
    } else {
      router.back();
    }
  }

  function handleNext() {
    // Validations
    if (step === 1) {
      if (!formData.fullName.trim()) {
        Alert.alert('Required', 'Please enter your full name.');
        return;
      }
      setStep(2);
      return;
    }

    if (step === 2) {
      if (!formData.email.trim() || !formData.password) {
        Alert.alert('Required', 'Please enter both email and password.');
        return;
      }
      if (formData.password.length < 6) {
        Alert.alert('Password too short', 'Password must be at least 6 characters.');
        return;
      }
      setStep(3);
      return;
    }

    if (step === 9) {
      // If notifications selected as 'No', skip reminder time step (step 10)
      if (!formData.notificationsEnabled) {
        setStep(11);
        return;
      }
    }

    if (step === 10) {
      setStep(11);
      return;
    }

    if (step === 11) {
      submitRegistration();
      return;
    }

    setStep(step + 1);
  }

  async function submitRegistration() {
    setIsSubmitting(true);
    const { error, needsEmailConfirmation } = await signUpWithOnboarding(formData);
    setIsSubmitting(false);

    if (error) {
      Alert.alert('Signup Failed', error.message);
      return;
    }

    if (needsEmailConfirmation) {
      Alert.alert(
        'Account Created!',
        'Please check your email to confirm your account before logging in.',
        [{ text: 'OK', onPress: () => router.replace('/login') }]
      );
    } else {
      Alert.alert('Welcome!', 'Your account and preferences have been successfully set up.', [
        { text: 'Get Started', onPress: () => router.replace('/home') },
      ]);
    }
  }

  function toggleAudioGenre(genre: string) {
    setFormData((prev) => {
      const exists = prev.audioGenres.includes(genre);
      const updated = exists
        ? prev.audioGenres.filter((g) => g !== genre)
        : [...prev.audioGenres, genre];
      return { ...prev, audioGenres: updated };
    });
  }

  function toggleBrainGame(game: string) {
    setFormData((prev) => {
      const exists = prev.brainGames.includes(game);
      const updated = exists
        ? prev.brainGames.filter((g) => g !== game)
        : [...prev.brainGames, game];
      return { ...prev, brainGames: updated };
    });
  }

  return (
    <OnboardingBackground>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton} activeOpacity={0.7}>
              <Text style={styles.backArrow}>‹</Text>
              <Text style={styles.headerTitle}>Memory Lane</Text>
            </TouchableOpacity>
            <Text style={styles.stepIndicator}>Step {step} of 11</Text>
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Step 1 (Onboarding 2): Full Name */}
            {step === 1 && (
              <View style={styles.stepContainer}>
                <Text style={styles.stepPrompt}>Enter your full name :</Text>
                <TextInput
                  style={styles.pillInput}
                  placeholder="First Last"
                  placeholderTextColor="#99A294"
                  value={formData.fullName}
                  onChangeText={(val) => setFormData((p) => ({ ...p, fullName: val }))}
                  autoFocus
                  autoCapitalize="words"
                />
              </View>
            )}

            {/* Step 2 (Onboarding 3): Email & Password */}
            {step === 2 && (
              <View style={styles.stepContainer}>
                <View style={styles.inputGroup}>
                  <Text style={styles.stepPrompt}>Enter your email :</Text>
                  <TextInput
                    style={styles.pillInput}
                    placeholder="abcd1234@go.com"
                    placeholderTextColor="#99A294"
                    value={formData.email}
                    onChangeText={(val) => setFormData((p) => ({ ...p, email: val }))}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    autoFocus
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.stepPrompt}>Enter your password :</Text>
                  <TextInput
                    style={styles.pillInput}
                    placeholder="************"
                    placeholderTextColor="#99A294"
                    value={formData.password}
                    onChangeText={(val) => setFormData((p) => ({ ...p, password: val }))}
                    secureTextEntry
                  />
                </View>
              </View>
            )}

            {/* Step 3 (Onboarding 4): Age Range */}
            {step === 3 && (
              <View style={styles.stepContainer}>
                <Text style={styles.stepPrompt}>What is your age range.</Text>
                <View style={styles.ageRangeGrid}>
                  {AGE_RANGES.map((range) => {
                    const isSelected = formData.ageRange === range;
                    return (
                      <TouchableOpacity
                        key={range}
                        style={[styles.dropdownPill, isSelected && styles.selectedDropdownPill]}
                        onPress={() => setFormData((p) => ({ ...p, ageRange: range }))}
                        activeOpacity={0.8}
                      >
                        <Text
                          style={[styles.dropdownPillText, isSelected && styles.selectedPillText]}
                        >
                          {range}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            {/* Step 4 (Onboarding 5): Cognitive Wellness */}
            {step === 4 && (
              <View style={styles.stepContainer}>
                <Text style={styles.stepPrompt}>
                  Rate your experience with Cognitive wellness practices on a scale of 1-10:
                </Text>
                <View style={styles.ratingNumberGrid}>
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => {
                    const isSelected = formData.cognitiveWellnessRating === num;
                    return (
                      <TouchableOpacity
                        key={num}
                        style={[styles.ratingPill, isSelected && styles.selectedRatingPill]}
                        onPress={() => setFormData((p) => ({ ...p, cognitiveWellnessRating: num }))}
                        activeOpacity={0.8}
                      >
                        <Text style={[styles.ratingText, isSelected && styles.selectedRatingText]}>
                          {num}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
                <Text style={styles.ratingLabel}>Current: {formData.cognitiveWellnessRating} / 10</Text>
              </View>
            )}

            {/* Step 5 (Onboarding 6): Stress Level */}
            {step === 5 && (
              <View style={styles.stepContainer}>
                <Text style={styles.stepPrompt}>Rate your stress level from 1-10:</Text>
                <View style={styles.ratingNumberGrid}>
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => {
                    const isSelected = formData.stressRating === num;
                    return (
                      <TouchableOpacity
                        key={num}
                        style={[styles.ratingPill, isSelected && styles.selectedRatingPill]}
                        onPress={() => setFormData((p) => ({ ...p, stressRating: num }))}
                        activeOpacity={0.8}
                      >
                        <Text style={[styles.ratingText, isSelected && styles.selectedRatingText]}>
                          {num}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
                <Text style={styles.ratingLabel}>Current: {formData.stressRating} / 10</Text>
              </View>
            )}

            {/* Step 6 (Onboarding 7): Busyness / Responsibilities */}
            {step === 6 && (
              <View style={styles.stepContainer}>
                <Text style={styles.stepPrompt}>
                  Rate how busy you are with work or other responsibilities on a scale of 1-10:
                </Text>
                <View style={styles.ratingNumberGrid}>
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => {
                    const isSelected = formData.responsibilityRating === num;
                    return (
                      <TouchableOpacity
                        key={num}
                        style={[styles.ratingPill, isSelected && styles.selectedRatingPill]}
                        onPress={() => setFormData((p) => ({ ...p, responsibilityRating: num }))}
                        activeOpacity={0.8}
                      >
                        <Text style={[styles.ratingText, isSelected && styles.selectedRatingText]}>
                          {num}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
                <Text style={styles.ratingLabel}>Current: {formData.responsibilityRating} / 10</Text>
              </View>
            )}

            {/* Step 7 (Onboarding 8): Audio Genres */}
            {step === 7 && (
              <View style={styles.stepContainer}>
                <Text style={styles.stepPrompt}>
                  Select audio genres you'd enjoy for relaxation
                </Text>
                <View style={styles.cardsGrid}>
                  {AUDIO_GENRES.map((genre) => {
                    const isSelected = formData.audioGenres.includes(genre);
                    return (
                      <TouchableOpacity
                        key={genre}
                        style={[styles.cardItem, isSelected && styles.selectedCardItem]}
                        onPress={() => toggleAudioGenre(genre)}
                        activeOpacity={0.8}
                      >
                        <Text style={[styles.cardText, isSelected && styles.selectedCardText]}>
                          {genre}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            {/* Step 8 (Onboarding 9): Brain Games */}
            {step === 8 && (
              <View style={styles.stepContainer}>
                <Text style={styles.stepPrompt}>
                  Select brain games you'd enjoy as options for staying sharp
                </Text>
                <View style={styles.cardsGrid}>
                  {BRAIN_GAMES.map((game) => {
                    const isSelected = formData.brainGames.includes(game);
                    return (
                      <TouchableOpacity
                        key={game}
                        style={[styles.cardItem, isSelected && styles.selectedCardItem]}
                        onPress={() => toggleBrainGame(game)}
                        activeOpacity={0.8}
                      >
                        <Text style={[styles.cardText, isSelected && styles.selectedCardText]}>
                          {game}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            {/* Step 9 (Onboarding 10): Notifications */}
            {step === 9 && (
              <View style={styles.stepContainer}>
                <Text style={styles.stepPrompt}>Would you like to receive notifications?</Text>
                <View style={styles.binaryChoiceContainer}>
                  <TouchableOpacity
                    style={[
                      styles.binaryChoicePill,
                      formData.notificationsEnabled && styles.selectedBinaryChoicePill,
                    ]}
                    onPress={() => setFormData((p) => ({ ...p, notificationsEnabled: true }))}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.binaryChoiceText,
                        formData.notificationsEnabled && styles.selectedBinaryChoiceText,
                      ]}
                    >
                      Yes
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.binaryChoicePill,
                      !formData.notificationsEnabled && styles.selectedBinaryChoicePill,
                    ]}
                    onPress={() => setFormData((p) => ({ ...p, notificationsEnabled: false }))}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.binaryChoiceText,
                        !formData.notificationsEnabled && styles.selectedBinaryChoiceText,
                      ]}
                    >
                      No
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Step 10 (Onboarding 11): Reminder Time */}
            {step === 10 && (
              <View style={styles.stepContainer}>
                <Text style={styles.stepPrompt}>Set a time for your reminder</Text>
                <View style={styles.timePickerContainer}>
                  {/* Hour */}
                  <TextInput
                    style={styles.timePillInput}
                    value={formData.reminderHour}
                    onChangeText={(val) =>
                      setFormData((p) => ({ ...p, reminderHour: val.slice(0, 2) }))
                    }
                    keyboardType="number-pad"
                    maxLength={2}
                    placeholder="08"
                    placeholderTextColor="#99A294"
                  />
                  <Text style={styles.colonSeparator}>:</Text>
                  {/* Minute */}
                  <TextInput
                    style={styles.timePillInput}
                    value={formData.reminderMinute}
                    onChangeText={(val) =>
                      setFormData((p) => ({ ...p, reminderMinute: val.slice(0, 2) }))
                    }
                    keyboardType="number-pad"
                    maxLength={2}
                    placeholder="40"
                    placeholderTextColor="#99A294"
                  />
                  {/* AM / PM Toggle */}
                  <TouchableOpacity
                    style={styles.periodPill}
                    onPress={() =>
                      setFormData((p) => ({
                        ...p,
                        reminderPeriod: p.reminderPeriod === 'AM' ? 'PM' : 'AM',
                      }))
                    }
                    activeOpacity={0.8}
                  >
                    <Text style={styles.periodText}>{formData.reminderPeriod}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Step 11 (Onboarding 12): Final Review & Submit */}
            {step === 11 && (
              <View style={styles.stepContainer}>
                <Text style={styles.stepPrompt}>You're all set! Ready to join Memory Lane?</Text>
                <View style={styles.summaryCard}>
                  <Text style={styles.summaryTitle}>Your Profile Summary</Text>
                  <Text style={styles.summaryItem}>
                    <Text style={styles.boldLabel}>Name: </Text>
                    {formData.fullName}
                  </Text>
                  <Text style={styles.summaryItem}>
                    <Text style={styles.boldLabel}>Email: </Text>
                    {formData.email}
                  </Text>
                  <Text style={styles.summaryItem}>
                    <Text style={styles.boldLabel}>Age Range: </Text>
                    {formData.ageRange}
                  </Text>
                  <Text style={styles.summaryItem}>
                    <Text style={styles.boldLabel}>Relaxation Audio: </Text>
                    {formData.audioGenres.length > 0
                      ? formData.audioGenres.join(', ')
                      : 'None selected'}
                  </Text>
                  <Text style={styles.summaryItem}>
                    <Text style={styles.boldLabel}>Brain Games: </Text>
                    {formData.brainGames.length > 0
                      ? formData.brainGames.join(', ')
                      : 'None selected'}
                  </Text>
                  <Text style={styles.summaryItem}>
                    <Text style={styles.boldLabel}>Daily Reminder: </Text>
                    {formData.notificationsEnabled
                      ? `${formData.reminderHour}:${formData.reminderMinute} ${formData.reminderPeriod}`
                      : 'Disabled'}
                  </Text>
                </View>
              </View>
            )}

            {/* Action Button at bottom */}
            <View style={styles.bottomSection}>
              <TouchableOpacity
                style={[styles.nextButton, isSubmitting && styles.buttonDisabled]}
                onPress={handleNext}
                disabled={isSubmitting}
                activeOpacity={0.85}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.nextButtonText}>
                    {step === 10 ? 'Continue' : step === 11 ? 'Get Started' : 'Next'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </OnboardingBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  stepIndicator: {
    fontSize: 13,
    color: '#5B6E4E',
    fontWeight: '500',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  stepContainer: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
    alignSelf: 'center',
    marginTop: 20,
    gap: 20,
  },
  stepPrompt: {
    fontSize: 17,
    fontWeight: '500',
    color: '#2E3D27',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 12,
  },
  pillInput: {
    backgroundColor: '#FFFFFF',
    height: 48,
    width: '100%',
    borderRadius: 24,
    paddingHorizontal: 20,
    fontSize: 15,
    color: '#263421',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#DFE5D8',
    textAlign: 'center',
  },
  inputGroup: {
    width: '100%',
    gap: 10,
  },
  ageRangeGrid: {
    width: '100%',
    gap: 12,
  },
  dropdownPill: {
    backgroundColor: '#FFFFFF',
    height: 46,
    borderRadius: 23,
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
  selectedDropdownPill: {
    backgroundColor: '#87A46E',
    borderColor: '#738F5C',
  },
  dropdownPillText: {
    fontSize: 15,
    color: '#38472E',
    fontWeight: '500',
  },
  selectedPillText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  ratingNumberGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
    marginTop: 10,
  },
  ratingPill: {
    width: 52,
    height: 52,
    borderRadius: 26,
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
  selectedRatingPill: {
    backgroundColor: '#87A46E',
    borderColor: '#738F5C',
  },
  ratingText: {
    fontSize: 16,
    color: '#38472E',
    fontWeight: '600',
  },
  selectedRatingText: {
    color: '#FFFFFF',
  },
  ratingLabel: {
    fontSize: 14,
    color: '#556847',
    marginTop: 8,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    rowGap: 14,
  },
  cardItem: {
    width: '48%',
    height: 78,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8DC',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  selectedCardItem: {
    backgroundColor: '#87A46E',
    borderColor: '#738F5C',
  },
  cardText: {
    fontSize: 14,
    color: '#314128',
    fontWeight: '500',
    textAlign: 'center',
  },
  selectedCardText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  binaryChoiceContainer: {
    flexDirection: 'column',
    width: '100%',
    gap: 14,
    marginTop: 10,
  },
  binaryChoicePill: {
    height: 48,
    borderRadius: 24,
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
  selectedBinaryChoicePill: {
    backgroundColor: '#87A46E',
    borderColor: '#738F5C',
  },
  binaryChoiceText: {
    fontSize: 16,
    color: '#314128',
    fontWeight: '600',
  },
  selectedBinaryChoiceText: {
    color: '#FFFFFF',
  },
  timePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 20,
  },
  timePillInput: {
    width: 66,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '600',
    color: '#314128',
    borderWidth: 1,
    borderColor: '#DFE5D8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  colonSeparator: {
    fontSize: 22,
    fontWeight: '700',
    color: '#314128',
  },
  periodPill: {
    width: 66,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#87A46E',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  periodText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  summaryCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 18,
    padding: 20,
    width: '100%',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#2E3D27',
    marginBottom: 6,
    textAlign: 'center',
  },
  summaryItem: {
    fontSize: 14,
    color: '#425338',
    lineHeight: 20,
  },
  boldLabel: {
    fontWeight: '600',
    color: '#26331F',
  },
  bottomSection: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 10,
  },
  nextButton: {
    backgroundColor: '#7D9A63',
    height: 50,
    width: '100%',
    maxWidth: 320,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});

