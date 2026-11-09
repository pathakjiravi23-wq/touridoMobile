import { ProfileNavProvider, useProfileNav } from '@/components/profile/navigation/profile-navigator';
import SearchProvider, { useSearch } from '@/components/search/search-provider';
import { useCurrentUser } from '@/data/current-user';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Image, Pressable, ScrollView as RNScrollView, Text, View, useWindowDimensions } from 'react-native';
import Animated, {
    Easing,
    LinearTransition,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const INK = '#0A0A0A';
const MUTED = '#737373';

const TABS = [
    { key: 'Trips', cta: 'Start your first trip', hint: 'Trips you create or join will appear here.' },
    { key: 'Posts', cta: 'Share your first adventure', hint: 'Your stories from the road will appear here.' },
    { key: 'Media', cta: 'Add your first photo', hint: 'Your best frames from every journey.' },
    { key: 'Saved', cta: 'Explore places', hint: 'Places and trips you save will appear here.' },
] as const;

const STATUSES = [
    { emoji: '🏔️', label: 'Trekking' },
    { emoji: '✈️', label: 'Travelling' },
    { emoji: '🎒', label: 'Planning a trip' },
    { emoji: '🏠', label: 'Home, ready to go' },
];

const SUGGESTIONS = [
    { id: '1', name: 'Aarav Sharma', handle: 'aarav.travels', mutual: 12, avatar: 'https://i.pravatar.cc/200?img=12' },
    { id: '2', name: 'Priya Das', handle: 'priya.explores', mutual: 8, avatar: 'https://i.pravatar.cc/200?img=47' },
    { id: '3', name: 'Rohan Gupta', handle: 'rohan.ontheroad', mutual: 5, avatar: 'https://i.pravatar.cc/200?img=11' },
    { id: '4', name: 'Sneha Roy', handle: 'sneha.wanders', mutual: 3, avatar: 'https://i.pravatar.cc/200?img=32' },
];

const CARD_W = 164;

/** Eased 0 → 1 progress of `y` between `a` and `b`. Runs on the UI thread. */
function prog(y: number, a: number, b: number) {
    'worklet';
    const t = Math.min(1, Math.max(0, (y - a) / (b - a)));
    return 1 - Math.pow(1 - t, 3);
}

function SuggestionCard({
    person,
    requested,
    onToggle,
    onDismiss,
}: {
    person: (typeof SUGGESTIONS)[number];
    requested: boolean;
    onToggle: () => void;
    onDismiss: () => void;
}) {
    return (
        <Animated.View
            layout={LinearTransition.duration(260).easing(Easing.out(Easing.cubic))}
            style={{ width: CARD_W }}
            className="mr-3 items-center rounded-3xl border border-neutral-200 bg-neutral-50 px-3 pb-3 pt-6"
        >
            <Pressable
                onPress={onDismiss}
                hitSlop={12}
                className="absolute right-3 top-3"
                accessibilityLabel={`Dismiss ${person.name}`}
            >
                <Ionicons name="close" size={16} color="#A3A3A3" />
            </Pressable>

            <Image
                source={{ uri: person.avatar }}
                className="h-20 w-20 rounded-full border border-neutral-200 bg-neutral-100"
            />

            <Text numberOfLines={1} className="mt-3 text-base font-semibold text-neutral-950">
                {person.name}
            </Text>
            <Text numberOfLines={1} className="mt-0.5 text-sm text-neutral-400">
                {person.handle}
            </Text>
            <Text className="mt-1 text-xs text-neutral-500">{person.mutual} mutual connections</Text>

            <Pressable
                onPress={onToggle}
                className={`mt-3 w-full items-center rounded-xl py-2.5 active:opacity-80 ${requested ? 'border border-neutral-300 bg-white' : 'bg-neutral-950'
                    }`}
            >
                <Text className={`text-sm font-semibold ${requested ? 'text-neutral-500' : 'text-white'}`}>
                    {requested ? 'Requested' : 'Connect'}
                </Text>
            </Pressable>
        </Animated.View>
    );
}

function ProfileContent() {
    const { open: openSearch } = useSearch();
    const user = useCurrentUser();
    const { width, height } = useWindowDimensions();
    const nav = useProfileNav();
    const [activeIndex, setActiveIndex] = useState(0);
    const [people, setPeople] = useState(SUGGESTIONS);
    const [requested, setRequested] = useState<string[]>([]);
    const [statusIndex, setStatusIndex] = useState<number | null>(null);

    const scrollY = useSharedValue(0);
    const topH = useSharedValue(700);
    const tabsH = useSharedValue(54);
    const viewH = useSharedValue(height);
    const itemH = useSharedValue(90);
    const [viewHeight, setViewHeight] = useState(height * 0.8);
    const tabW = width / TABS.length;
    const indicatorX = useSharedValue(0);

    const onScroll = useAnimatedScrollHandler((e) => {
        scrollY.value = e.contentOffset.y;
    });

    const barTitle = useAnimatedStyle(() => {
        const p = prog(scrollY.value, 70, 150);
        return { opacity: p, transform: [{ translateY: 6 * (1 - p) }] };
    });

    const barBorder = useAnimatedStyle(() => ({
        opacity: prog(scrollY.value, 0, 50),
    }));

    const nameBlock = useAnimatedStyle(() => {
        const p = prog(scrollY.value, 0, 120);
        return {
            opacity: 1 - p,
            transform: [{ translateY: -10 * p }, { scale: 1 - 0.12 * p }],
            transformOrigin: 'left center',
        };
    });

    const avatarBlock = useAnimatedStyle(() => {
        const y = scrollY.value;
        const p = prog(y, 0, 130);
        const overscroll = y < 0 ? Math.min(0.15, -y / 600) : 0;
        return {
            opacity: 1 - prog(y, 30, 140),
            transform: [{ translateY: -14 * p }, { scale: 1 + overscroll - 0.5 * p }],
            transformOrigin: 'right top',
        };
    });

    const centeredContent = useAnimatedStyle(() => {
        const s = scrollY.value;
        const tabsTop = Math.max(topH.value - s, 0);
        const visibleTop = tabsTop + tabsH.value;
        const centerOnScreen = (visibleTop + viewH.value) / 2;
        const blockTopOnScreen = topH.value + tabsH.value - s;
        const y = centerOnScreen - blockTopOnScreen - itemH.value / 2;

        const space = viewH.value - visibleTop;
        const start = itemH.value + 20;
        const end = itemH.value + 160;
        const reveal = prog(space, start, end);

        return {
            opacity: reveal,
            transform: [{ translateY: Math.max(0, y) + (1 - reveal) * 80 }],
        };
    });

    const indicatorStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: indicatorX.value }],
    }));

    function selectTab(i: number) {
        setActiveIndex(i);
        indicatorX.value = withSpring(i * tabW, { damping: 22, stiffness: 240, mass: 0.8 });
    }

    function toggleRequest(id: string) {
        setRequested((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));
    }

    function cycleStatus() {
        setStatusIndex((i) => {
            if (i === null) return 0;
            return i + 1 >= STATUSES.length ? null : i + 1;
        });
    }

    const step = CARD_W + 12;
    const maxOffset = Math.max(0, people.length * step + 28 - width);
    const snapOffsets: number[] = [];
    for (let i = 0; i * step < maxOffset - step * 0.3; i++) snapOffsets.push(i * step);
    snapOffsets.push(maxOffset);

    const tab = TABS[activeIndex];
    const status = statusIndex === null ? null : STATUSES[statusIndex];

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top']}>
            {/* Fixed top bar */}
            <View className="h-14 flex-row items-center justify-between px-5">
                <Pressable
                    onPress={() => alert('Insights coming soon!')}
                    hitSlop={10}
                    className="h-10 w-10 items-start justify-center"
                >
                    <Ionicons name="bar-chart-outline" size={25} color={INK} />
                </Pressable>

                <Animated.Text
                    style={barTitle}
                    className="absolute left-0 right-0 text-center text-base font-semibold text-neutral-950"
                    pointerEvents="none"
                >
                    {user.name}
                </Animated.Text>

                <View className="flex-row items-center">
                    <Pressable onPress={openSearch} hitSlop={10} accessibilityLabel="Search" className="mr-5">
                        <Ionicons name="search-outline" size={25} color={INK} />
                    </Pressable>
                    <Pressable onPress={() => nav.push('settings')} hitSlop={10} accessibilityLabel="Settings">
                        <Ionicons name="settings-outline" size={25} color={INK} />
                    </Pressable>
                </View>

                <Animated.View
                    style={barBorder}
                    className="absolute bottom-0 left-0 right-0 h-px bg-neutral-200"
                />
            </View>

            <Animated.ScrollView
                onScroll={onScroll}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                stickyHeaderIndices={[1]}
                overScrollMode="never"
                onLayout={(e) => {
                    viewH.value = e.nativeEvent.layout.height;
                    setViewHeight(e.nativeEvent.layout.height);
                }}
            >
                {/* 0: Header + suggestions */}
                <View onLayout={(e) => (topH.value = e.nativeEvent.layout.height)}>
                    <View className="px-5 pb-1 pt-3">
                        <View className="flex-row items-start justify-between">
                            <Animated.View style={nameBlock} className="flex-1 pr-4 pt-3">
                                <Text className="text-3xl font-bold tracking-tight text-neutral-950">
                                    {user.name}
                                </Text>
                                <Text className="mt-1 text-base text-neutral-400">{user.username}</Text>
                                {status && (
                                    <Text className="mt-2 text-sm text-neutral-500">
                                        {status.emoji} {status.label}
                                    </Text>
                                )}
                            </Animated.View>

                            <Animated.View style={avatarBlock} className="mr-1">
                                <Image
                                    source={{ uri: user.avatar }}
                                    className="h-24 w-24 rounded-full border border-neutral-200 bg-neutral-100"
                                />
                                <Pressable
                                    onPress={cycleStatus}
                                    hitSlop={8}
                                    accessibilityLabel="Set status"
                                    className="absolute -left-4 bottom-0 h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-white"
                                >
                                    <View
                                        style={{ borderStyle: 'dashed' }}
                                        className="h-8 w-8 items-center justify-center rounded-full border-[1.5px] border-neutral-400 bg-neutral-50"
                                    >
                                        {status ? (
                                            <Text style={{ fontSize: 14 }}>{status.emoji}</Text>
                                        ) : (
                                            <Ionicons name="add" size={16} color={MUTED} />
                                        )}
                                    </View>
                                </Pressable>
                            </Animated.View>
                        </View>

                        <View>
                            <Text className="mt-4 text-sm leading-6 text-neutral-800">{user.bio}</Text>

                            {user.location !== '' && (
                                <View className="mt-2 flex-row items-center">
                                    <Ionicons name="location-outline" size={15} color={MUTED} />
                                    <Text className="ml-1 text-sm text-neutral-500">{user.location}</Text>
                                </View>
                            )}

                            {user.interests.length > 0 && (
                                <View className="mt-3 flex-row flex-wrap">
                                    {user.interests.map((i) => (
                                        <View key={i} className="mb-2 mr-2 rounded-full bg-neutral-100 px-3 py-1">
                                            <Text className="text-xs font-medium text-neutral-700">{i}</Text>
                                        </View>
                                    ))}
                                </View>
                            )}

                            {user.openTo.length > 0 && (
                                <View className="mt-1 flex-row items-center">
                                    <Ionicons name="hand-left-outline" size={15} color={MUTED} />
                                    <Text className="ml-1 text-sm text-neutral-500">
                                        Open to hosting, guiding and helping
                                    </Text>
                                </View>
                            )}

                            <Text className="mt-3 text-base text-neutral-400">
                                {user.connections} connections
                            </Text>
                        </View>

                        <View className="mb-5 mt-5 flex-row">
                            <Pressable
                                onPress={() => nav.push('edit-profile')}
                                className="mr-3 flex-1 items-center rounded-xl border border-neutral-300 py-3 active:bg-neutral-100"
                            >
                                <Text className="text-base font-medium text-neutral-950">Edit profile</Text>
                            </Pressable>
                            <Pressable
                                onPress={() => nav.push('share-profile')}
                                className="flex-1 items-center rounded-xl border border-neutral-300 py-3 active:bg-neutral-100"
                            >
                                <Text className="text-base font-medium text-neutral-950">Share profile</Text>
                            </Pressable>
                        </View>
                    </View>

                    {/* Suggested connections */}
                    <View className="pb-6 pt-1">
                        <Text className="mb-3 px-5 text-base font-semibold text-neutral-950">
                            Suggested for you
                        </Text>

                        {people.length > 0 ? (
                            <RNScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                snapToOffsets={snapOffsets}
                                snapToStart
                                snapToEnd
                                decelerationRate="fast"
                                contentContainerStyle={{ paddingLeft: 20, paddingRight: 8 }}
                            >
                                {people.map((p) => (
                                    <SuggestionCard
                                        key={p.id}
                                        person={p}
                                        requested={requested.includes(p.id)}
                                        onToggle={() => toggleRequest(p.id)}
                                        onDismiss={() => setPeople((c) => c.filter((x) => x.id !== p.id))}
                                    />
                                ))}
                            </RNScrollView>
                        ) : (
                            <Text className="px-5 text-sm text-neutral-500">
                                You're all caught up. New travellers will show up here.
                            </Text>
                        )}
                    </View>
                </View>

                {/* 1: Sticky tabs */}
                <View
                    onLayout={(e) => (tabsH.value = e.nativeEvent.layout.height)}
                    className="border-b border-neutral-200 bg-white"
                >
                    <View className="flex-row">
                        {TABS.map((t, i) => (
                            <Pressable
                                key={t.key}
                                onPress={() => selectTab(i)}
                                style={{ width: tabW }}
                                className="items-center py-4"
                            >
                                <Text
                                    className={`text-base ${i === activeIndex
                                            ? 'font-semibold text-neutral-950'
                                            : 'font-medium text-neutral-400'
                                        }`}
                                >
                                    {t.key}
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                    <Animated.View
                        style={[{ width: tabW, paddingHorizontal: 16 }, indicatorStyle]}
                        className="absolute bottom-0"
                    >
                        <View className="h-0.5 rounded-full bg-neutral-950" />
                    </Animated.View>
                </View>

                {/* 2: Tab content */}
                <View style={{ height: Math.max(viewHeight - 54, 300) }} className="px-8">
                    <Animated.View
                        style={centeredContent}
                        onLayout={(e) => (itemH.value = e.nativeEvent.layout.height)}
                        className="items-center"
                    >
                        <Pressable
                            onPress={() => alert('Coming soon!')}
                            className="rounded-xl border border-neutral-300 px-6 py-3 active:bg-neutral-100"
                        >
                            <Text className="text-base font-medium text-neutral-950">{tab.cta}</Text>
                        </Pressable>
                        <Text className="mt-4 text-center text-sm text-neutral-400">{tab.hint}</Text>
                    </Animated.View>
                </View>
            </Animated.ScrollView>
        </SafeAreaView>
    );
}

export default function ProfileScreen() {
    return (
        <SearchProvider>
            <ProfileNavProvider>
                <ProfileContent />
            </ProfileNavProvider>
        </SearchProvider>
    );
}