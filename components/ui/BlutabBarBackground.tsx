import { BlurView } from 'expo-blur';
import { StyleSheet } from 'react-native';

export function BlurTabBarBackground() {
    return (
        <BlurView
            intensity={80}
            tint="light"
            style={{
                ...StyleSheet.absoluteFillObject,
                overflow: 'hidden',
            }}
        />
    );
}