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
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

type TabType = 'games' | 'home' | 'relax';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('home');

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
            setActiveTab('games');
            handleCardPress('Brain Games');
          }}
        >
          <MaterialCommunityIcons
            name="brain"
            size={28}
            color={activeTab === 'games' ? '#748DA6' : '#2D3B24'}
          />
          <Text
            style={[
              styles.navLabel,
              activeTab === 'games' && styles.navLabelActive,
            ]}
          >
            Games
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          activeOpacity={0.7}
          onPress={() => setActiveTab('home')}
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

        <TouchableOpacity
          style={styles.navItem}
          activeOpacity={0.7}
          onPress={() => {
            setActiveTab('relax');
            router.push('/music-selection');
          }}
        >
          <Ionicons
            name="leaf-outline"
            size={27}
            color={activeTab === 'relax' ? '#7D9A63' : '#2D3B24'}
          />
          <Text
            style={[
              styles.navLabel,
              activeTab === 'relax' && styles.navLabelActive,
            ]}
          >
            Relax
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

