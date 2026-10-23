
import { Ionicons } from '@expo/vector-icons';
import { ScrollView, Text, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const suggestions = [
    { icon: 'trail-sign-outline' as const, title: 'Mountains', subtitle: 'Peace & adventure' },
    { icon: 'water-outline' as const, title: 'Beaches', subtitle: 'Sun, sand & sea' },
    { icon: 'leaf-outline' as const, title: 'Nature', subtitle: 'Explore the wild' },
    { icon: 'business-outline' as const, title: 'City breaks', subtitle: 'Culture & food' },
];

export default function MakeTripScreen() {
    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top']}>
            <ScrollView className="flex-1" contentContainerStyle={{ padding: 20, paddingBottom: 36 }}>
                <View className="mb-7 flex-row items-center justify-between">
                    <View>
                        <Text className="text-sm text-gray-500">YOUR NEXT ADVENTURE</Text>
                        <Text className="mt-1 text-3xl font-extrabold text-gray-950">
                            Make My Trip
                        </Text>
                    </View>
                    <Pressable className="h-11 w-11 items-center justify-center rounded-full bg-gray-100">
                        <Ionicons name="time-outline" size={23} color="#171717" />
                    </Pressable>
                </View>

                <View className="mb-7 overflow-hidden rounded-3xl bg-[#EAF5EC] p-5">
                    <View className="mb-3 h-28 items-center justify-center rounded-2xl bg-[#D7EBD9]">
                        <Ionicons name="earth-outline" size={66} color="#347B50" />
                    </View>
                    <Text className="text-2xl font-bold text-gray-950">
                        Where to next?
                    </Text>
                    <Text className="mt-2 text-sm leading-5 text-gray-600">
                        Tell us your travel mood. We’ll help you plan an unforgettable journey.
                    </Text>
                    <Pressable
                        onPress={() => alert('Trip planner coming soon!')}
                        className="mt-5 flex-row items-center justify-center rounded-full bg-black py-3.5"
                    >
                        <Ionicons name="sparkles-outline" size={19} color="white" />
                        <Text className="ml-2 font-bold text-white">Plan a trip</Text>
                    </Pressable>
                </View>

                <Text className="mb-1 text-xl font-bold text-gray-950">
                    What’s your vibe?
                </Text>
                <Text className="mb-4 text-sm text-gray-500">
                    Pick the kind of escape you need.
                </Text>

                <View className="flex-row flex-wrap justify-between">
                    {suggestions.map((item) => (
                        <Pressable
                            key={item.title}
                            onPress={() => alert(`${item.title} trips coming soon!`)}
                            className="mb-3 w-[48%] rounded-2xl border border-gray-100 bg-white p-4"
                        >
                            <View className="mb-5 h-11 w-11 items-center justify-center rounded-full bg-[#EAF5EC]">
                                <Ionicons name={item.icon} size={23} color="#347B50" />
                            </View>
                            <Text className="text-base font-bold text-gray-900">
                                {item.title}
                            </Text>
                            <Text className="mt-1 text-xs text-gray-500">
                                {item.subtitle}
                            </Text>
                        </Pressable>
                    ))}
                </View>

                <View className="mt-4 rounded-2xl bg-gray-50 p-5">
                    <View className="flex-row items-center">
                        <Ionicons name="people-outline" size={25} color="#347B50" />
                        <Text className="ml-3 text-lg font-bold text-gray-900">
                            Travel together
                        </Text>
                    </View>
                    <Text className="mt-2 text-sm leading-5 text-gray-600">
                        Find travel buddies and turn your next trip into a shared adventure.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
