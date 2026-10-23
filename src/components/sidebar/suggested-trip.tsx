import { Image, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type SuggestedTripProps = {
    title: string;
    destination: string;
    dates: string;
    members: string;
    avatars: string[];
    onPress?: () => void;
};

export default function SuggestedTrip({
    title,
    destination,
    dates,
    members,
    avatars,
    onPress,
}: SuggestedTripProps) {
    return (
        <Pressable
            onPress={onPress}
            className="mb-2.5 rounded-xl border border-neutral-200 bg-white p-3 active:bg-neutral-50"
        >
            <View className="flex-row items-center">
                <View className="flex-row items-center">
                    {avatars.slice(0, 3).map((avatar, index) => (
                        <Image
                            key={`${avatar}-${index}`}
                            source={{ uri: avatar }}
                            className="h-8 w-8 rounded-full border-2 border-white"
                            style={{
                                marginLeft: index === 0 ? 0 : -9,
                                zIndex: 3 - index,
                            }}
                        />
                    ))}
                </View>

                <View className="ml-2.5 flex-1">
                    <Text
                        numberOfLines={1}
                        className="text-sm font-bold text-neutral-900"
                    >
                        {title}
                    </Text>
                    <Text
                        numberOfLines={1}
                        className="mt-0.5 text-xs text-neutral-500"
                    >
                        {destination}
                    </Text>
                </View>

                <Ionicons
                    name="chevron-forward"
                    size={16}
                    color="#737373"
                />
            </View>

            <View className="mt-3 flex-row items-center justify-between">
                <View className="flex-row items-center">
                    <Ionicons name="calendar-outline" size={14} color="#737373" />
                    <Text className="ml-1 text-xs text-neutral-600">
                        {dates}
                    </Text>
                </View>

                <Text className="text-xs font-semibold text-green-700">
                    {members}
                </Text>
            </View>
        </Pressable>
    );
}