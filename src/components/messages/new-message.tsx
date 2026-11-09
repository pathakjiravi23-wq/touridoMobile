import SearchField from '@/components/messages/search-field';
import UserRow from '@/components/messages/user-row';
import { USERS } from '@/data/messages';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NewMessageScreen() {
    const router = useRouter();
    const [query, setQuery] = useState('');

    const results = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return USERS;
        return USERS.filter(
            (u) =>
                u.username.toLowerCase().includes(q) || u.name.toLowerCase().includes(q)
        );
    }, [query]);

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top']}>
            <View className="flex-row items-center px-4 py-3">
                <Pressable
                    onPress={() => router.back()}
                    hitSlop={8}
                    accessibilityRole="button"
                    accessibilityLabel="Go back"
                >
                    <Ionicons name="chevron-back" size={28} color="#111111" />
                </Pressable>
                <View className="ml-2 flex-1">
                    <SearchField
                        value={query}
                        onChangeText={setQuery}
                        placeholder="Search people"
                        autoFocus
                    />
                </View>
            </View>

            <FlatList
                data={results}
                keyExtractor={(item) => item.id}
                keyboardShouldPersistTaps="handled"
                ListHeaderComponent={
                    <Text className="px-5 pb-2 pt-3 text-sm font-semibold text-gray-500">
                        {query ? 'Results' : 'Suggested'}
                    </Text>
                }
                renderItem={({ item }) => (
                    <UserRow
                        user={item}
                        // replace: the search screen is swapped for the chat, so back -> inbox
                        onPress={() =>
                            router.replace({
                                pathname: '/messages/chat' as any,
                                params: { id: item.id },
                            })
                        }
                    />
                )}
                ListEmptyComponent={
                    <Text className="px-5 pt-6 text-center text-base text-gray-500">
                        No one found for "{query}".
                    </Text>
                }
            />
        </SafeAreaView>
    );
}