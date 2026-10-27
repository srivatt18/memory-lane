import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/lib/supabase';
import { OnboardingData, UserProfile } from '@/types/auth';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUpWithOnboarding: (data: OnboardingData) => Promise<{ error: Error | null; needsEmailConfirmation?: boolean }>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_PROFILE_KEY = '@memory_lane_user_profile';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize auth session and listen for changes
  useEffect(() => {
    let mounted = true;

    async function initSession() {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error fetching session:', error.message);
        }
        if (mounted) {
          setSession(initialSession);
          setUser(initialSession?.user ?? null);
          if (initialSession?.user) {
            await loadProfile(initialSession.user);
          }
        }
      } catch (e) {
        console.error('Failed to restore session:', e);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    initSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      if (newSession?.user) {
        await loadProfile(newSession.user);
      } else {
        setProfile(null);
      }
      setIsLoading(false);
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  async function loadProfile(currentUser: User) {
    try {
      // 1. First check local storage for instant retrieval
      const localData = await AsyncStorage.getItem(`${LOCAL_PROFILE_KEY}_${currentUser.id}`);
      if (localData) {
        setProfile(JSON.parse(localData));
      } else if (currentUser.user_metadata) {
        const metaProfile: UserProfile = {
          fullName: currentUser.user_metadata.full_name || '',
          email: currentUser.email || '',
          ageRange: currentUser.user_metadata.age_range || '',
          cognitiveWellnessRating: currentUser.user_metadata.cognitive_wellness_rating ?? 5,
          stressRating: currentUser.user_metadata.stress_rating ?? 5,
          responsibilityRating: currentUser.user_metadata.responsibility_rating ?? 5,
          audioGenres: currentUser.user_metadata.audio_genres || [],
          brainGames: currentUser.user_metadata.brain_games || [],
          notificationsEnabled: currentUser.user_metadata.notifications_enabled ?? false,
          reminderHour: currentUser.user_metadata.reminder_hour || '08',
          reminderMinute: currentUser.user_metadata.reminder_minute || '00',
          reminderPeriod: currentUser.user_metadata.reminder_period || 'AM',
        };
        setProfile(metaProfile);
      }

      // 2. Try fetching from Supabase table if it exists
      const { data: remoteData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .maybeSingle();

      if (!error && remoteData) {
        const merged: UserProfile = {
          fullName: remoteData.full_name || currentUser.user_metadata?.full_name,
          email: currentUser.email || '',
          ageRange: remoteData.age_range || currentUser.user_metadata?.age_range,
          cognitiveWellnessRating: remoteData.cognitive_wellness_rating ?? currentUser.user_metadata?.cognitive_wellness_rating,
          stressRating: remoteData.stress_rating ?? currentUser.user_metadata?.stress_rating,
          responsibilityRating: remoteData.responsibility_rating ?? currentUser.user_metadata?.responsibility_rating,
          audioGenres: remoteData.audio_genres || currentUser.user_metadata?.audio_genres || [],
          brainGames: remoteData.brain_games || currentUser.user_metadata?.brain_games || [],
          notificationsEnabled: remoteData.notifications_enabled ?? currentUser.user_metadata?.notifications_enabled,
          reminderHour: remoteData.reminder_hour || currentUser.user_metadata?.reminder_hour,
          reminderMinute: remoteData.reminder_minute || currentUser.user_metadata?.reminder_minute,
          reminderPeriod: remoteData.reminder_period || currentUser.user_metadata?.reminder_period,
        };
        setProfile(merged);
        await AsyncStorage.setItem(`${LOCAL_PROFILE_KEY}_${currentUser.id}`, JSON.stringify(merged));
      }
    } catch (e) {
      console.warn('Could not load remote profile:', e);
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        return { error };
      }

      if (data.user) {
        await loadProfile(data.user);
      }

      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  }

  async function signUpWithOnboarding(data: OnboardingData) {
    try {
      const metadata = {
        full_name: data.fullName.trim(),
        age_range: data.ageRange,
        cognitive_wellness_rating: data.cognitiveWellnessRating,
        stress_rating: data.stressRating,
        responsibility_rating: data.responsibilityRating,
        audio_genres: data.audioGenres,
        brain_games: data.brainGames,
        notifications_enabled: data.notificationsEnabled,
        reminder_hour: data.reminderHour,
        reminder_minute: data.reminderMinute,
        reminder_period: data.reminderPeriod,
        onboarding_completed: true,
      };

      const { data: signUpResult, error } = await supabase.auth.signUp({
        email: data.email.trim(),
        password: data.password,
        options: {
          data: metadata,
        },
      });

      if (error) {
        return { error };
      }

      const registeredUser = signUpResult.user;
      if (signUpResult.session) {
        setSession(signUpResult.session);
        setUser(signUpResult.session.user);
      } else if (registeredUser) {
        setUser(registeredUser);
      }
      if (registeredUser) {
        const newProfile: UserProfile = {
          fullName: data.fullName.trim(),
          email: data.email.trim(),
          ageRange: data.ageRange,
          cognitiveWellnessRating: data.cognitiveWellnessRating,
          stressRating: data.stressRating,
          responsibilityRating: data.responsibilityRating,
          audioGenres: data.audioGenres,
          brainGames: data.brainGames,
          notificationsEnabled: data.notificationsEnabled,
          reminderHour: data.reminderHour,
          reminderMinute: data.reminderMinute,
          reminderPeriod: data.reminderPeriod,
        };

        setProfile(newProfile);
        await AsyncStorage.setItem(`${LOCAL_PROFILE_KEY}_${registeredUser.id}`, JSON.stringify(newProfile));

        try {
          await supabase.from('profiles').upsert({
            id: registeredUser.id,
            ...metadata,
            updated_at: new Date().toISOString(),
          });
        } catch {
        }
      }

      const needsEmailConfirmation = !signUpResult.session;

      return { error: null, needsEmailConfirmation };
    } catch (err) {
      return { error: err as Error };
    }
  }

  async function signOut() {
    try {
      await supabase.auth.signOut();
      if (user) {
        await AsyncStorage.removeItem(`${LOCAL_PROFILE_KEY}_${user.id}`);
      }
      setSession(null);
      setUser(null);
      setProfile(null);
    } catch (e) {
      console.error('Error signing out:', e);
    }
  }

  async function updateProfile(partial: Partial<UserProfile>) {
    if (!profile) return;
    const updated = { ...profile, ...partial };
    setProfile(updated);
    if (user) {
      await AsyncStorage.setItem(`${LOCAL_PROFILE_KEY}_${user.id}`, JSON.stringify(updated));
    }
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        isLoading,
        signIn,
        signUpWithOnboarding,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

