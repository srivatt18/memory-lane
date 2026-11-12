import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Text
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import BottomNav from './bottomNav';
import BreathingCircleComponent from './BreathingCircleComponent';
import { useAudioPlayer } from 'expo-audio';
import { useEffect } from 'react';
import { useLocalSearchParams, router } from 'expo-router';

export default function MeditationSessionScreen() {

  const musicMapping: Record<string, any> = {
    Ambient: require('../../assets/meditation-music/Ambient.mp4'),
    Classical: require('../../assets/meditation-music/Classical.mp4'),
    Nature: require('../../assets/meditation-music/NatureSounds.mp4'),
    'Lo-Fi': require('../../assets/meditation-music/Lofi.mp4')
  };

  const { selectedGenre } = useLocalSearchParams<{selectedGenre: string;}>();

  const selectedMusicFile = musicMapping[selectedGenre];

  const musicPlayer = useAudioPlayer(selectedMusicFile);

  //start playing music on page load and have it continuosuly play until user ends the session
  useEffect(() => {
    musicPlayer.loop = true;
    musicPlayer.play();

    return () => {
      musicPlayer.pause();
    };
  }, [musicPlayer])

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
            <TouchableOpacity 
                style={styles.stopBtn} 
                activeOpacity={0.88}
                onPress={() => {
                    musicPlayer.pause();
                    router.push({
                        pathname:'/meditation-start'
                    });
                }}>
              <Text style={styles.stopBtnText}>Stop</Text>
           </TouchableOpacity>
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
  },
  stopBtn: {
    height: 100,
    maxWidth: 300,
    borderRadius: 50,
    backgroundColor: '#e22323',
    justifyContent: 'center',
    margin: 50,
    marginTop: 80
  },
  stopBtnText: {
    fontSize: 30,
    fontWeight: '700',
    textAlign: 'center',
    color: '#FFFFFF',
  }

});