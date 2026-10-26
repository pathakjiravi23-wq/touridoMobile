import VoiceMessage from '@/components/messages/voice-message';
import type { ChatMessage } from '@/data/messages';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useVideoPlayer, type VideoThumbnail } from 'expo-video';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

type Props = {
    message: ChatMessage;
    onOpenMedia?: (message: ChatMessage) => void;
};

const clamp = (n: number, min: number, max: number) =>
    Math.min(max, Math.max(min, n));

function TimePill({ time }: { time: string }) {
    return (
        <View className="absolute bottom-1.5 right-1.5 rounded-full bg-black/50 px-2 py-0.5">
            <Text className="text-[11px] text-white">{time}</Text>
        </View>
    );
}

function ImageContent({ message, onOpen }: { message: ChatMessage; onOpen?: () => void }) {
    // Start square, then match the photo's real shape (limited so it never gets huge).
    const [ratio, setRatio] = useState(1);

    return (
        <Pressable onPress={onOpen} accessibilityRole="imagebutton" accessibilityLabel="Open photo">
            <View
                className="overflow-hidden rounded-2xl bg-gray-200"
                style={{ width: 240, aspectRatio: ratio }}
            >
                <Image
                    source={{ uri: message.uri }}
                    style={{ width: '100%', height: '100%' }}
                    contentFit="cover"
                    transition={150}
                    onLoad={(e) => {
                        const { width, height } = e.source;
                        if (width && height) setRatio(clamp(width / height, 0.75, 1.5));
                    }}
                />
                <TimePill time={message.time} />
            </View>
        </Pressable>
    );
}

function VideoContent({ message, onOpen }: { message: ChatMessage; onOpen?: () => void }) {
    // This player is only used to grab a preview frame. It never plays in the bubble.
    const player = useVideoPlayer(message.uri ?? null);
    const [thumb, setThumb] = useState<VideoThumbnail | null>(null);

    useEffect(() => {
        let active = true;
        let started = false;

        async function generate() {
            if (started) return;
            started = true;
            try {
                const [frame] = await player.generateThumbnailsAsync([0.5]);
                if (active && frame) setThumb(frame);
            } catch {
                // Falls back to the dark card below.
            }
        }

        if (player.status === 'readyToPlay') generate();
        const sub = player.addListener('statusChange', ({ status }) => {
            if (status === 'readyToPlay') generate();
        });

        return () => {
            active = false;
            sub.remove();
        };
    }, [player]);

    const ratio = thumb ? clamp(thumb.width / thumb.height, 0.75, 1.5) : 1.5;

    return (
        <Pressable onPress={onOpen} accessibilityRole="button" accessibilityLabel="Play video">
            <View
                className="items-center justify-center overflow-hidden rounded-2xl bg-gray-800"
                style={{ width: 240, aspectRatio: ratio }}
            >
                {thumb ? (
                    <Image
                        source={thumb}
                        style={{ width: '100%', height: '100%', position: 'absolute' }}
                        contentFit="cover"
                    />
                ) : null}
                <View className="h-14 w-14 items-center justify-center rounded-full bg-black/50">
                    <Ionicons name="play" size={28} color="#FFFFFF" />
                </View>
                <TimePill time={message.time} />
            </View>
        </Pressable>
    );
}

export default function MessageBubble({ message, onOpenMedia }: Props) {
    const mine = message.fromMe;
    const textColor = mine ? 'text-white' : 'text-gray-900';
    const isMedia = message.type === 'image' || message.type === 'video';

    function renderContent() {
        switch (message.type) {
            case 'image':
                return <ImageContent message={message} onOpen={() => onOpenMedia?.(message)} />;
            case 'video':
                return <VideoContent message={message} onOpen={() => onOpenMedia?.(message)} />;
            case 'file':
                return (
                    <View className="flex-row items-center">
                        <Ionicons
                            name="document-text-outline"
                            size={22}
                            color={mine ? '#FFFFFF' : '#111111'}
                        />
                        <Text numberOfLines={1} className={`ml-2 max-w-[160px] text-sm ${textColor}`}>
                            {message.fileName ?? 'Document'}
                        </Text>
                    </View>
                );
            case 'voice':
                return (
                    <VoiceMessage uri={message.uri!} durationMs={message.durationMs ?? 0} mine={mine} />
                );
            default:
                return <Text className={`text-base ${textColor}`}>{message.text}</Text>;
        }
    }

    return (
        <View className={`mb-2 px-4 ${mine ? 'items-end' : 'items-start'}`}>
            <View
                className={`max-w-[80%] rounded-3xl ${isMedia ? 'p-1' : 'px-4 py-2.5'} ${mine ? 'rounded-br-md bg-black' : 'rounded-bl-md bg-gray-100'
                    }`}
            >
                {renderContent()}
            </View>
            {/* Photos and videos show the time on top of the media instead. */}
            {!isMedia && <Text className="mt-1 text-[11px] text-gray-400">{message.time}</Text>}
        </View>
    );
}