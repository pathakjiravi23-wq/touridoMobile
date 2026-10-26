
import { useMemo, useState } from 'react';
import { FlatList, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ConversationItem from '@/components/messages/conversation-item';
import EmptyState from '@/components/messages/empty-state';
import FilterChips, {
    type InboxFilter,
} from '@/components/messages/filter-chips';
import MessagesHeader from '@/components/messages/messages-header';
import SearchField from '@/components/messages/search-field';
import { CONVERSATIONS, type ChatUser } from '@/data/messages';

type Props = {
    onOpenChat: (user: ChatUser) => void;
    onCompose: () => void;
};

export default function InboxView({ onOpenChat, onCompose }: Props) {
    const [filter, setFilter] = useState<InboxFilter>('Inbox');
    const [query, setQuery] = useState('');

    const requestCount = useMemo(
        () => CONVERSATIONS.filter((item) => item.isRequest).length,
        [],
    );

    const conversations = useMemo(() => {
        const search = query.trim().toLowerCase();

        return CONVERSATIONS.filter((item) =>
            filter === 'Requests' ? item.isRequest : !item.isRequest,
        ).filter(
            (item) =>
                !search ||
                item.user.name.toLowerCase().includes(search) ||
                item.user.username.toLowerCase().includes(search),
        );
    }, [filter, query]);

    return (
        <SafeAreaView
            style={{ flex: 1, backgroundColor: '#FFFFFF' }}
            edges={['top']}
        >
            <MessagesHeader onCompose={onCompose} />

            <View style={{ paddingHorizontal: 20 }}>
                <SearchField
                    value={query}
                    onChangeText={setQuery}
                    placeholder="Search conversations"
                />
            </View>

            <FilterChips
                active={filter}
                onChange={setFilter}
                requestCount={requestCount}
            />

            <FlatList
                data={conversations}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <ConversationItem
                        conversation={item}
                        onPress={() => onOpenChat(item.user)}
                    />
                )}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
                ListEmptyComponent={
                    <EmptyState
                        title={
                            filter === 'Requests'
                                ? 'No requests'
                                : query.trim()
                                    ? 'No conversations found'
                                    : 'No messages yet'
                        }
                        subtitle={
                            filter === 'Requests'
                                ? 'Messages from people you do not follow will show up here.'
                                : 'Start a conversation with someone from the community.'
                        }
                        actionLabel="New message"
                        onAction={onCompose}
                    />
                }
            />
        </SafeAreaView>
    );
}
