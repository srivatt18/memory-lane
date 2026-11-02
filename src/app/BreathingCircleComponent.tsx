import { useEffect, useState } from 'react';
import { View, StyleSheet, Text} from 'react-native';
import Animated, { useSharedValue, withRepeat, withTiming, withSequence, withDelay, useAnimatedStyle} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';


export default function BreathingCircleComponent() {
    const [circleText, setCircleText] = useState('Ready');
    //shared val for animation
    const circleSize = useSharedValue(2);

    useEffect(() => {
        circleSize.value = withRepeat(
            withSequence(
                //pause for 4 seconds: - 4 seconds for each step fo box breathing
                withDelay(4000, withTiming(2, {duration: 0}, () => {
                    scheduleOnRN(setCircleText, "Breathe In")
                })),
                //expand for 4 seconds:
                withTiming(3,{duration: 4000}, () => {
                    scheduleOnRN(setCircleText, "Hold")
                }),
                //pause for 4 seconds:
                withDelay(4000, withTiming(3, {duration: 0}, () => {
                    scheduleOnRN(setCircleText, "Breathe Out")
                })),
                //shrink for 4 seconds:
                withTiming(2,{duration: 4000}, () => {
                    scheduleOnRN(setCircleText, "Hold")
                })
            ),
            -1,
            true
        );

    }, []);

    //make this animation sequence defined above into a style for the circle component that chenges dynamicaly
    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{scale: circleSize.value}]
        };
    });

    return (<View style={styles.circleContainer}>
        <View style={styles.outerCircle}>
            <Animated.View style={[styles.innerCircle, animatedStyle]}>
                <Text>{circleText}</Text>
            </Animated.View>
        </View>
    </View>)

}

const styles = StyleSheet.create({
    circleContainer: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff0b'
    },
    outerCircle: {
        height: 300,
        width: 300,
        backgroundColor: '#19d2d2d9',
        borderRadius: 150,
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerCircle: {
        height: 100,
        width: 100,
        backgroundColor: '#278989d9',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    }
});