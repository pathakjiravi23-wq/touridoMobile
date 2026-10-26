import type { ChatMessage } from '@/data/messages';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import {
    Modal,
    Pressable,
    ScrollView,
    Text,
    View,
    useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
    message: ChatMessage | null;
    title: string;
    onClose: () => void;
};

// Full-screen photo viewer. Pinch-to-zoom works on iOS via ScrollView zoom.
export default function ImageViewer({ message, title, onClose }: Props) {
    const insets = useSafeAreaInsets();
    const { width, height } = useWindowDimensions();

    return (
        <Modal
            visible={!!message}
            animationType="fade"
            statusBarTranslucent
            onRequestClose={onClose}
        >
            <View style={{ flex: 1, backgroundColor: '#000000' }}>
                <ScrollView
                    maximumZoomScale={4}
                    minimumZoomScale={1}
                    bouncesZoom
                    centerContent
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ width, height, justifyContent: 'center' }}
                >
                    {message?.uri ? (
                        <Image
                            source={{ uri: message.uri }}
                            style={{ width, height }}
                            contentFit="contain"
                            transition={150}
                        />
                    ) : null}
                </ScrollView>

                <View
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        paddingTop: insets.top + 8,
                        paddingBottom: 12,
                        paddingHorizontal: 12,
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: 'rgba(0,0,0,0.45)',
                    }}
                >
                    <Pressable
                        onPress={onClose}
                        hitSlop={10}
                        accessibilityRole="button"
                        accessibilityLabel="Close photo"
                        style={{ padding: 4, marginRight: 12 }}
                    >
                        <Ionicons name="close" size={28} color="#FFFFFF" />
                    </Pressable>

                    <View>
                        <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '600' }}>
                            {title}
                        </Text>
                        <Text style={{ color: '#D1D5DB', fontSize: 12 }}>
                            {message?.time}
                        </Text>
                    </View>
                </View>
            </View>
        </Modal>
    );
}