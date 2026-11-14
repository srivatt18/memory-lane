import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import { AuthProvider } from '@/context/AuthContext';

export default function RootLayout() {
  useEffect(() => {
    if (Platform.OS === 'web') return;

    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const url = response.notification.request.content.data?.url;
      if (url) {
        router.replace(url as any);
      }
    });

    Notifications.getLastNotificationResponseAsync().then((response) => {
      const url = response?.notification.request.content.data?.url;
      if (url) {
        router.replace(url as any);
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'fade',
            contentStyle: { backgroundColor: '#EAE6DF' },
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="home" />
          <Stack.Screen name="games" />
          <Stack.Screen name="music-selection" />
          <Stack.Screen name="meditation-start" />
          <Stack.Screen name="meditation-session" />
          <Stack.Screen name="sudoku" />
          <Stack.Screen name="wordsearch" />
          <Stack.Screen name="crossword" />
        </Stack>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
