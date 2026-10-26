import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

type Props = {
    title: string;
    subtitle: string;
    actionLabel?: string;
    onAction?: () => void;
};

export default function EmptyState({ title, subtitle, actionLabel, onAction }: Props) {
    return (
        <View className="flex-1 items-center justify-center px-10 pb-24">
            <View className="mb-6 h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <Ionicons name="paper-plane-outline" size={28} color="#111111" />
            </View>

            <Text className="text-center text-2xl font-bold text-black">{title}</Text>
            <Text className="mt-2 text-center text-base text-gray-500">{subtitle}</Text>

            {actionLabel && onAction && (
                <Pressable
                    onPress={onAction}
                    className="mt-8 rounded-2xl bg-black px-8 py-3.5"
                >
                    <Text className="text-base font-semibold text-white">{actionLabel}</Text>
                </Pressable>
            )}
        </View>
    );
}