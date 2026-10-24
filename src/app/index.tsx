import SearchProvider, { useSearch } from '@/components/search/search-provider';
import DrawerProvider, { useDrawer } from '@/components/sidebar/drawer-provider';
import TravelSidebar from '@/components/sidebar/travel-sidebar';
import { Button } from '@/components/ui/button';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

const posts = [
  {
    id: '1',
    name: 'Aarav Sharma',
    username: 'aarav.travels',
    avatar: 'https://i.pravatar.cc/150?img=12',
    time: '2h',
    location: 'Manali, Himachal Pradesh',
    text: 'Somewhere between the mountains and the clouds, life feels a little slower. 🏔️ Who wants to explore Himachal next?',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900',
    likes: 248,
    comments: 32,
  },
  {
    id: '2',
    name: 'Priya Das',
    username: 'priya.explores',
    avatar: 'https://i.pravatar.cc/150?img=47',
    time: '4h',
    location: 'Meghalaya, India',
    text: 'Living my best life surrounded by green hills and hidden waterfalls. Meghalaya is unreal! 💚',
    image: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=900',
    likes: 186,
    comments: 19,
  },
  {
    id: '3',
    name: 'Rohan Gupta',
    username: 'rohan.ontheroad',
    avatar: 'https://i.pravatar.cc/150?img=11',
    time: '6h',
    location: 'Darjeeling, West Bengal',
    text: 'Chai, mountain views and absolutely no plans. Sometimes that is all you need. ☕',
    image: null,
    likes: 94,
    comments: 12,
  },
];

function HomeContent() {

  const { open: openSearch } = useSearch();
  const { toggle } = useDrawer();
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('For you');

  function toggleLike(id: string) {
    setLikedPosts((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <SafeAreaView className="flex-1 bg-white" edges={['top']}>
        {/* Header */}
        <View className="flex-row items-center justify-between border-b border-gray-100 px-5 py-3">
          <Pressable
            onPress={toggle}
            accessibilityRole="button"
            accessibilityLabel="Toggle sidebar"
            hitSlop={8}
            className="h-10 w-10 items-center justify-center rounded-full bg-gray-100"
          >
            <Ionicons name="menu-outline" size={27} color="#171717" />
          </Pressable>

          <Text className="text-2xl font-extrabold tracking-tight text-black">
            tourido
          </Text>

          <Pressable
            onPress={openSearch}
            accessibilityRole="button"
            accessibilityLabel="Search"
            className="h-10 w-10 items-center justify-center rounded-full bg-gray-100"
          >
            <Ionicons name="search-outline" size={22} color="#171717" />
          </Pressable>
        </View>

        {/* Feed tabs */}
        <View className="flex-row border-b border-gray-100">
          {['For you', 'Following'].map((tab) => (
            <Pressable
              key={tab}
              onPress={() => setActiveTab(tab)}
              className="flex-1 items-center py-4"
            >
              <Text
                className={`text-sm ${activeTab === tab
                  ? 'font-bold text-black'
                  : 'font-medium text-gray-400'
                  }`}
              >
                {tab}
              </Text>

              {activeTab === tab && (
                <View className="absolute bottom-0 h-0.5 w-16 rounded-full bg-black" />
              )}
            </Pressable>
          ))}
        </View>

        {/* Feed */}
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
        >
          {/* Create post */}
          <View className="flex-row items-center border-b border-gray-100 px-4 py-4">
            <Image
              source={{ uri: 'https://i.pravatar.cc/150?img=68' }}
              className="h-11 w-11 rounded-full bg-gray-100"
            />

            <Pressable className="ml-3 flex-1 justify-center">
              <Text className="text-base text-gray-400">
                Share your next adventure...
              </Text>
            </Pressable>

            <Button
              title="Post"
              onPress={() => alert('Post feature coming soon!')}
            />
          </View>

          {/* Community posts */}
          {posts.map((post) => {
            const isLiked = likedPosts.includes(post.id);

            return (
              <View
                key={post.id}
                className="border-b border-gray-100 px-4 py-5"
              >
                <View className="flex-row">
                  <Image
                    source={{ uri: post.avatar }}
                    className="h-11 w-11 rounded-full bg-gray-100"
                  />

                  <View className="ml-3 flex-1">
                    <View className="flex-row items-center">
                      <Text className="font-bold text-gray-950">
                        {post.username}
                      </Text>
                      <Text className="ml-2 text-xs text-gray-400">
                        {post.time}
                      </Text>
                      <View className="flex-1" />
                      <Pressable hitSlop={10}>
                        <Ionicons
                          name="ellipsis-horizontal"
                          size={21}
                          color="#737373"
                        />
                      </Pressable>
                    </View>

                    <Text className="mt-0.5 text-xs text-gray-500">
                      {post.name}
                    </Text>

                    <Text className="mt-3 text-sm leading-6 text-gray-800">
                      {post.text}
                    </Text>

                    <View className="mt-2 flex-row items-center">
                      <Ionicons
                        name="location-outline"
                        size={15}
                        color="#737373"
                      />
                      <Text className="ml-1 text-xs text-gray-500">
                        {post.location}
                      </Text>
                    </View>

                    {post.image && (
                      <Image
                        source={{ uri: post.image }}
                        className="mt-3 h-56 w-full rounded-2xl bg-gray-100"
                        resizeMode="cover"
                      />
                    )}

                    <View className="mt-4 flex-row items-center">
                      <Pressable
                        onPress={() => toggleLike(post.id)}
                        className="mr-5 flex-row items-center"
                        hitSlop={8}
                      >
                        <Ionicons
                          name={isLiked ? 'heart' : 'heart-outline'}
                          size={23}
                          color={isLiked ? '#E5484D' : '#404040'}
                        />
                        <Text className="ml-1.5 text-xs text-gray-600">
                          {post.likes + (isLiked ? 1 : 0)}
                        </Text>
                      </Pressable>

                      <Pressable
                        className="mr-5 flex-row items-center"
                        hitSlop={8}
                      >
                        <Ionicons
                          name="chatbubble-outline"
                          size={21}
                          color="#404040"
                        />
                        <Text className="ml-1.5 text-xs text-gray-600">
                          {post.comments}
                        </Text>
                      </Pressable>

                      <Pressable className="mr-5" hitSlop={8}>
                        <Ionicons
                          name="repeat-outline"
                          size={23}
                          color="#404040"
                        />
                      </Pressable>

                      <View className="flex-1" />

                      <Pressable hitSlop={8}>
                        <Ionicons
                          name="paper-plane-outline"
                          size={21}
                          color="#404040"
                        />
                      </Pressable>
                    </View>
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

export default function HomeScreen() {
  return (
    <SearchProvider>
      <DrawerProvider drawer={<TravelSidebar />}>
        <HomeContent />
      </DrawerProvider>
    </SearchProvider>
  );
}