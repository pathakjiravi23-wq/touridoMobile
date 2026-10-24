import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, Text, View } from 'react-native';

export type TripType = 'Tour' | 'Event' | 'Adventure';

export type Trip = {
    id: string;
    title: string;
    type: TripType;
    city: string;
    dates: string;
    total: number; // max members
    avatars: string[]; // current members
};

const TYPE_STYLE: Record<TripType, { bg: string; text: string }> = {
    Tour: { bg: 'bg-blue-50', text: 'text-blue-700' },
    Event: { bg: 'bg-purple-50', text: 'text-purple-700' },
    Adventure: { bg: 'bg-orange-50', text: 'text-orange-700' },
};

const BOX = 68; // visual area size
const FACE = 24; // single face size
const LINE_MAX = 3; // up to this many members -> horizontal row
const SPIRAL_SLOTS = 6; // faces shown in spiral (last becomes +N if more)

const faceClass = 'absolute rounded-full border-2 border-white bg-gray-100';

/** <=3 members: overlapping horizontal row. More: small spiral cluster. */
function Members({ avatars }: { avatars: string[] }) {
    // ---- horizontal row ----
    if (avatars.length <= LINE_MAX) {
        const gap = FACE - 8; // overlap 8px
        const width = FACE + (avatars.length - 1) * gap;
        return (
            <View style={{ width: BOX, height: BOX }} className="items-center justify-center">
                <View style={{ width, height: FACE }}>
                    {avatars.map((uri, i) => (
                        <Image
                            key={`${uri}-${i}`}
                            source={{ uri }}
                            className={faceClass}
                            style={{ width: FACE, height: FACE, left: i * gap, zIndex: i }}
                        />
                    ))}
                </View>
            </View>
        );
    }

    // ---- spiral (centre -> outwards) ----
    const overflow = avatars.length > SPIRAL_SLOTS;
    const faces = overflow ? avatars.slice(0, SPIRAL_SLOTS - 1) : avatars;
    const extra = avatars.length - faces.length;
    const n = faces.length + (overflow ? 1 : 0);

    const rMin = 6;
    const rMax = BOX / 2 - FACE / 2;
    const sweep = (300 * Math.PI) / 180;

    const pos = (i: number) => {
        const t = i / (n - 1);
        const r = rMin + (rMax - rMin) * t;
        const a = -Math.PI / 2 + sweep * t;
        return {
            left: BOX / 2 + r * Math.cos(a) - FACE / 2,
            top: BOX / 2 + r * Math.sin(a) - FACE / 2,
            zIndex: i,
        };
    };

    return (
        <View style={{ width: BOX, height: BOX }}>
            {faces.map((uri, i) => (
                <Image
                    key={`${uri}-${i}`}
                    source={{ uri }}
                    className={faceClass}
                    style={{ width: FACE, height: FACE, ...pos(i) }}
                />
            ))}
            {overflow && (
                <View
                    className="absolute items-center justify-center rounded-full border-2 border-white bg-gray-900"
                    style={{ width: FACE, height: FACE, ...pos(n - 1) }}
                >
                    <Text className="text-[9px] font-bold text-white">+{extra}</Text>
                </View>
            )}
        </View>
    );
}

export default function TripCard({
    trip,
    onView,
}: {
    trip: Trip;
    onView?: () => void;
}) {
    const style = TYPE_STYLE[trip.type];

    return (
        <Pressable
            onPress={onView}
            className="mb-2 flex-row items-center rounded-xl border border-neutral-200 bg-white px-3 py-2 active:bg-neutral-50"
        >
            <Members avatars={trip.avatars} />

            <View className="ml-2.5 flex-1">
                {/* Title + type */}
                <View className="flex-row items-center">
                    <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        className="mr-2 flex-1 text-[15px] font-bold text-neutral-900"
                    >
                        {trip.title}
                    </Text>
                    <View className={`rounded-full px-2 py-0.5 ${style.bg}`}>
                        <Text className={`text-[10px] font-bold ${style.text}`}>{trip.type}</Text>
                    </View>
                </View>

                {/* City · members */}
                <View className="mt-0.5 flex-row items-center">
                    <Ionicons name="location-outline" size={12} color="#737373" />
                    <Text numberOfLines={1} className="ml-0.5 flex-shrink text-xs text-neutral-600">
                        {trip.city}
                    </Text>
                    <Text className="mx-1.5 text-xs text-neutral-300">•</Text>
                    <Ionicons name="people-outline" size={13} color="#15803d" />
                    <Text className="ml-0.5 text-xs font-bold text-green-700">
                        {trip.avatars.length}/{trip.total}
                    </Text>
                </View>

                {/* Dates + View */}
                <View className="mt-1 flex-row items-center">
                    <Ionicons name="calendar-outline" size={12} color="#737373" />
                    <Text numberOfLines={1} className="ml-0.5 flex-1 text-xs text-neutral-600">
                        {trip.dates}
                    </Text>
                    <Pressable onPress={onView} className="rounded-md bg-black px-3.5 py-1">
                        <Text className="text-[11px] font-bold text-white">View</Text>
                    </Pressable>
                </View>
            </View>
        </Pressable>
    );
}