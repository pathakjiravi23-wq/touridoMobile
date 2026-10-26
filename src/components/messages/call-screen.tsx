
import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { ChatUser } from '@/data/messages';

type Props = {
    user: ChatUser;
    onEndCall: () => void;
};

export default function CallScreen({ user, onEndCall }: Props) {
    return (
        <SafeAreaView className="flex-1 bg-black">
            <View className="flex-1 items-center justify-center">
                <Image
                    source={{ uri: user.avatar }}
                    className="h-28 w-28 rounded-full bg-gray-700"
                />
                <Text className="mt-5 text-2xl font-bold text-white">
                    {user.username}
                </Text>
                <Text className="mt-2 text-base text-gray-400">
                    Calling...
                </Text>
            </View>

            <View className="mb-14 flex-row items-center justify-center">
                <Pressable
                    onPress={onEndCall}
                    accessibilityRole="button"
                    accessibilityLabel="End call"
                    className="h-16 w-16 items-center justify-center rounded-full bg-red-500"
                >
                    <Ionicons
                        name="call"
                        size={28}
                        color="#FFFFFF"
                        style={{ transform: [{ rotate: '135deg' }] }}
                    />
                </Pressable>
            </View>
        </SafeAreaView>
    );
}
