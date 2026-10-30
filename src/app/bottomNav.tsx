import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

type TabType = 'games' | 'home' | 'relax' | null;

export default function BottomNav() {
    const [activeTab, setActiveTab] = useState<TabType>(null);
    const insets = useSafeAreaInsets();

    return <View
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
            // TODO: add gaming navigation here when implemented
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
}

const styles = StyleSheet.create({
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

