import type { ChatUser } from '@/data/messages';
import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, Text, View } from 'react-native';

type Props = { user: ChatUser; onPress: () => void };

export default function UserRow({ user, onPress }: Props) {
    return (
        <Pressable
            onPress={onPress}
            className="flex-row items-center px-5 py-3 active:bg-gray-50"
        >
            <Image
                source={{ uri: user.avatar }}
                className="h-12 w-12 rounded-full bg-gray-100"
            />
            <View className="ml-3 flex-1 border-b border-gray-100 pb-3 pt-1">
                <View className="flex-row items-center">
                    <Text className="text-base font-semibold text-black">{user.username}</Text>
                    {user.verified && (
                        <Ionicons
                            name="checkmark-circle"
                            size={16}
                            color="#0095F6"
                            style={{ marginLeft: 4 }}
                        />
                    )}
                </View>
                <Text className="mt-0.5 text-sm text-gray-500">{user.name}</Text>
            </View>
        </Pressable>
    );
}