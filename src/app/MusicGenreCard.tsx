import { Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { router } from 'expo-router';

type MusicGenreCardProp = {genre: string};

export default function MusicGenreCard({genre}: MusicGenreCardProp) {
    return <TouchableOpacity 
                style={styles.card} 
                activeOpacity={0.88}
                onPress={() => {
                    router.push({
                        pathname:'/meditation-start',
                        params: {selectedGenre: genre}
                    });
                }}>
            <Text style={styles.cardText}>{genre}</Text>
           </TouchableOpacity>
}

const styles = StyleSheet.create({
  card: {
    height: 148,
    borderRadius: 20,
    backgroundColor: '#7D9A63',
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
  cardText: {
    fontSize: 26,
    fontWeight: '500',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  }
});
