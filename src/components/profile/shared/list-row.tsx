import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text } from 'react-native';

import { DANGER, FAINT, INK } from '../theme';

type Props = {
    label: string;
    value?: string;
    icon?: React.ComponentProps<typeof Ionicons>['name'];
    onPress?: () => void;
    danger?: boolean;
};

export default function ListRow({ label, value, icon, onPress, danger }: Props) {
    return (
        <Pressable
            onPress={onPress}
            className="flex-row items-center border-b border-neutral-100 px-5 py-4 active:bg-neutral-100"
        >
            {icon && <Ionicons name={icon} size={22} color={danger ? DANGER : INK} style={{ marginRight: 16 }} />}

            <Text className={`flex-1 text-base ${danger ? 'text-red-500' : 'text-neutral-950'}`}>
                {label}
            </Text>

            {value ? (
                <Text numberOfLines={1} className="ml-3 max-w-[50%] text-base text-neutral-400">
                    {value}
                </Text>
            ) : null}

            {onPress && !danger && (
                <Ionicons name="chevron-forward" size={18} color={FAINT} style={{ marginLeft: 6 }} />
            )}
        </Pressable>
    );
}