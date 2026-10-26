import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { Alert, Modal, Platform, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type Attachment = {
    kind: 'image' | 'video' | 'file';
    uri: string;
    name?: string;
};

type Props = {
    visible: boolean;
    onClose: () => void;
    onPick: (attachment: Attachment) => void;
};

type Option = {
    key: string;
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
    onPress: () => void;
};

export default function AttachmentSheet({ visible, onClose, onPick }: Props) {
    const insets = useSafeAreaInsets();

    async function pickFromGallery() {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images', 'videos'],
            allowsMultipleSelection: true,
            quality: 0.8,
        });
        if (result.canceled) return;
        result.assets.forEach((asset) =>
            onPick({
                kind: asset.type === 'video' ? 'video' : 'image',
                uri: asset.uri,
                name: asset.fileName ?? undefined,
            })
        );
    }

    async function openCamera() {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
            Alert.alert('Camera access needed', 'Allow camera access in Settings to take photos.');
            return;
        }
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images', 'videos'],
            quality: 0.8,
        });
        if (result.canceled) return;
        const asset = result.assets[0];
        onPick({
            kind: asset.type === 'video' ? 'video' : 'image',
            uri: asset.uri,
            name: asset.fileName ?? undefined,
        });
    }

    async function pickDocument() {
        const result = await DocumentPicker.getDocumentAsync({
            multiple: true,
            copyToCacheDirectory: true,
        });
        if (result.canceled) return;
        result.assets.forEach((asset) =>
            onPick({ kind: 'file', uri: asset.uri, name: asset.name })
        );
    }

    // Close the sheet first, then open the picker (iOS can't present both at once)
    function run(action: () => Promise<void>) {
        onClose();
        setTimeout(() => {
            action().catch(() => Alert.alert('Something went wrong', 'Please try again.'));
        }, Platform.OS === 'ios' ? 400 : 0);
    }

    const options: Option[] = [
        { key: 'gallery', label: 'Photos & videos', icon: 'images', color: '#7C3AED', onPress: () => run(pickFromGallery) },
        { key: 'camera', label: 'Camera', icon: 'camera', color: '#E11D48', onPress: () => run(openCamera) },
        { key: 'file', label: 'Document', icon: 'document-text', color: '#2563EB', onPress: () => run(pickDocument) },
    ];

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <Pressable className="flex-1 bg-black/40" onPress={onClose} />

            <View
                className="rounded-t-3xl bg-white px-6 pt-3"
                style={{ paddingBottom: Math.max(insets.bottom, 16) + 12 }}
            >
                <View className="mb-5 h-1 w-10 self-center rounded-full bg-gray-300" />

                <View className="flex-row justify-around">
                    {options.map((option) => (
                        <Pressable
                            key={option.key}
                            onPress={option.onPress}
                            className="items-center"
                            accessibilityRole="button"
                            accessibilityLabel={option.label}
                        >
                            <View
                                className="h-16 w-16 items-center justify-center rounded-full"
                                style={{ backgroundColor: option.color }}
                            >
                                <Ionicons name={option.icon} size={28} color="#FFFFFF" />
                            </View>
                            <Text className="mt-2 text-xs font-medium text-gray-700">
                                {option.label}
                            </Text>
                        </Pressable>
                    ))}
                </View>
            </View>
        </Modal>
    );
}