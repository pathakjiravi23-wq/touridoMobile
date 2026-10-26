
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    FlatList,
    Keyboard,
    Pressable,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import SearchField from '@/components/messages/search-field';
import UserRow from '@/components/messages/user-row';
import { USERS, type ChatUser } from '@/data/messages';

type Props = {
    onClose: () => void;
    onSelectUser: (user: ChatUser) => void;
};

const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function NewMessageSheet({
    onClose,
    onSelectUser,
}: Props) {
    const [query, setQuery] = useState('');
    const slideY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
    const backdropOpacity = useRef(new Animated.Value(0)).current;
    const closing = useRef(false);

    useEffect(() => {
        Animated.parallel([
            Animated.spring(slideY, {
                toValue: 0,
                useNativeDriver: true,
                tension: 65,
                friction: 12,
            }),
            Animated.timing(backdropOpacity, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start();

        return () => {
            Keyboard.dismiss();
        };
    }, [backdropOpacity, slideY]);

    const results = useMemo(() => {
        const search = query.trim().toLowerCase();

        if (!search) return USERS;

        return USERS.filter(
            (user) =>
                user.name.toLowerCase().includes(search) ||
                user.username.toLowerCase().includes(search),
        );
    }, [query]);

    function dismiss(callback?: () => void) {
        if (closing.current) return;
        closing.current = true;

        Keyboard.dismiss();

        Animated.parallel([
            Animated.timing(slideY, {
                toValue: SCREEN_HEIGHT,
                duration: 220,
                useNativeDriver: true,
            }),
            Animated.timing(backdropOpacity, {
                toValue: 0,
                duration: 180,
                useNativeDriver: true,
            }),
        ]).start(({ finished }) => {
            if (finished) {
                onClose();
                callback?.();
            }
        });
    }

    return (
        <View
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 100,
                elevation: 20,
            }}
        >
            <Animated.View
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.4)',
                    opacity: backdropOpacity,
                }}
            >
                <Pressable
                    style={{ flex: 1 }}
                    onPress={() => dismiss()}
                    accessibilityLabel="Close search"
                />
            </Animated.View>

            <Animated.View
                style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: '85%',
                    backgroundColor: '#FFFFFF',
                    borderTopLeftRadius: 24,
                    borderTopRightRadius: 24,
                    overflow: 'hidden',
                    transform: [{ translateY: slideY }],
                }}
            >
                <SafeAreaView
                    style={{ flex: 1, backgroundColor: '#FFFFFF' }}
                    edges={['bottom']}
                >
                    <View
                        style={{
                            width: 38,
                            height: 4,
                            borderRadius: 4,
                            backgroundColor: '#D1D5DB',
                            alignSelf: 'center',
                            marginTop: 10,
                            marginBottom: 8,
                        }}
                    />

                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingHorizontal: 16,
                            paddingVertical: 10,
                            gap: 12,
                        }}
                    >
                        <Pressable
                            onPress={() => dismiss()}
                            hitSlop={10}
                            accessibilityRole="button"
                            accessibilityLabel="Close"
                        >
                            <Ionicons
                                name="chevron-back"
                                size={26}
                                color="#111827"
                            />
                        </Pressable>

                        <View style={{ flex: 1 }}>
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
                        keyExtractor={(user) => user.id}
                        keyboardShouldPersistTaps="handled"
                        renderItem={({ item }) => (
                            <UserRow
                                user={item}
                                onPress={() => dismiss(() => onSelectUser(item))}
                            />
                        )}
                        ListHeaderComponent={
                            <Text
                                style={{
                                    paddingHorizontal: 20,
                                    paddingVertical: 12,
                                    fontSize: 13,
                                    fontWeight: '600',
                                    color: '#6B7280',
                                }}
                            >
                                {query.trim() ? 'Search results' : 'Suggested people'}
                            </Text>
                        }
                        ListEmptyComponent={
                            <Text
                                style={{
                                    padding: 24,
                                    textAlign: 'center',
                                    color: '#6B7280',
                                    fontSize: 14,
                                }}
                            >
                                No people found for "{query}".
                            </Text>
                        }
                    />
                </SafeAreaView>
            </Animated.View>
        </View>
    );
}
