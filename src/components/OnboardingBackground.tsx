import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface Props {
  children: React.ReactNode;
}

export function OnboardingBackground({ children }: Props) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#EAE6DF', '#DFE6D5', '#CCD9BF', '#ADC09D', '#9BB18A']}
        locations={[0, 0.35, 0.65, 0.85, 1]}
        style={StyleSheet.absoluteFill}
      />
      {/* Decorative mountain silhouettes in background */}
      <View style={styles.mountainBack} />
      <View style={styles.mountainMid} />
      <View style={styles.mountainFront} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  mountainBack: {
    position: 'absolute',
    bottom: '22%',
    left: -60,
    right: -60,
    height: 140,
    backgroundColor: 'rgba(182, 199, 169, 0.35)',
    borderTopLeftRadius: 300,
    borderTopRightRadius: 260,
  },
  mountainMid: {
    position: 'absolute',
    bottom: '12%',
    left: -40,
    right: -80,
    height: 160,
    backgroundColor: 'rgba(155, 177, 138, 0.45)',
    borderTopLeftRadius: 280,
    borderTopRightRadius: 220,
  },
  mountainFront: {
    position: 'absolute',
    bottom: -20,
    left: -50,
    right: -50,
    height: 140,
    backgroundColor: 'rgba(130, 155, 112, 0.35)',
    borderTopLeftRadius: 320,
    borderTopRightRadius: 320,
  },
});

