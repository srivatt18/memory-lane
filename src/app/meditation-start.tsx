import {
  StyleSheet,
  Text,
  View,
  ScrollView
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import BottomNav from './bottomNav';

export default function MusicSelectionScreen() {
  const { selectedGenre } = useLocalSearchParams();
  const insets = useSafeAreaInsets();

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
        
            <View style={[styles.headerContent, { paddingTop: Math.max(insets.top, 10) + 220 }]}>
                <View style={styles.headerTopRow}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.greetingTitle}>{selectedGenre} Meditation</Text>
                        <Text style={styles.greetingSubtitle}>Sit in a quiet place and relax.{'\n'}Press stop when you are done.</Text>
                    </View>
                </View>
            </View>
        </View>

        {/* start button */}
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
    minHeight: 450,
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
    textAlign: 'center',
    marginBottom: 12
  },
  greetingSubtitle: {
    fontSize: 16,
    lineHeight: 22,
    color: '#34452A',
    marginTop: 8,
    fontWeight: '400',
    textAlign: 'center'
  },
  cardsContainer: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 24,
    gap: 18,
    justifyContent: 'center',
  }
});

