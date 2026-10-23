import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CommunitiesScreen() {
    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top']}>
            <View className="border-b border-gray-100 px-5 py-4">
                <Text className="text-2xl font-extrabold text-black">Communities</Text>
            </View>
            <View className="flex-1 items-center justify-center">
                <Text className="text-gray-400">Communities coming soon</Text>
            </View>
        </SafeAreaView>
    );
}