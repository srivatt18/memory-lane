import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import BottomNav from './bottomNav';


export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { signOut } = useAuth();

  const handleSignOut = () => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Are you sure you want to log out?');
      if (confirmed) {
        signOut().then(() => router.replace('/'));
      }
      return;
    }

    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          router.replace('/');
        },
      },
    ]);
  };

  const handleCardPress = (activity: string) => {
    const msg =
      activity === 'Brain Games'
        ? 'Ready to challenge your memory and focus?'
        : 'Take a quiet moment for mindful breathing and calm.';

    if (Platform.OS === 'web') {
      window.alert(`${activity}\n\n${msg}`);
    } else {
      Alert.alert(activity, msg);
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerCard}>
          <LinearGradient
            colors={['#EAE6DF', '#DFE6D5', '#CCD9BF', '#ADC09D', '#9BB18A']}
            locations={[0, 0.35, 0.65, 0.85, 1]}
            style={StyleSheet.absoluteFill}
          />

          <View style={styles.mountainBack} />
          <View style={styles.mountainMid} />
          <View style={styles.mountainFront} />

          <View style={[styles.headerContent, { paddingTop: Math.max(insets.top, 20) + 12 }]}>
            <View style={styles.headerTopRow}>
              <View style={styles.titleContainer}>
                <Text style={styles.greetingTitle}>Nice to see you</Text>
                <Text style={styles.greetingSubtitle}>
                  How do you want to grow your{'\n'}cognitive wellness today!
                </Text>
              </View>

              <TouchableOpacity
                onPress={handleSignOut}
                style={styles.signOutButton}
                activeOpacity={0.7}
                accessibilityLabel="Log out"
              >
                <Ionicons name="log-out-outline" size={22} color="#2D3B24" />
              </TouchableOpacity>
            </View>

            <View style={styles.quoteWrapper}>
              <Text style={styles.quoteText}>“Take it easy”</Text>
            </View>
          </View>
        </View>

        <View style={styles.cardsContainer}>
          <TouchableOpacity
            style={[styles.card, styles.brainGamesCard]}
            activeOpacity={0.88}
            onPress={() => handleCardPress('Brain Games')}
          >
            <Text style={styles.cardText}>Brain Games</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.card, styles.meditationCard]}
            activeOpacity={0.88}
            onPress={() => router.push('/music-selection')}
          >
            <Text style={styles.cardText}>Meditation</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#EAE6DF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  headerCard: {
    position: 'relative',
    overflow: 'hidden',
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    minHeight: 290,
    backgroundColor: '#CCD9BF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  mountainBack: {
    position: 'absolute',
    bottom: 24,
    left: -60,
    right: -60,
    height: 120,
    backgroundColor: 'rgba(182, 199, 169, 0.35)',
    borderTopLeftRadius: 280,
    borderTopRightRadius: 240,
  },
  mountainMid: {
    position: 'absolute',
    bottom: 8,
    left: -40,
    right: -70,
    height: 130,
    backgroundColor: 'rgba(155, 177, 138, 0.45)',
    borderTopLeftRadius: 260,
    borderTopRightRadius: 200,
  },
  mountainFront: {
    position: 'absolute',
    bottom: -24,
    left: -40,
    right: -40,
    height: 110,
    backgroundColor: 'rgba(130, 155, 112, 0.35)',
    borderTopLeftRadius: 300,
    borderTopRightRadius: 300,
  },
  headerContent: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingBottom: 22,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
    paddingRight: 12,
  },
  greetingTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2D3B24',
    letterSpacing: 0.3,
  },
  greetingSubtitle: {
    fontSize: 16,
    lineHeight: 22,
    color: '#34452A',
    marginTop: 8,
    fontWeight: '400',
  },
  signOutButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  quoteWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 34,
    marginBottom: 4,
  },
  quoteText: {
    fontSize: 19,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.4,
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  cardsContainer: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 24,
    gap: 18,
    justifyContent: 'center',
  },
  card: {
    height: 148,
    borderRadius: 20,
    justifyContent: 'center',
    paddingHorizontal: 28,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
        cursor: 'pointer',
      },
    }),
  },
  brainGamesCard: {
    backgroundColor: '#748DA6',
  },
  meditationCard: {
    backgroundColor: '#7D9A63',
  },
  cardText: {
    fontSize: 26,
    fontWeight: '500',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  }
});

