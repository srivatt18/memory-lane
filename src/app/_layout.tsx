import React, { useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
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
        <View
          style={[
            styles.canvas,
            Platform.OS === 'web' && styles.webCanvas,
          ]}
        >
          <View
            style={[
              styles.app,
              Platform.OS === 'web' && styles.phoneFrame,
            ]}
          >
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
          </View>
        </View>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  canvas: {
    flex: 1,
  },
  webCanvas: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D6DDCE',
  },
  app: {
    flex: 1,
    width: '100%',
  },
  phoneFrame: {
    maxWidth: 430,
    maxHeight: 932,
    overflow: 'hidden',
    borderRadius: 36,
    borderWidth: 1,
    borderColor: '#B7C1AF',
    backgroundColor: '#EAE6DF',
    boxShadow: '0px 12px 40px rgba(45, 59, 36, 0.18)',
  },
});
