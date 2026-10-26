import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

type Props = { onCompose: () => void };

export default function MessagesHeader({ onCompose }: Props) {
    return (
        <View className="flex-row items-center justify-between px-5 pb-2 pt-3">
            <Text className="text-3xl font-extrabold tracking-tight text-black">
                Messages
            </Text>

            <Pressable
                onPress={onCompose}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="New message"
            >
                <Ionicons name="create-outline" size={26} color="#111111" />
            </Pressable>
        </View>
    );
}