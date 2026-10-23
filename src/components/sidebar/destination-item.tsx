import { Image, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type DestinationItemProps = {
    name: string;
    state: string;
    explorers: string;
    image: string;
    onPress?: () => void;
};

export default function DestinationItem({
    name,
    state,
    explorers,
    image,
    onPress,
}: DestinationItemProps) {
    return (
        <View className="mb-3 flex-row items-center">
            <Image
                source={{ uri: image }}
                className="h-12 w-12 rounded-xl"
            />

            <View className="ml-3 flex-1">
                <Text className="text-sm font-bold text-neutral-900">
                    {name}
                </Text>
                <Text className="mt-0.5 text-xs text-neutral-500">
                    {state}
                </Text>
                <Text className="mt-0.5 text-xs font-medium text-green-700">
                    {explorers}
                </Text>
            </View>

            <Ionicons
                name="chevron-forward"
                size={17}
                color="#737373"
            />
        </View>
    );
}