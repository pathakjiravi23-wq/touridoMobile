import { useNavigation } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { BackHandler, StatusBar, View } from 'react-native';

import { TAB_BAR_STYLE } from '@/components/app-tabs';
import ChatView from '@/components/messages/chat-view';
import InboxView from '@/components/messages/inbox-view';
import NewMessageSheet from '@/components/messages/new-message-sheet';
import type { ChatUser } from '@/data/messages';

export default function MessagesScreen() {
    const [activeUser, setActiveUser] = useState<ChatUser | null>(null);
    const [showNewMessage, setShowNewMessage] = useState(false);
    const navigation = useNavigation();

    const openChat = useCallback((user: ChatUser) => {
        setShowNewMessage(false);
        setActiveUser(user);
    }, []);

    const closeChat = useCallback(() => {
        setActiveUser(null);
    }, []);

    // Hide the tab bar only while a conversation is open.
    // `navigation` here is this tab screen's own navigation object, so
    // setOptions applies to the Tabs navigator's bar. (Calling it on
    // getParent() targeted the root navigators, which is why it never hid.)
    useEffect(() => {
        navigation.setOptions({
            tabBarStyle: activeUser
                ? { ...TAB_BAR_STYLE, display: 'none' as const }
                : TAB_BAR_STYLE,
        });
    }, [activeUser, navigation]);

    // Make sure the bar comes back if this screen unmounts mid-chat.
    useEffect(() => {
        return () => {
            navigation.setOptions({ tabBarStyle: TAB_BAR_STYLE });
        };
    }, [navigation]);

    // Android hardware back should close the chat, not leave Messages.
    useEffect(() => {
        if (!activeUser) return;

        const subscription = BackHandler.addEventListener(
            'hardwareBackPress',
            () => {
                closeChat();
                return true;
            },
        );

        return () => subscription.remove();
    }, [activeUser, closeChat]);

    return (
        <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            {activeUser ? (
                <ChatView
                    key={activeUser.id}
                    user={activeUser}
                    onBack={closeChat}
                />
            ) : (
                <InboxView
                    onOpenChat={openChat}
                    onCompose={() => setShowNewMessage(true)}
                />
            )}

            {showNewMessage && !activeUser && (
                <NewMessageSheet
                    onClose={() => setShowNewMessage(false)}
                    onSelectUser={openChat}
                />
            )}
        </View>
    );
}