import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import BottomNav from './bottomNav';

interface GameItem {
  id: string;
  name: string;
  route?: '/sudoku' | '/wordsearch' | '/trivia' | '/crossword';
  available: boolean;
}

const GAMES: GameItem[] = [
  { id: 'sudoku', name: 'Sudoku', route: '/sudoku', available: true },
  { id: 'wordsearch', name: 'Word Search', route: '/wordsearch', available: true },
  { id: 'crossword', name: 'Crossword', route: '/crossword', available: true },
  { id: 'trivia', name: 'Trivia', route: '/trivia', available: true},
];

export default function GamesScreen() {
  const insets = useSafeAreaInsets();

  const handleGamePress = (game: GameItem) => {
    if (game.available && game.route) {
      router.push(game.route);
    } else {
      const msg = `${game.name} will be available soon!`;
      if (Platform.OS === 'web') {
        window.alert(msg);
      } else {
        Alert.alert('Coming Soon', msg);
      }
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

          <View style={[styles.headerContent, { paddingTop: Math.max(insets.top, 10) + 20 }]}>
            <View style={styles.headerTopRow}>
              <View style={styles.titleContainer}>
                <Text style={styles.greetingTitle}>Brain Games</Text>
                <Text style={styles.greetingSubtitle}>Choose a game to challenge your mind</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.cardsContainer}>
          {GAMES.map((game) => (
            <TouchableOpacity
              key={game.id}
              style={[styles.card, !game.available && styles.cardDisabled]}
              activeOpacity={0.88}
              onPress={() => handleGamePress(game)}
            >
              <View style={styles.cardContentRow}>
                <Text style={styles.cardText}>{game.name}</Text>
                {!game.available && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>Coming Soon</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <BottomNav currentTab="games" />
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
    minHeight: 190,
    backgroundColor: '#CCD9BF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  headerContent: {
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingBottom: 5,
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
    backgroundColor: '#748DA6',
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
  cardDisabled: {
    backgroundColor: '#8FA3B5',
  },
  cardContentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardText: {
    fontSize: 26,
    fontWeight: '500',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  badge: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
});
