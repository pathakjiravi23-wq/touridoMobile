import { Pressable, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type SidebarMenuItemProps = {
    title: string;
    icon: keyof typeof Ionicons.glyphMap;
    onPress?: () => void;
};

export default function SidebarMenuItem({
    title,
    icon,
    onPress,
}: SidebarMenuItemProps) {
    return (
        <Pressable
            onPress={onPress}
            className="h-11 flex-row items-center rounded-lg px-1 active:bg-neutral-100"
        >
            <Ionicons name={icon} size={22} color="#404040" />
            <Text className="ml-3 text-sm font-medium text-neutral-800">
                {title}
            </Text>
        </Pressable>
    );
}