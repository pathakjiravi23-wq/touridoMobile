import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import DestinationItem from './destination-item';
import { useDrawer } from './drawer-provider';
import SidebarMenuItem from './sidebar-menu-item';
import SuggestedTrip from './suggested-trip';

import { destinations, suggestedTrips } from '@/data/sidebar-data';

// Pure content. Sliding, width and gestures are handled by <DrawerProvider>.
export default function TravelSidebar() {
    const { close } = useDrawer();

    // Close the drawer, then run whatever the item should do (navigate, etc.)
    const go = (action?: () => void) => () => {
        close();
        action?.();
    };

    return (
        <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-white">
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 24 }}
            >
                <Text className="mb-5 mt-3 text-2xl font-bold text-neutral-900">
                    Communities
                </Text>

                {/* Suggested destinations */}
                <View className="mb-3 flex-row items-center justify-between">
                    <Text className="text-base font-semibold text-neutral-800">
                        Suggested
                    </Text>
                    <Pressable onPress={go()}>
                        <Text className="text-sm font-medium text-neutral-700">See all</Text>
                    </Pressable>
                </View>

                {destinations.map((destination) => (
                    <Pressable key={destination.id} onPress={go()}>
                        <DestinationItem {...destination} />
                    </Pressable>
                ))}

                {/* Suggested groups */}
                <View className="mb-3 mt-3 flex-row items-center justify-between">
                    <Text className="text-base font-semibold text-neutral-800">
                        Suggested Groups
                    </Text>
                    <Pressable onPress={go()}>
                        <Text className="text-sm font-medium text-neutral-700">See all</Text>
                    </Pressable>
                </View>

                {suggestedTrips.map((trip) => (
                    <SuggestedTrip key={trip.id} {...trip} onPress={go()} />
                ))}

                {/* Other feeds */}
                <Text className="mb-2 mt-3 text-base font-semibold text-neutral-500">
                    Other feeds
                </Text>

                <SidebarMenuItem title="Saved" icon="bookmark-outline" onPress={go()} />
                <SidebarMenuItem title="Liked" icon="heart-outline" onPress={go()} />
                <SidebarMenuItem title="Communities" icon="people-outline" onPress={go()} />
                <SidebarMenuItem title="Groups" icon="people-circle-outline" onPress={go()} />
            </ScrollView>
        </SafeAreaView>
    );
}