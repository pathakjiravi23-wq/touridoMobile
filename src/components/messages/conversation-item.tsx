import type { Conversation } from '@/data/messages';
import { Image, Pressable, Text, View } from 'react-native';

type Props = { conversation: Conversation; onPress: () => void };

export default function ConversationItem({ conversation, onPress }: Props) {
    const { user, lastMessage, time, unread } = conversation;

    return (
        <Pressable
            onPress={onPress}
            className="flex-row items-center px-5 py-3 active:bg-gray-50"
        >
            <Image
                source={{ uri: user.avatar }}
                className="h-14 w-14 rounded-full bg-gray-100"
            />

            <View className="ml-3 flex-1">
                <View className="flex-row items-center">
                    <Text
                        numberOfLines={1}
                        className={`flex-1 text-base text-black ${unread ? 'font-bold' : 'font-semibold'
                            }`}
                    >
                        {user.username}
                    </Text>
                    <Text className="ml-2 text-xs text-gray-400">{time}</Text>
                </View>

                <Text
                    numberOfLines={1}
                    className={`mt-0.5 text-sm ${unread ? 'font-semibold text-black' : 'text-gray-500'
                        }`}
                >
                    {lastMessage}
                </Text>
            </View>

            {unread && <View className="ml-3 h-2.5 w-2.5 rounded-full bg-blue-500" />}
        </Pressable>
    );
}