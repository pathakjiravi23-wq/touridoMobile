import AttachmentSheet, { type Attachment } from '@/components/messages/attachment-sheet';
import VoiceRecorderBar from '@/components/messages/voice-recorder-bar';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';

type Props = {
    onSendText: (text: string) => void;
    onSendAttachment: (attachment: Attachment) => void;
    onSendVoice: (uri: string, durationMs: number) => void;
};

export default function ChatComposer({ onSendText, onSendAttachment, onSendVoice }: Props) {
    const [text, setText] = useState('');
    const [sheetVisible, setSheetVisible] = useState(false);
    const [recording, setRecording] = useState(false);

    const canSend = text.trim().length > 0;

    function handleSend() {
        if (!canSend) return;
        onSendText(text.trim());
        setText('');
    }

    // Recording takes over the whole composer row, same as WhatsApp.
    if (recording) {
        return (
            <View className="border-t border-gray-100 px-3 py-2">
                <VoiceRecorderBar
                    onCancel={() => setRecording(false)}
                    onSend={(uri, durationMs) => {
                        setRecording(false);
                        onSendVoice(uri, durationMs);
                    }}
                />
            </View>
        );
    }

    return (
        <View className="flex-row items-end border-t border-gray-100 px-3 py-2">
            <Pressable
                onPress={() => setSheetVisible(true)}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Add attachment"
                className="mb-1.5 mr-1 h-9 w-9 items-center justify-center rounded-full"
            >
                <Ionicons name="add-circle-outline" size={28} color="#404040" />
            </Pressable>

            <View className="mr-2 max-h-32 min-h-11 flex-1 justify-center rounded-3xl bg-gray-100 px-4">
                <TextInput
                    value={text}
                    onChangeText={setText}
                    placeholder="Message..."
                    placeholderTextColor="#9CA3AF"
                    multiline
                    className="py-2.5 text-base text-black"
                />
            </View>

            {/* Mic turns into Send the moment the user starts typing. */}
            <Pressable
                onPress={canSend ? handleSend : () => setRecording(true)}
                accessibilityRole="button"
                accessibilityLabel={canSend ? 'Send message' : 'Record voice message'}
                className="h-11 w-11 items-center justify-center rounded-full bg-black"
            >
                <Ionicons name={canSend ? 'arrow-up' : 'mic'} size={22} color="#FFFFFF" />
            </Pressable>

            <AttachmentSheet
                visible={sheetVisible}
                onClose={() => setSheetVisible(false)}
                onPick={onSendAttachment}
            />
        </View>
    );
}