import React, { useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OnboardingBackground } from '@/components/OnboardingBackground';
import { useAuth } from '@/context/AuthContext';

export default function WelcomeScreen() {
  const { session, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && session) {
      router.replace('/home');
    }
  }, [session, isLoading]);

  if (isLoading) {
    return (
      <OnboardingBackground>
        <SafeAreaView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6F8B52" />
        </SafeAreaView>
      </OnboardingBackground>
    );
  }

  return (
    <OnboardingBackground>
      <SafeAreaView style={styles.container}>
        <View style={styles.centerSection}>
          <Text style={styles.title}>Memory Lane</Text>
          <Text style={styles.subtitle}>Daily cognitive wellness & peace of mind</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.signupButton]}
            activeOpacity={0.85}
            onPress={() => router.push('/onboarding')}
          >
            <Text style={styles.signupButtonText}>Signup</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.loginButton]}
            activeOpacity={0.85}
            onPress={() => router.push('/login')}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </OnboardingBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 38,
    fontWeight: '600',
    color: '#2D3B24',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#556649',
    marginTop: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 14,
    marginBottom: 20,
  },
  button: {
    width: '100%',
    maxWidth: 320,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  signupButton: {
    backgroundColor: '#7D9A63',
  },
  signupButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  loginButton: {
    backgroundColor: '#748DA6',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});

