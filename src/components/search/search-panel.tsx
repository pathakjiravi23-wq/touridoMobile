import { Ionicons } from '@expo/vector-icons';
import { MutableRefObject, useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import TripCard, { Trip } from './trip-card';

const TOPICS = [
    'Manali', 'Spiti Valley', 'Meghalaya', 'Darjeeling', 'Ladakh', 'Goa',
    'Kedarkantha trek', 'Sundarbans', 'Hampi', 'Rishikesh', 'Kerala backwaters', 'Jaisalmer',
];

const COMMUNITIES = [
    { id: 'c1', emoji: '🏔️', name: 'Himalayan Trekkers', type: 'Adventure', members: '12.4K' },
    { id: 'c2', emoji: '🧭', name: 'Weekend Tour Squad', type: 'Tour', members: '8.7K' },
    { id: 'c3', emoji: '🎭', name: 'Cultural Events India', type: 'Cultural events', members: '5.1K' },
    { id: 'c4', emoji: '📍', name: 'Hidden Places', type: 'Travel places', members: '19.2K' },
    { id: 'c5', emoji: '🏕️', name: 'Camping Crew', type: 'Adventure', members: '6.3K' },
    { id: 'c6', emoji: '🎒', name: 'Backpackers Bengal', type: 'Tour', members: '4.8K' },
];

const face = (n: number) => `https://i.pravatar.cc/150?img=${n}`;

const TRIPS: Trip[] = [
    {
        id: 't1', title: 'Manali to Spiti Road Trip', type: 'Adventure', city: 'Delhi',
        dates: '12 – 20 Nov', total: 8, avatars: [12, 47, 11, 32, 5, 15].map(face),
    },
    {
        id: 't2', title: 'Durga Puja Pandal Hopping', type: 'Event', city: 'Kolkata',
        dates: '18 – 21 Oct', total: 6, avatars: [47, 9, 25, 44].map(face),
    },
    {
        id: 't3', title: 'Coorg Coffee Trail', type: 'Tour', city: 'Bangalore',
        dates: '5 – 8 Dec', total: 6, avatars: [11, 3, 20, 60, 33].map(face),
    },
    {
        id: 't4', title: 'Hyderabad Food & Fort Walk', type: 'Tour', city: 'Hyderabad',
        dates: '29 – 30 Nov', total: 5, avatars: [8, 52].map(face),
    },
];

const FILTERS = ['All', 'Communities', 'Trip groups'] as const;
type Mode = 'home' | 'focused';

export default function SearchPanel({
    onClose,
    isOpen,
    backRef,
    onViewTrip = () => { },
    onViewCommunity = () => { },
}: {
    onClose: () => void;
    isOpen: boolean;
    backRef: MutableRefObject<(() => boolean) | null>;
    onViewTrip?: (id: string) => void; // TODO: navigate to trip details
    onViewCommunity?: (id: string) => void; // TODO: navigate to community
}) {
    const [mode, setMode] = useState<Mode>('home');
    const [query, setQuery] = useState('');
    const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All');
    const [showFilters, setShowFilters] = useState(false);

    function goHome() {
        setMode('home');
        setQuery('');
        setShowFilters(false);
    }

    function openFocused(q = '') {
        setQuery(q);
        setMode('focused');
    }

    // hardware back: focused -> home first, then provider closes the panel
    useEffect(() => {
        backRef.current = () => {
            if (mode === 'focused') {
                goHome();
                return true;
            }
            return false;
        };
        return () => {
            backRef.current = null;
        };
    }, [mode, backRef]);

    // reset when panel closes
    useEffect(() => {
        if (!isOpen) goHome();
    }, [isOpen]);

    const viewProps = { onViewTrip, onViewCommunity };

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top']}>
            {mode === 'home' ? (
                <Animated.View key="home" entering={FadeIn.duration(220)} exiting={FadeOut.duration(120)} className="flex-1">
                    <HomePage onBack={onClose} onOpenSearch={openFocused} {...viewProps} />
                </Animated.View>
            ) : (
                <Animated.View key="focused" entering={FadeIn.duration(220)} exiting={FadeOut.duration(120)} className="flex-1">
                    <FocusedPage
                        query={query}
                        setQuery={setQuery}
                        filter={filter}
                        setFilter={setFilter}
                        showFilters={showFilters}
                        setShowFilters={setShowFilters}
                        onBack={goHome}
                        {...viewProps}
                    />
                </Animated.View>
            )}
        </SafeAreaView>
    );
}

type ViewProps = {
    onViewTrip: (id: string) => void;
    onViewCommunity: (id: string) => void;
};

/* ---------------- Page 1: big "Search" title + suggestions ---------------- */
function HomePage({
    onBack,
    onOpenSearch,
    onViewTrip,
}: ViewProps & { onBack: () => void; onOpenSearch: (q?: string) => void }) {
    return (
        <View className="flex-1">
            <View className="flex-row items-center px-4 pb-1 pt-2">
                <Pressable onPress={onBack} hitSlop={12} className="mr-4">
                    <Ionicons name="chevron-back" size={26} color="#171717" />
                </Pressable>
                <Text className="text-4xl font-extrabold tracking-tight text-black">Search</Text>
            </View>

            {/* Fake input -> opens page 2 */}
            <Pressable
                onPress={() => onOpenSearch()}
                className="mx-4 mt-3 h-12 flex-row items-center rounded-2xl bg-gray-100 px-3"
            >
                <Ionicons name="search-outline" size={21} color="#737373" />
                <Text className="ml-2 text-base text-gray-400">Search</Text>
            </Pressable>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 16 }}
                >
                    {TOPICS.map((t) => (
                        <Pressable
                            key={t}
                            onPress={() => onOpenSearch(t)}
                            className="mr-2.5 rounded-full bg-gray-100 px-5 py-3"
                        >
                            <Text className="text-base text-gray-900">{t}</Text>
                        </Pressable>
                    ))}
                </ScrollView>

                <View className="h-px bg-gray-100" />

                <Text className="px-5 pb-3 pt-5 text-xl font-extrabold text-black">Trip groups</Text>
                <TripsRow trips={TRIPS} onViewTrip={onViewTrip} />
            </ScrollView>
        </View>
    );
}

/* ---------------- Page 2: focused search ---------------- */
function FocusedPage({
    query, setQuery, filter, setFilter, showFilters, setShowFilters, onBack,
    onViewTrip, onViewCommunity,
}: ViewProps & {
    query: string;
    setQuery: (v: string) => void;
    filter: (typeof FILTERS)[number];
    setFilter: (f: (typeof FILTERS)[number]) => void;
    showFilters: boolean;
    setShowFilters: (v: boolean) => void;
    onBack: () => void;
}) {
    const q = query.trim().toLowerCase();
    const searching = q.length > 0;
    const showC = filter !== 'Trip groups';
    const showT = filter !== 'Communities';

    const communities = useMemo(
        () => COMMUNITIES.filter((c) => !q || (c.name + c.type).toLowerCase().includes(q)),
        [q]
    );
    const trips = useMemo(
        () => TRIPS.filter((t) => !q || (t.title + t.city + t.type).toLowerCase().includes(q)),
        [q]
    );

    const half = Math.ceil(TOPICS.length / 2);
    const noResults =
        searching && (!showC || communities.length === 0) && (!showT || trips.length === 0);

    return (
        <View className="flex-1">
            <View className="flex-row items-center px-4 py-3">
                <Pressable onPress={onBack} hitSlop={12} className="mr-3">
                    <Ionicons name="chevron-back" size={26} color="#171717" />
                </Pressable>

                <View className="h-12 flex-1 flex-row items-center rounded-2xl bg-gray-100 px-3">
                    <Ionicons name="search-outline" size={21} color="#737373" />
                    <TextInput
                        value={query}
                        onChangeText={setQuery}
                        placeholder="Search"
                        placeholderTextColor="#9CA3AF"
                        returnKeyType="search"
                        className="ml-2 flex-1 text-base text-black"
                    />
                    {query.length > 0 && (
                        <Pressable onPress={() => setQuery('')} hitSlop={10} className="mr-2">
                            <Ionicons name="close-circle" size={19} color="#9CA3AF" />
                        </Pressable>
                    )}
                    <Pressable onPress={() => setShowFilters(!showFilters)} hitSlop={10}>
                        <Ionicons
                            name="options-outline"
                            size={22}
                            color={showFilters || filter !== 'All' ? '#000' : '#737373'}
                        />
                    </Pressable>
                </View>
            </View>

            {showFilters && (
                <View className="flex-row px-4 pb-3">
                    {FILTERS.map((f) => (
                        <Pressable
                            key={f}
                            onPress={() => setFilter(f)}
                            className={`mr-2 rounded-full px-4 py-2 ${filter === f ? 'bg-black' : 'bg-gray-100'}`}
                        >
                            <Text className={`text-sm font-semibold ${filter === f ? 'text-white' : 'text-gray-700'}`}>
                                {f}
                            </Text>
                        </Pressable>
                    ))}
                </View>
            )}

            <ScrollView
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40 }}
            >
                {!searching ? (
                    <>
                        <Text className="px-5 pb-3 pt-3 text-xl font-extrabold text-black">Topics picked for you</Text>
                        <ChipRows
                            rows={[TOPICS.slice(0, half), TOPICS.slice(half)].map((r) =>
                                r.map((t) => ({ key: t, label: t, onPress: () => setQuery(t) }))
                            )}
                        />

                        <View className="flex-row items-center justify-between px-5 pb-3 pt-5">
                            <Text className="text-xl font-extrabold text-black">Popular communities</Text>
                            <Pressable hitSlop={8}>
                                <Text className="text-base text-gray-400">See more</Text>
                            </Pressable>
                        </View>
                        <ChipRows
                            rows={[COMMUNITIES.slice(0, 3), COMMUNITIES.slice(3)].map((r) =>
                                r.map((c) => ({ key: c.id, label: c.name, emoji: c.emoji, onPress: () => setQuery(c.name) }))
                            )}
                        />
                    </>
                ) : (
                    <>
                        {showT && trips.length > 0 && (
                            <>
                                <Text className="px-5 pb-3 pt-3 text-lg font-extrabold text-black">Trip groups</Text>
                                <TripsRow trips={trips} onViewTrip={onViewTrip} />
                            </>
                        )}
                        {showC && communities.length > 0 && (
                            <>
                                <Text className="px-5 pb-1 pt-6 text-lg font-extrabold text-black">Communities</Text>
                                {communities.map((c) => (
                                    <CommunityRow key={c.id} c={c} onView={() => onViewCommunity(c.id)} />
                                ))}
                            </>
                        )}
                        {noResults && (
                            <View className="items-center px-8 pt-20">
                                <Ionicons name="compass-outline" size={44} color="#A3A3A3" />
                                <Text className="mt-3 text-base font-bold text-black">No results found</Text>
                                <Text className="mt-1 text-center text-sm text-gray-500">
                                    Try a different destination, community or trip.
                                </Text>
                            </View>
                        )}
                    </>
                )}
            </ScrollView>
        </View>
    );
}

/* ---------------- Shared bits ---------------- */
function TripsRow({
    trips, onViewTrip,
}: { trips: Trip[]; onViewTrip: (id: string) => void }) {
    // vertical stack, one card after another
    return (
        <View className="px-4">
            {trips.map((t) => (
                <TripCard key={t.id} trip={t} onView={() => onViewTrip(t.id)} />
            ))}
        </View>
    );
}

function ChipRows({
    rows,
}: { rows: { key: string; label: string; emoji?: string; onPress: () => void }[][] }) {
    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="px-5">
                {rows.map((row, i) => (
                    <View key={i} className="mb-2.5 flex-row">
                        {row.map((c) => (
                            <Pressable
                                key={c.key}
                                onPress={c.onPress}
                                className="mr-2.5 flex-row items-center rounded-full bg-gray-100 px-5 py-3"
                            >
                                {c.emoji && <Text className="mr-2 text-base">{c.emoji}</Text>}
                                <Text className="text-base text-gray-900">{c.label}</Text>
                            </Pressable>
                        ))}
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}

function CommunityRow({
    c, onView,
}: { c: (typeof COMMUNITIES)[number]; onView: () => void }) {
    return (
        <View className="flex-row items-start px-5 pt-4">
            <View className="h-11 w-11 items-center justify-center rounded-full bg-gray-100">
                <Text className="text-xl">{c.emoji}</Text>
            </View>
            <View className="ml-3 flex-1 flex-row items-center border-b border-gray-100 pb-4">
                <View className="mr-3 flex-1">
                    <Text numberOfLines={1} className="text-base font-bold text-gray-950">{c.name}</Text>
                    <Text numberOfLines={1} className="mt-0.5 text-sm text-gray-500">{c.type}</Text>
                    <Text className="mt-1 text-sm text-gray-900">{c.members} members</Text>
                </View>
                <Pressable
                    onPress={onView}
                    className="min-w-24 items-center rounded-xl border border-black bg-black px-4 py-2.5"
                >
                    <Text className="text-sm font-bold text-white">View</Text>
                </Pressable>
            </View>
        </View>
    );
}