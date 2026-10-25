export interface OnboardingData {
  fullName: string;
  email: string;
  password: string;
  ageRange: string;
  cognitiveWellnessRating: number;
  stressRating: number;
  responsibilityRating: number;
  audioGenres: string[];
  brainGames: string[];
  notificationsEnabled: boolean;
  reminderHour: string;
  reminderMinute: string;
  reminderPeriod: 'AM' | 'PM';
}

export interface UserProfile extends Partial<OnboardingData> {
  id?: string;
  userId?: string;
  createdAt?: string;
}

