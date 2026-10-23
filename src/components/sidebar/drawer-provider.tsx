import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useMemo,
    useState,
} from 'react';
import { Dimensions, Pressable, StyleSheet } from 'react-native';
import {
    Gesture,
    GestureDetector,
    GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
    Extrapolation,
    interpolate,
    useAnimatedReaction,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

const SCREEN_WIDTH = Dimensions.get('window').width;

/** How wide the drawer is (85% of the screen). Change 0.85 to taste. */
export const DRAWER_WIDTH = SCREEN_WIDTH * 0.85;

/**
 * Swipe-to-open only starts when the finger begins within this many px of the
 * left edge. Set to SCREEN_WIDTH to allow swiping from anywhere.
 */
const OPEN_EDGE_WIDTH = 50;

const SPRING = {
    damping: 28,
    stiffness: 240,
    mass: 0.9,
    overshootClamping: true,
};

type DrawerContextValue = {
    open: () => void;
    close: () => void;
    toggle: () => void;
    isOpen: boolean;
};

const DrawerContext = createContext<DrawerContextValue | null>(null);

export function useDrawer() {
    const ctx = useContext(DrawerContext);
    if (!ctx) throw new Error('useDrawer must be used inside <DrawerProvider>');
    return ctx;
}

type Props = {
    /** The drawer content (rendered underneath, on the left). */
    drawer: ReactNode;
    /** The app (a screen, or your whole <Tabs> / <Stack>). */
    children: ReactNode;
};

export default function DrawerProvider({ drawer, children }: Props) {
    // 0 = closed, 1 = fully open
    const progress = useSharedValue(0);
    const startProgress = useSharedValue(0);
    const startX = useSharedValue(0);
    const [isOpen, setIsOpen] = useState(false);

    // Keep a JS-side flag so the dim overlay only catches touches while open.
    useAnimatedReaction(
        () => progress.value > 0.001,
        (open, prev) => {
            if (open !== prev) scheduleOnRN(setIsOpen, open);
        }
    );

    const open = useCallback(() => {
        progress.value = withSpring(1, SPRING);
    }, [progress]);

    const close = useCallback(() => {
        progress.value = withSpring(0, SPRING);
    }, [progress]);

    const toggle = useCallback(() => {
        if (progress.value > 0.5) close();
        else open();
    }, [progress, open, close]);

    const pan = Gesture.Pan()
        // Only claim the gesture for clearly horizontal drags,
        // so vertical feed scrolling keeps working.
        .activeOffsetX([-12, 12])
        .failOffsetY([-14, 14])
        .onBegin((e) => {
            startProgress.value = progress.value;
            startX.value = e.absoluteX;
        })
        .onUpdate((e) => {
            // When closed, only react if the swipe started at the left edge.
            if (startProgress.value < 0.01 && startX.value > OPEN_EDGE_WIDTH) return;

            const next = startProgress.value + e.translationX / DRAWER_WIDTH;
            progress.value = Math.min(1, Math.max(0, next));
        })
        .onEnd((e) => {
            if (startProgress.value < 0.01 && startX.value > OPEN_EDGE_WIDTH) return;

            // Decide using position + flick velocity.
            const projected = progress.value + (e.velocityX / DRAWER_WIDTH) * 0.2;
            const target = projected > 0.5 ? 1 : 0;

            progress.value = withSpring(target, {
                ...SPRING,
                velocity: e.velocityX / DRAWER_WIDTH,
            });
        });

    // The whole app slides to the right and leaves a strip visible.
    const contentStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: progress.value * DRAWER_WIDTH }],
    }));

    // The drawer slides in from the left with a small parallax.
    const drawerStyle = useAnimatedStyle(() => ({
        transform: [
            {
                translateX: interpolate(
                    progress.value,
                    [0, 1],
                    [-DRAWER_WIDTH * 0.25, 0],
                    Extrapolation.CLAMP
                ),
            },
        ],
    }));

    const dimStyle = useAnimatedStyle(() => ({
        opacity: interpolate(progress.value, [0, 1], [0, 0.12], Extrapolation.CLAMP),
    }));

    const value = useMemo(
        () => ({ open, close, toggle, isOpen }),
        [open, close, toggle, isOpen]
    );

    return (
        <DrawerContext.Provider value={value}>
            <GestureHandlerRootView style={styles.root}>
                <GestureDetector gesture={pan}>
                    <Animated.View style={styles.root}>
                        {/* Drawer sits underneath */}
                        <Animated.View style={[styles.drawer, drawerStyle]}>
                            {drawer}
                        </Animated.View>

                        {/* App content, pushed right */}
                        <Animated.View style={[styles.content, contentStyle]}>
                            {children}

                            {/* Dim + tap-to-close, only active while open */}
                            <Animated.View
                                style={[StyleSheet.absoluteFill, styles.dim, dimStyle]}
                                pointerEvents={isOpen ? 'auto' : 'none'}
                            >
                                <Pressable
                                    style={StyleSheet.absoluteFill}
                                    onPress={close}
                                    accessibilityRole="button"
                                    accessibilityLabel="Close sidebar"
                                />
                            </Animated.View>
                        </Animated.View>
                    </Animated.View>
                </GestureDetector>
            </GestureHandlerRootView>
        </DrawerContext.Provider>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: '#FFFFFF' },
    drawer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        width: DRAWER_WIDTH,
        backgroundColor: '#FFFFFF',
    },
    content: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: -4, height: 0 },
        shadowOpacity: 0.12,
        shadowRadius: 10,
        elevation: 16,
    },
    dim: { backgroundColor: '#000' },
});