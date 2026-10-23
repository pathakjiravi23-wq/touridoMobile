
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    Image,
    Pressable,
    ScrollView,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
    const [activeTab, setActiveTab] = useState('Posts');

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top']}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="flex-row items-center justify-between px-5 py-4">
                    <Text className="text-2xl font-extrabold text-black">
                        Profile
                    </Text>
                    <Pressable
                        onPress={() => alert('Settings coming soon!')}
                        className="h-10 w-10 items-center justify-center rounded-full bg-gray-100"
                    >
                        <Ionicons name="settings-outline" size={21} color="#171717" />
                    </Pressable>
                </View>

                {/* User details */}
                <View className="px-5 pb-5">
                    <View className="flex-row items-start justify-between">
                        <View className="flex-1 pr-3">
                            <Text className="text-2xl font-bold text-gray-950">
                                Ravi Pathak
                            </Text>
                            <Text className="mt-1 text-sm text-gray-500">
                                @ravi.explores
                            </Text>
                            <Text className="mt-4 text-sm leading-6 text-gray-800">
                                Finding new places, meeting new people and collecting
                                unforgettable travel stories. 🌍
                            </Text>
                        </View>

                        <Image
                            source={{ uri: 'https://i.pravatar.cc/150?img=68' }}
                            className="h-20 w-20 rounded-full bg-gray-100"
                        />
                    </View>

                    <View className="mt-4 flex-row items-center">
                        <Ionicons name="location-outline" size={16} color="#737373" />
                        <Text className="ml-1 text-sm text-gray-500">
                            Kolkata, India
                        </Text>
                    </View>

                    <View className="mt-4 flex-row items-center">
                        <Text className="text-sm font-bold text-gray-900">128</Text>
                        <Text className="ml-1 text-sm text-gray-500">followers</Text>
                        <Text className="ml-4 text-sm font-bold text-gray-900">86</Text>
                        <Text className="ml-1 text-sm text-gray-500">following</Text>
                    </View>

                    <Pressable
                        onPress={() => alert('Edit profile coming soon!')}
                        className="mt-5 items-center rounded-full border border-gray-300 py-3"
                    >
                        <Text className="font-semibold text-gray-900">Edit profile</Text>
                    </Pressable>
                </View>

                {/* Profile tabs */}
                <View className="flex-row border-b border-gray-100">
                    {['Posts', 'Replies', 'Media', 'Likes'].map((tab) => (
                        <Pressable
                            key={tab}
                            onPress={() => setActiveTab(tab)}
                            className="flex-1 items-center py-4"
                        >
                            <Text
                                className={`text-sm ${activeTab === tab
                                        ? 'font-bold text-black'
                                        : 'text-gray-400'
                                    }`}
                            >
                                {tab}
                            </Text>

                            {activeTab === tab && (
                                <View className="absolute bottom-0 h-0.5 w-10 rounded-full bg-black" />
                            )}
                        </Pressable>
                    ))}
                </View>

                {/* Empty state */}
                <View className="items-center px-8 py-16">
                    <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                        <Ionicons name="earth-outline" size={32} color="#525252" />
                    </View>

                    <Text className="text-lg font-bold text-gray-900">
                        {activeTab === 'Posts'
                            ? 'Your journey starts here'
                            : `Your ${activeTab.toLowerCase()} will appear here`}
                    </Text>

                    <Text className="mt-2 text-center text-sm leading-5 text-gray-500">
                        Share your adventures and let other travellers discover your story.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
