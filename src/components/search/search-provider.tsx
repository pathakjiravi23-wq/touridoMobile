import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';
import { BackHandler, Keyboard, StyleSheet, useWindowDimensions } from 'react-native';
import {
    Gesture,
    GestureDetector,
    GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import SearchPanel from './search-panel';

type SearchContextType = {
    open: () => void;
    close: () => void;
    isOpen: boolean;
};

const SearchContext = createContext<SearchContextType | null>(null);

export function useSearch() {
    const ctx = useContext(SearchContext);
    if (!ctx) throw new Error('useSearch must be used inside <SearchProvider>');
    return ctx;
}

const TIMING = { duration: 260, easing: Easing.out(Easing.cubic) };

type Props = {
    children: ReactNode;
    /** Pass true while the sidebar drawer is open, so search never opens under it. */
    isDrawerOpen?: boolean;
};

export default function SearchProvider({ children, isDrawerOpen = false }: Props) {
    const { width } = useWindowDimensions();
    const progress = useSharedValue(0); // 0 = closed, 1 = open
    const [isOpen, setIsOpen] = useState(false);

    // Mirror the drawer state into a shared value so the UI-thread gesture can read it.
    const drawerOpenShared = useSharedValue(false);
    useEffect(() => {
        drawerOpenShared.value = isDrawerOpen;
    }, [isDrawerOpen, drawerOpenShared]);

    const backRef = useRef<(() => boolean) | null>(null);

    const handleClosed = useCallback(() => {
        Keyboard.dismiss();
        setIsOpen(false);
    }, []);

    const open = useCallback(() => {
        setIsOpen(true);
        progress.value = withTiming(1, TIMING);
    }, [progress]);

    const close = useCallback(() => {
        Keyboard.dismiss();
        progress.value = withTiming(0, TIMING, (finished) => {
            if (finished) scheduleOnRN(handleClosed);
        });
    }, [progress, handleClosed]);

    // Android back button
    useEffect(() => {
        if (!isOpen) return;
        const sub = BackHandler.addEventListener('hardwareBackPress', () => {
            if (backRef.current?.()) return true;
            close();
            return true;
        });
        return () => sub.remove();
    }, [isOpen, close]);

    // Swipe left from the right edge -> open search.
    // Ignored entirely while the drawer is open, so drawer gestures never leak through.
    const openGesture = Gesture.Pan()
        .enabled(!isDrawerOpen)
        .hitSlop({ right: 0, width: 40 })
        .activeOffsetX(-12)
        .failOffsetY([-14, 14])
        .onUpdate((e) => {
            if (drawerOpenShared.value) return;
            progress.value = Math.min(1, Math.max(0, -e.translationX / width));
        })
        .onEnd((e) => {
            if (drawerOpenShared.value) {
                progress.value = withTiming(0, TIMING);
                return;
            }
            const shouldOpen = progress.value > 0.3 || e.velocityX < -500;
            if (shouldOpen) {
                scheduleOnRN(setIsOpen, true);
                progress.value = withTiming(1, TIMING);
            } else {
                progress.value = withTiming(0, TIMING);
            }
        });

    const homeStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: -progress.value * width * 0.25 }],
    }));
    const dimStyle = useAnimatedStyle(() => ({
        opacity: progress.value * 0.18,
    }));
    const panelStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: (1 - progress.value) * width }],
    }));

    return (
        <SearchContext.Provider value={{ open, close, isOpen }}>
            <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#fff' }}>
                <GestureDetector gesture={openGesture}>
                    <Animated.View style={[{ flex: 1 }, homeStyle]}>{children}</Animated.View>
                </GestureDetector>

                <Animated.View
                    pointerEvents="none"
                    style={[StyleSheet.absoluteFill, { backgroundColor: '#000' }, dimStyle]}
                />

                <Animated.View
                    pointerEvents={isOpen ? 'auto' : 'none'}
                    style={[
                        StyleSheet.absoluteFill,
                        {
                            backgroundColor: '#fff',
                            shadowColor: '#000',
                            shadowOpacity: 0.15,
                            shadowRadius: 12,
                            elevation: 16,
                        },
                        panelStyle,
                    ]}
                >
                    <SearchPanel onClose={close} isOpen={isOpen} backRef={backRef} />
                </Animated.View>
            </GestureHandlerRootView>
        </SearchContext.Provider>
    );
}