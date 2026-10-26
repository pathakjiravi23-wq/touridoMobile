import { useEffect, useMemo, useRef, useState } from 'react';
import {
    FlatList,
    Keyboard,
    KeyboardAvoidingView,
    Modal,
    Platform,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import CallScreen from '@/components/messages/call-screen';
import ChatComposer from '@/components/messages/chat-composer';
import ChatHeader from '@/components/messages/chat-header';
import ChatSkeleton from '@/components/messages/chat-skeleton';
import MediaViewer from '@/components/messages/media-viewer';
import MessageBubble from '@/components/messages/message-bubble';
import {
    CONVERSATIONS,
    type ChatMessage,
    type ChatUser,
} from '@/data/messages';
import { useCall } from '@/hooks/use-call';

type Props = {
    user: ChatUser;
    onBack: () => void;
};

const nowTime = () =>
    new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
    });

function useKeyboardVisible() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const showEvent =
            Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
        const hideEvent =
            Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

        const show = Keyboard.addListener(showEvent, () => setVisible(true));
        const hide = Keyboard.addListener(hideEvent, () => setVisible(false));

        return () => {
            show.remove();
            hide.remove();
        };
    }, []);

    return visible;
}

export default function ChatView({ user, onBack }: Props) {
    const listRef = useRef<FlatList<ChatMessage>>(null);
    const insets = useSafeAreaInsets();
    const keyboardVisible = useKeyboardVisible();

    const [ready, setReady] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [viewing, setViewing] = useState<ChatMessage | null>(null);
    const call = useCall();

    useEffect(() => {
        let mounted = true;

        setReady(false);
        setMessages([]);

        // Demo delay to make the loading skeleton visible.
        const timer = setTimeout(() => {
            if (!mounted) return;

            const conversation = CONVERSATIONS.find(
                (item) => item.user.id === user.id,
            );

            setMessages(conversation?.messages ?? []);
            setReady(true);
        }, 700);

        return () => {
            mounted = false;
            clearTimeout(timer);
        };
    }, [user.id]);

    // Inverted list: newest message first in the data, drawn at the bottom.
    const inverted = useMemo(() => [...messages].reverse(), [messages]);

    function sendMessage(
        message: Omit<ChatMessage, 'id' | 'fromMe' | 'time'>,
    ) {
        setMessages((previous) => [
            ...previous,
            {
                ...message,
                id: `${Date.now()}-${previous.length}`,
                fromMe: true,
                time: nowTime(),
            },
        ]);

        requestAnimationFrame(() => {
            // Offset 0 is the bottom (newest) in an inverted list.
            listRef.current?.scrollToOffset({ offset: 0, animated: true });
        });
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
            <ChatHeader
                user={user}
                onBack={onBack}
                onCall={() => call.startCall(user)}
            />

            {/* The only keyboard-avoidance layer. */}
            <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
                <View style={{ flex: 1 }}>
                    {ready ? (
                        <FlatList
                            ref={listRef}
                            data={inverted}
                            inverted
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <MessageBubble message={item} onOpenMedia={setViewing} />
                            )}
                            keyboardShouldPersistTaps="handled"
                            keyboardDismissMode={
                                Platform.OS === 'ios' ? 'interactive' : 'on-drag'
                            }
                            contentContainerStyle={{ paddingVertical: 8 }}
                        />
                    ) : (
                        <ChatSkeleton />
                    )}
                </View>

                {/* Bottom inset only while the keyboard is closed. */}
                <View
                    style={{
                        paddingBottom: keyboardVisible ? 0 : insets.bottom,
                        backgroundColor: '#FFFFFF',
                    }}
                >
                    <ChatComposer
                        onSendText={(text) => sendMessage({ type: 'text', text })}
                        onSendAttachment={(attachment) =>
                            sendMessage({
                                type: attachment.kind,
                                text: '',
                                uri: attachment.uri,
                                fileName: attachment.name,
                            })
                        }
                        onSendVoice={(uri, durationMs) =>
                            sendMessage({
                                type: 'voice',
                                text: '',
                                uri,
                                durationMs,
                            })
                        }
                    />
                </View>
            </KeyboardAvoidingView>

            <MediaViewer
                message={viewing}
                title={viewing?.fromMe ? 'You' : user.name}
                onClose={() => setViewing(null)}
            />

            {/* Call screen: full-screen overlay, no routing involved.
                Android back button ends the call. */}
            <Modal
                visible={call.status !== 'idle'}
                animationType="slide"
                statusBarTranslucent
                onRequestClose={call.endCall}
            >
                {call.user ? (
                    <CallScreen
                        user={call.user}
                        status={call.status}
                        seconds={call.seconds}
                        muted={call.muted}
                        speaker={call.speaker}
                        endReason={call.endReason}
                        demo={call.isMock}
                        onEnd={call.endCall}
                        onToggleMute={call.toggleMute}
                        onToggleSpeaker={call.toggleSpeaker}
                    />
                ) : null}
            </Modal>
        </View>
    );
}