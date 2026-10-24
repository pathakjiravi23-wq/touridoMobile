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

export default function SearchProvider({ children }: { children: ReactNode }) {
    const { width } = useWindowDimensions();
    const progress = useSharedValue(0); // 0 = closed, 1 = open
    const [isOpen, setIsOpen] = useState(false);

    // panel sets this so hardware-back can step "focused page -> home page" first
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

    // Swipe left (from the right side of home) -> open.
    // Everything runs on the UI thread, so it follows the finger without lag.
    const openGesture = Gesture.Pan()
        .hitSlop({ right: 0, width: 80 })
        .activeOffsetX(-6)
        .failOffsetY([-40, 40])
        .onUpdate((e) => {
            progress.value = Math.min(1, Math.max(0, -e.translationX / width));
        })
        .onEnd((e) => {
            const shouldOpen = progress.value > 0.3 || e.velocityX < -500;
            if (shouldOpen) {
                scheduleOnRN(setIsOpen, true);
                progress.value = withTiming(1, TIMING);
            } else {
                progress.value = withTiming(0, TIMING);
            }
        });

    // Swipe right on the panel -> close
    const closeGesture = Gesture.Pan()
        .activeOffsetX(8)
        .failOffsetY([-40, 40])
        .onUpdate((e) => {
            progress.value = Math.min(1, Math.max(0, 1 - e.translationX / width));
        })
        .onEnd((e) => {
            const shouldClose = progress.value < 0.7 || e.velocityX > 500;
            if (shouldClose) {
                progress.value = withTiming(0, TIMING, (finished) => {
                    if (finished) scheduleOnRN(handleClosed);
                });
            } else {
                progress.value = withTiming(1, TIMING);
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

                <GestureDetector gesture={closeGesture}>
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
                </GestureDetector>
            </GestureHandlerRootView>
        </SearchContext.Provider>
    );
}