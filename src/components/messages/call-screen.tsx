import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { formatDuration } from '@/components/messages/voice-message';
import type { ChatUser } from '@/data/messages';
import type { CallStatus } from '@/hooks/use-call';

type Props = {
    user: ChatUser;
    status: CallStatus;
    seconds: number;
    muted: boolean;
    speaker: boolean;
    endReason: string | null;
    demo?: boolean;
    onEnd: () => void;
    onToggleMute: () => void;
    onToggleSpeaker: () => void;
};

function statusText(status: CallStatus, seconds: number, endReason: string | null) {
    switch (status) {
        case 'calling':
            return 'Calling...';
        case 'ringing':
            return 'Ringing...';
        case 'connected':
            return formatDuration(seconds * 1000);
        case 'ended':
            return endReason ?? 'Call ended';
        default:
            return '';
    }
}

function RoundButton({
    icon,
    label,
    active,
    onPress,
}: {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    active: boolean;
    onPress: () => void;
}) {
    return (
        <Pressable
            onPress={onPress}
            accessibilityRole="button"
            accessibilityLabel={label}
            className={`h-16 w-16 items-center justify-center rounded-full ${active ? 'bg-white' : 'bg-white/15'
                }`}
        >
            <Ionicons name={icon} size={26} color={active ? '#000000' : '#FFFFFF'} />
        </Pressable>
    );
}

export default function CallScreen({
    user,
    status,
    seconds,
    muted,
    speaker,
    endReason,
    demo,
    onEnd,
    onToggleMute,
    onToggleSpeaker,
}: Props) {
    const ended = status === 'ended';

    return (
        <SafeAreaView className="flex-1 bg-black">
            <View className="flex-1 items-center justify-center">
                <Image
                    source={{ uri: user.avatar }}
                    className="h-28 w-28 rounded-full bg-gray-700"
                />
                <Text className="mt-5 text-2xl font-bold text-white">{user.username}</Text>
                <Text className="mt-2 text-base text-gray-400">
                    {statusText(status, seconds, endReason)}
                </Text>
                {demo && (
                    <Text className="mt-6 text-xs text-gray-600">Demo call · no audio yet</Text>
                )}
            </View>

            <View className="mb-14 flex-row items-center justify-evenly px-8">
                <RoundButton
                    icon={muted ? 'mic-off' : 'mic'}
                    label={muted ? 'Unmute' : 'Mute'}
                    active={muted}
                    onPress={onToggleMute}
                />

                <Pressable
                    onPress={onEnd}
                    disabled={ended}
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

                <RoundButton
                    icon={speaker ? 'volume-high' : 'volume-medium'}
                    label={speaker ? 'Turn speaker off' : 'Turn speaker on'}
                    active={speaker}
                    onPress={onToggleSpeaker}
                />
            </View>
        </SafeAreaView>
    );
}