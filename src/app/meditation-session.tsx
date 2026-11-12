import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Text, 
  Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import BottomNav from './bottomNav';
import BreathingCircleComponent from './BreathingCircleComponent';
import { useAudioPlayer } from 'expo-audio';
import { useLocalSearchParams, router, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

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
  useFocusEffect(useCallback(() => {
    musicPlayer.loop = true;
    musicPlayer.seekTo(0);
    musicPlayer.play();

    return () => {
      musicPlayer.pause();
    };
    }, [musicPlayer]));

  return (
    <View style={styles.screen}>
        <Image
        source={require('../../assets/meditationBackground.png')}
        style={styles.backImg} />
        <LinearGradient
            colors={['#eae6dfc4', '#dfe6d5c7', '#ccd9bfc4', '#adc09dcc', '#9bb18acd']}
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
          <TouchableOpacity 
            onPress={() => {
              router.back()}} 
            style={styles.backButton} 
            activeOpacity={0.7}>
           <Text style={styles.backArrow}>‹ Start Screen</Text>
          </TouchableOpacity>
            <BreathingCircleComponent />
            <TouchableOpacity 
                style={styles.stopBtn} 
                activeOpacity={0.88}
                onPress={() => {
                    router.back();
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
    position: 'relative'
  },
  scrollView: {
    flex: 1,
  },
  backImg: {
    ...StyleSheet.absoluteFill,
    height: '100%',
    width: '100%'
  },
  scrollContent: {
    flexGrow: 1,
  },
  backButton: {
    paddingTop: '100',
    paddingLeft: '20'
  },
  backArrow: {
    fontSize: 20,
    color: '#34452C',
    lineHeight: 30,
    fontWeight: '500',
  },
  stopBtn: {
    height: 90,
    maxWidth: 300,
    borderRadius: 50,
    backgroundColor: '#a35c5c',
    justifyContent: 'center',
    margin: 50,
    marginTop: 80,
    marginBottom: 70
  },
  stopBtnText: {
    fontSize: 30,
    fontWeight: '700',
    textAlign: 'center',
    color: '#FFFFFF',
  }

});