import type { ChatUser } from '@/data/messages';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image, Pressable, Text, View } from 'react-native';

type Props = { user: ChatUser; onBack: () => void; onCall: () => void };

export default function ChatHeader({ user, onBack, onCall }: Props) {
    const router = useRouter();

    return (
        <View className="flex-row items-center border-b border-gray-100 px-4 py-3">
            <Pressable
                onPress={onBack}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Go back"
            >
                <Ionicons name="chevron-back" size={28} color="#111111" />
            </Pressable>

            <Image
                source={{ uri: user.avatar }}
                className="ml-2 h-10 w-10 rounded-full bg-gray-100"
            />

            <View className="ml-3 flex-1">
                <Text numberOfLines={1} className="text-base font-bold text-black">
                    {user.username}
                </Text>
                <Text numberOfLines={1} className="text-xs text-gray-500">
                    {user.name}
                </Text>
            </View>

            <Pressable
                onPress={onCall}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Call"
                className="mr-4"
            >
                <Ionicons name="call-outline" size={22} color="#404040" />
            </Pressable>

            <Pressable hitSlop={8}>
                <Ionicons name="ellipsis-horizontal" size={22} color="#404040" />
            </Pressable>
        </View>
    );
}