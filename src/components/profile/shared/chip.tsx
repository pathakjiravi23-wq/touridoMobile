import { Pressable, Text } from 'react-native';

type Props = { label: string; selected: boolean; onPress: () => void };

export default function Chip({ label, selected, onPress }: Props) {
    return (
        <Pressable
            onPress={onPress}
            className={`mb-2 mr-2 rounded-full border px-4 py-2 ${selected ? 'border-neutral-950 bg-neutral-950' : 'border-neutral-300 bg-white'
                }`}
        >
            <Text className={`text-sm font-medium ${selected ? 'text-white' : 'text-neutral-800'}`}>
                {label}
            </Text>
        </Pressable>
    );
}