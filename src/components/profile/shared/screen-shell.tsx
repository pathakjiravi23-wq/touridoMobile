import { Ionicons } from '@expo/vector-icons';
import { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { INK } from '../theme';

type Props = {
    title: string;
    onBack: () => void;
    icon?: 'close' | 'arrow-back';
    rightLabel?: string;
    onRightPress?: () => void;
    rightDisabled?: boolean;
    children: ReactNode;
};

export default function ScreenShell({
    title,
    onBack,
    icon = 'arrow-back',
    rightLabel,
    onRightPress,
    rightDisabled,
    children,
}: Props) {
    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
            <View className="h-14 flex-row items-center border-b border-neutral-200 px-4">
                <Pressable
                    onPress={onBack}
                    hitSlop={10}
                    accessibilityLabel="Back"
                    className="h-10 w-10 items-center justify-center"
                >
                    <Ionicons name={icon} size={24} color={INK} />
                </Pressable>

                <Text numberOfLines={1} className="flex-1 text-center text-base font-semibold text-neutral-950">
                    {title}
                </Text>

                {rightLabel ? (
                    <Pressable
                        onPress={onRightPress}
                        disabled={rightDisabled}
                        hitSlop={10}
                        className="h-10 items-end justify-center"
                        style={{ minWidth: 48 }}
                    >
                        <Text
                            className={`text-base font-semibold ${rightDisabled ? 'text-neutral-300' : 'text-neutral-950'
                                }`}
                        >
                            {rightLabel}
                        </Text>
                    </Pressable>
                ) : (
                    <View className="h-10" style={{ minWidth: 48 }} />
                )}
            </View>

            {children}
        </SafeAreaView>
    );
}