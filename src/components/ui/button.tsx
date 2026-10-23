
import { Pressable, Text } from 'react-native';

type ButtonProps = {
    title: string;
    onPress?: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
};

export function Button({
    title,
    onPress,
    variant = 'primary',
}: ButtonProps) {
    const buttonStyle = {
        primary: 'bg-black',
        secondary: 'bg-gray-100',
        outline: 'border border-gray-300 bg-white',
    }[variant];

    const textStyle =
        variant === 'primary'
            ? 'text-white'
            : 'text-gray-900';

    return (
        <Pressable
            onPress={onPress}
            className={`items-center justify-center rounded-full px-6 py-3 ${buttonStyle}`}
        >
            <Text className={`font-semibold ${textStyle}`}>
                {title}
            </Text>
        </Pressable>
    );
}
