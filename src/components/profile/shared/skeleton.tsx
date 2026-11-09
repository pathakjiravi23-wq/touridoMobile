import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { INK } from '../theme';

type Props = { title?: string };

/** Shown while a lazy page loads. The header shows the page title right away. */
export function ScreenSkeleton({ title = '' }: Props) {
    const rotation = useSharedValue(0);

    useEffect(() => {
        rotation.value = withRepeat(
            withTiming(360, { duration: 900, easing: Easing.linear }),
            -1,
            false
        );
    }, [rotation]);

    const spin = useAnimatedStyle(() => ({
        transform: [{ rotate: `${rotation.value}deg` }],
    }));

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
            <View className="h-14 flex-row items-center border-b border-neutral-200 px-4">
                <View className="h-10 w-10 items-center justify-center">
                    <Ionicons name="arrow-back" size={24} color={INK} />
                </View>
                <Text
                    numberOfLines={1}
                    className="flex-1 text-center text-base font-semibold text-neutral-950"
                >
                    {title}
                </Text>
                <View className="h-10" style={{ minWidth: 48 }} />
            </View>

            <View className="flex-1 items-center justify-center">
                <Animated.View
                    style={spin}
                    className="h-14 w-14 rounded-full border-4 border-neutral-200 border-t-neutral-950"
                />
            </View>
        </SafeAreaView>
    );
}

export default ScreenSkeleton;