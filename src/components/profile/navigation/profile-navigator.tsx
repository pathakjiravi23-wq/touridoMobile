import {
    ComponentType,
    createContext,
    lazy,
    LazyExoticComponent,
    ReactNode,
    Suspense,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { BackHandler, StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import type { FieldKey } from '@/data/current-user';

import { ScreenSkeleton } from '../shared/skeleton';

export type RouteName =
    | 'settings'
    | 'privacy'
    | 'notifications'
    | 'edit-profile'
    | 'edit-field'
    | 'edit-interests'
    | 'edit-links'
    | 'edit-open-to'
    | 'share-profile';

/** 'down-up' = rises from the bottom edge. 'right' = slides in from the right. */
type Motion = 'down-up' | 'right';

type ScreenEntry = {
    Component: LazyExoticComponent<ComponentType<any>>;
    motion: Motion;
    /** Shown in the loading header before the page code arrives. */
    title: string;
};

/** Every page is lazy-loaded the first time it opens. */
const SCREENS: Record<RouteName, ScreenEntry> = {
    settings: {
        Component: lazy(() => import('../settings/settings-screen')),
        motion: 'right',
        title: 'Settings',
    },
    privacy: {
        Component: lazy(() => import('../settings/privacy-screen')),
        motion: 'right',
        title: 'Privacy',
    },
    notifications: {
        Component: lazy(() => import('../settings/notifications-screen')),
        motion: 'right',
        title: 'Notifications',
    },
    'edit-profile': {
        Component: lazy(() => import('../edit/edit-profile-screen')),
        motion: 'down-up',
        title: 'Edit profile',
    },
    'edit-field': {
        Component: lazy(() => import('../edit/edit-field-screen')),
        motion: 'right',
        title: 'Edit',
    },
    'edit-interests': {
        Component: lazy(() => import('../edit/edit-interests-screen')),
        motion: 'right',
        title: 'Interests',
    },
    'edit-links': {
        Component: lazy(() => import('../edit/edit-links-screen')),
        motion: 'right',
        title: 'Links',
    },
    'edit-open-to': {
        Component: lazy(() => import('../edit/edit-open-to-screen')),
        motion: 'right',
        title: 'Open to',
    },
    'share-profile': {
        Component: lazy(() => import('../share/share-profile-screen')),
        motion: 'down-up',
        title: 'Share profile',
    },
};

type Route = {
    id: number;
    name: RouteName;
    field?: FieldKey;
    closing: boolean;
};

type NavValue = {
    push: (name: RouteName, field?: FieldKey) => void;
    pop: () => void;
};

const NavContext = createContext<NavValue | null>(null);

export function useProfileNav() {
    const ctx = useContext(NavContext);
    if (!ctx) throw new Error('useProfileNav must be used inside <ProfileNavProvider>');
    return ctx;
}

const DURATION = 260;
const EASING = Easing.out(Easing.cubic);

/** Animates one page in on mount and out when `closing` becomes true. */
function PageFrame({
    motion,
    closing,
    onExited,
    isTop,
    children,
}: {
    motion: Motion;
    closing: boolean;
    onExited: () => void;
    isTop: boolean;
    children: ReactNode;
}) {
    const { width, height } = useWindowDimensions();
    const progress = useSharedValue(0); // 0 = off screen, 1 = in place

    useEffect(() => {
        progress.value = withTiming(closing ? 0 : 1, { duration: DURATION, easing: EASING }, (finished) => {
            if (finished && closing) scheduleOnRN(onExited);
        });
    }, [closing, progress, onExited]);

    const style = useAnimatedStyle(() => {
        const offset = 1 - progress.value;
        return {
            transform:
                motion === 'down-up'
                    ? [{ translateY: offset * height }]
                    : [{ translateX: offset * width }],
        };
    });

    return (
        <Animated.View
            style={[StyleSheet.absoluteFill, { backgroundColor: '#FFFFFF' }, style]}
            pointerEvents={isTop && !closing ? 'auto' : 'none'}
        >
            {children}
        </Animated.View>
    );
}

export function ProfileNavProvider({ children }: { children: ReactNode }) {
    const [stack, setStack] = useState<Route[]>([]);
    const nextId = useRef(1);

    const push = useCallback((name: RouteName, field?: FieldKey) => {
        const id = nextId.current++;
        setStack((s) => [...s, { id, name, field, closing: false }]);
    }, []);

    // Marks the top open page as closing. It is removed after its exit animation.
    const pop = useCallback(() => {
        setStack((s) => {
            for (let i = s.length - 1; i >= 0; i--) {
                if (!s[i].closing) {
                    const copy = [...s];
                    copy[i] = { ...s[i], closing: true };
                    return copy;
                }
            }
            return s;
        });
    }, []);

    const removeRoute = useCallback((id: number) => {
        setStack((s) => s.filter((r) => r.id !== id));
    }, []);

    const openCount = stack.filter((r) => !r.closing).length;

    // Android hardware back closes the top page first.
    useEffect(() => {
        if (openCount === 0) return;
        const sub = BackHandler.addEventListener('hardwareBackPress', () => {
            pop();
            return true;
        });
        return () => sub.remove();
    }, [openCount, pop]);

    const value = useMemo(() => ({ push, pop }), [push, pop]);

    return (
        <NavContext.Provider value={value}>
            <View style={{ flex: 1 }}>
                {children}

                {stack.map((route, i) => {
                    const { Component, motion, title } = SCREENS[route.name];
                    const isTop = i === stack.length - 1;

                    return (
                        <PageFrame
                            key={route.id}
                            motion={motion}
                            closing={route.closing}
                            isTop={isTop}
                            onExited={() => removeRoute(route.id)}
                        >
                            <Suspense fallback={<ScreenSkeleton title={title} />}>
                                <Component field={route.field} />
                            </Suspense>
                        </PageFrame>
                    );
                })}
            </View>
        </NavContext.Provider>
    );
}