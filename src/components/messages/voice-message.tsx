import { Ionicons } from '@expo/vector-icons';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { Pressable, Text, View } from 'react-native';

export function formatDuration(ms: number) {
    const total = Math.max(0, Math.round(ms / 1000));
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
}

type Props = { uri: string; durationMs: number; mine: boolean };

export default function VoiceMessage({ uri, durationMs, mine }: Props) {
    const player = useAudioPlayer({ uri });
    const status = useAudioPlayerStatus(player);

    const total = status.duration > 0 ? status.duration : durationMs / 1000;
    const progress = total > 0 ? Math.min(status.currentTime / total, 1) : 0;

    function toggle() {
        if (status.playing) {
            player.pause();
            return;
        }
        if (status.didJustFinish || (total > 0 && status.currentTime >= total - 0.05)) {
            player.seekTo(0);
        }
        player.play();
    }

    const fg = mine ? '#FFFFFF' : '#111111';
    const track = mine ? 'bg-white/30' : 'bg-gray-300';
    const fill = mine ? 'bg-white' : 'bg-black';

    return (
        <View className="w-52 flex-row items-center">
            <Pressable
                onPress={toggle}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel={status.playing ? 'Pause voice message' : 'Play voice message'}
            >
                <Ionicons name={status.playing ? 'pause' : 'play'} size={26} color={fg} />
            </Pressable>

            <View className="mx-3 flex-1">
                <View className={`h-1 overflow-hidden rounded-full ${track}`}>
                    <View className={`h-1 rounded-full ${fill}`} style={{ width: `${progress * 100}%` }} />
                </View>
            </View>

            <Text className={`text-xs ${mine ? 'text-white' : 'text-gray-700'}`}>
                {formatDuration(status.playing ? status.currentTime * 1000 : durationMs)}
            </Text>
        </View>
    );
}