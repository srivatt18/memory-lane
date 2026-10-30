import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

type GenreTypes = 'Ambient' | 'Classical' | 'Nature Sounds' | 'Lo-Fi' | null;
type TabType = 'home' | 'back' | null;

export default function MusicSelectionScreen() {
  const insets = useSafeAreaInsets();
  const [selectedGenre, setSelectedGenre] = useState<GenreTypes>(null);
  const [activeTab, setActiveTab] = useState<TabType>(null);

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
                <Text style={styles.greetingTitle}>Please Select Music for your Meditation Session</Text>
            </View>
          </View>
        </View>

        <View style={styles.cardsContainer}>
          <TouchableOpacity
            style={[styles.card, styles.brainGamesCard]}
            activeOpacity={0.88}
          >
            <Text style={styles.cardText}>example button</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>

      <View
        style={[
          styles.bottomNav,
          { paddingBottom: Math.max(insets.bottom, 16) },
        ]}
      >

        <TouchableOpacity
          style={styles.navItem}
          activeOpacity={0.7}
          onPress={() => {
            setActiveTab('home');
            router.push('/home');
          }}
        >
          <Ionicons
            name={activeTab === 'home' ? 'home' : 'home-outline'}
            size={27}
            color="#2D3B24"
          />
          <Text
            style={[
              styles.navLabel,
              activeTab === 'home' && styles.navLabelActive,
            ]}
          >
            Home
          </Text>
        </TouchableOpacity>

      </View>
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
  greetingTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2D3B24',
    letterSpacing: 0.3,
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
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0px -3px 12px rgba(0, 0, 0, 0.05)',
      },
    }),
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 4,
    minWidth: 70,
  },
  navLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4F5D48',
    marginTop: 4,
  },
  navLabelActive: {
    fontWeight: '700',
    color: '#2D3B24',
  },
});

