import { Ionicons } from '@expo/vector-icons';
import { TextInput, View } from 'react-native';

type Props = {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    autoFocus?: boolean;
};

export default function SearchField({
    value,
    onChangeText,
    placeholder = 'Search',
    autoFocus,
}: Props) {
    return (
        <View className="h-12 flex-row items-center rounded-2xl bg-gray-100 px-4">
            <Ionicons name="search-outline" size={20} color="#737373" />
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor="#9CA3AF"
                autoFocus={autoFocus}
                autoCapitalize="none"
                autoCorrect={false}
                className="ml-3 flex-1 text-base text-black"
            />
        </View>
    );
}