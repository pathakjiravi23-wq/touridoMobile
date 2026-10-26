import { Ionicons } from '@expo/vector-icons';
import {
    RecordingPresets,
    requestRecordingPermissionsAsync,
    setAudioModeAsync,
    useAudioRecorder,
    useAudioRecorderState,
} from 'expo-audio';
import { useEffect, useRef } from 'react';
import { Alert, Animated, Pressable, Text, View } from 'react-native';
import { formatDuration } from './voice-message';

type Props = {
    onCancel: () => void;
    onSend: (uri: string, durationMs: number) => void;
};

// Mounts when recording starts and begins recording immediately.
export default function VoiceRecorderBar({ onCancel, onSend }: Props) {
    const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
    const state = useAudioRecorderState(recorder, 200);
    const pulse = useRef(new Animated.Value(1)).current;

    // Tracks whether *we* already stopped/released the recorder, so the
    // unmount cleanup never calls stop() on an already-released native object.
    const finishedRef = useRef(false);

    useEffect(() => {
        const loop = Animated.loop(
            Animated.sequence([
                Animated.timing(pulse, { toValue: 0.25, duration: 600, useNativeDriver: true }),
                Animated.timing(pulse, { toValue: 1, duration: 600, useNativeDriver: true }),
            ])
        );
        loop.start();
        return () => loop.stop();
    }, [pulse]);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            const permission = await requestRecordingPermissionsAsync();
            if (!permission.granted) {
                Alert.alert('Microphone access needed', 'Allow microphone access in Settings to send voice messages.');
                finishedRef.current = true;
                onCancel();
                return;
            }
            await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
            if (cancelled) return;
            await recorder.prepareToRecordAsync();
            if (cancelled) return;
            recorder.record();
        })().catch(() => {
            finishedRef.current = true;
            onCancel();
        });

        return () => {
            cancelled = true;
            if (!finishedRef.current) {
                finishedRef.current = true;
                try {
                    recorder.stop().catch(() => { });
                } catch { }
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function handleSend() {
        if (finishedRef.current) return;
        const durationMs = state.durationMillis;
        finishedRef.current = true;
        try {
            await recorder.stop();
            await setAudioModeAsync({ allowsRecording: false });
        } catch { }
        if (recorder.uri && durationMs > 500) onSend(recorder.uri, durationMs);
        else onCancel();
    }

    async function handleCancel() {
        if (finishedRef.current) {
            onCancel();
            return;
        }
        finishedRef.current = true;
        try {
            await recorder.stop();
            await setAudioModeAsync({ allowsRecording: false });
        } catch { }
        onCancel();
    }

    return (
        <View className="flex-row items-center">
            <Pressable
                onPress={handleCancel}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Cancel recording"
                className="h-12 w-12 items-center justify-center"
            >
                <Ionicons name="trash-outline" size={24} color="#E5484D" />
            </Pressable>

            <View className="mx-1 h-12 flex-1 flex-row items-center rounded-3xl bg-gray-100 px-4">
                <Animated.View
                    style={{ opacity: pulse }}
                    className="h-3 w-3 rounded-full bg-red-500"
                />
                <Text className="ml-3 text-base font-medium text-black">
                    {formatDuration(state.durationMillis)}
                </Text>
                <Text className="ml-3 flex-1 text-sm text-gray-400">Recording...</Text>
            </View>

            <Pressable
                onPress={handleSend}
                accessibilityRole="button"
                accessibilityLabel="Send voice message"
                className="ml-2 h-12 w-12 items-center justify-center rounded-full bg-black"
            >
                <Ionicons name="arrow-up" size={24} color="#FFFFFF" />
            </Pressable>
        </View>
    );
}