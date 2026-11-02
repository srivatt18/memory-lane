import {
  StyleSheet,
  View,
  ScrollView
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import BottomNav from './bottomNav';
import BreathingCircleComponent from './BreathingCircleComponent';

export default function MeditationSessionScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.screen}>
        <LinearGradient
            colors={['#EAE6DF', '#DFE6D5', '#CCD9BF', '#ADC09D', '#9BB18A']}
            locations={[0, 0.35, 0.65, 0.85, 1]}
            style={StyleSheet.absoluteFill}
            pointerEvents='none'
        />
        <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            bounces={false}
            showsVerticalScrollIndicator={false}
        >
            <BreathingCircleComponent />
        </ScrollView>
        <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  }

});