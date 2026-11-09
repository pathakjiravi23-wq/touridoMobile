import { useSyncExternalStore } from 'react';

export const APP_DOMAIN = 'https://tourido.app';

export const INTEREST_OPTIONS = [
    'Trekking',
    'Road trips',
    'Parties',
    'Cultural events',
    'Music festivals',
    'Adventure sports',
    'Local food',
    'Photography',
    'Camping',
    'Volunteering',
] as const;

export const OPEN_TO_OPTIONS = [
    { id: 'host', label: 'Host travellers at my place' },
    { id: 'guide', label: 'Show visitors around my city' },
    { id: 'locate', label: 'Help people find beautiful places' },
    { id: 'ride', label: 'Share rides on road trips' },
    { id: 'company', label: 'Join group trips and events' },
    { id: 'help', label: 'Help someone nearby in need' },
] as const;

export type OpenToId = (typeof OPEN_TO_OPTIONS)[number]['id'];
export type FieldKey = 'name' | 'username' | 'bio' | 'location';

export type CurrentUser = {
    name: string;
    username: string;
    bio: string;
    location: string;
    avatar: string;
    connections: number;
    interests: string[];
    openTo: OpenToId[];
    links: string[];
    isPrivate: boolean;
    showRecentViews: boolean;
};

let user: CurrentUser = {
    name: 'Ravi Pathak',
    username: 'ravi.explores',
    bio: 'Finding new places, meeting new people and collecting unforgettable travel stories. 🌍',
    location: 'Kolkata, India',
    avatar: 'https://i.pravatar.cc/200?img=68',
    connections: 128,
    interests: ['Road trips', 'Trekking'],
    openTo: ['locate', 'guide'],
    links: [],
    isPrivate: false,
    showRecentViews: true,
};

const listeners = new Set<() => void>();

export function getCurrentUser() {
    return user;
}

// Replace the body of this function with an API call when the backend is ready.
export function updateCurrentUser(patch: Partial<CurrentUser>) {
    user = { ...user, ...patch };
    listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
}

export function useCurrentUser() {
    return useSyncExternalStore(subscribe, getCurrentUser);
}