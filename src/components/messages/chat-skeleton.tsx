
import { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

function SkeletonBubble({
    mine,
    wide = false,
}: {
    mine: boolean;
    wide?: boolean;
}) {
    const opacity = useRef(new Animated.Value(0.35)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 0.9,
                    duration: 650,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.35,
                    duration: 650,
                    useNativeDriver: true,
                }),
            ]),
        );

        animation.start();

        return () => animation.stop();
    }, [opacity]);

    return (
        <View
            style={{
                alignItems: mine ? 'flex-end' : 'flex-start',
                marginBottom: 12,
                paddingHorizontal: 16,
            }}
        >
            <Animated.View
                style={{
                    opacity,
                    height: 40,
                    width: wide ? 220 : 140,
                    borderRadius: 18,
                    backgroundColor: '#E5E7EB',
                }}
            />
        </View>
    );
}

export default function ChatSkeleton() {
    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'flex-end',
                paddingBottom: 16,
            }}
        >
            <SkeletonBubble mine={false} wide />
            <SkeletonBubble mine />
            <SkeletonBubble mine={false} />
            <SkeletonBubble mine wide />
            <SkeletonBubble mine={false} wide />
            <SkeletonBubble mine />
        </View>
    );
}
