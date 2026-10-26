import type { ChatMessage } from '@/data/messages';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useVideoPlayer, VideoView } from 'expo-video';
import {
    Modal,
    Pressable,
    ScrollView,
    StatusBar,
    Text,
    useWindowDimensions,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
    message: ChatMessage | null;
    title: string;
    onClose: () => void;
};

// Mounted only while a video is open, so the player is released on close.
function VideoPane({ uri, width, height }: { uri: string; width: number; height: number }) {
    const player = useVideoPlayer(uri, (p) => {
        p.play();
    });

    return (
        <VideoView
            player={player}
            style={{ width, height }}
            nativeControls
            contentFit="contain"
            allowsPictureInPicture={false}
            // textureView keeps our close button drawn above the video on Android.
            surfaceType="textureView"
        />
    );
}

// Full-screen viewer for photos and videos.
export default function MediaViewer({ message, title, onClose }: Props) {
    const insets = useSafeAreaInsets();
    const { width, height } = useWindowDimensions();
    const topInset = Math.max(insets.top, StatusBar.currentHeight ?? 0);

    const isVideo = message?.type === 'video';

    return (
        <Modal
            visible={!!message}
            animationType="fade"
            statusBarTranslucent
            onRequestClose={onClose}
        >
            <View style={{ flex: 1, backgroundColor: '#000000' }}>
                {message?.uri ? (
                    isVideo ? (
                        <View style={{ flex: 1, justifyContent: 'center' }}>
                            <VideoPane key={message.id} uri={message.uri} width={width} height={height} />
                        </View>
                    ) : (
                        <ScrollView
                            maximumZoomScale={4}
                            minimumZoomScale={1}
                            bouncesZoom
                            centerContent
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ width, height, justifyContent: 'center' }}
                        >
                            <Image
                                source={{ uri: message.uri }}
                                style={{ width, height }}
                                contentFit="contain"
                                transition={150}
                            />
                        </ScrollView>
                    )
                ) : null}

                {/* Header is last + zIndex/elevation so it always sits on top. */}
                <View
                    pointerEvents="box-none"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        zIndex: 10,
                        elevation: 10,
                        paddingTop: topInset + 8,
                        paddingBottom: 12,
                        paddingHorizontal: 12,
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: 'rgba(0,0,0,0.45)',
                    }}
                >
                    <Pressable
                        onPress={onClose}
                        hitSlop={12}
                        accessibilityRole="button"
                        accessibilityLabel="Close"
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'rgba(255,255,255,0.18)',
                            marginRight: 12,
                        }}
                    >
                        <Ionicons name="close" size={26} color="#FFFFFF" />
                    </Pressable>

                    <View>
                        <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '600' }}>
                            {title}
                        </Text>
                        <Text style={{ color: '#D1D5DB', fontSize: 12 }}>{message?.time}</Text>
                    </View>
                </View>
            </View>
        </Modal>
    );
}