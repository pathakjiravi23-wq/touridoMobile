import { Pressable, Text, View } from 'react-native';

export type InboxFilter = 'Inbox' | 'Requests';

type Props = {
    active: InboxFilter;
    onChange: (filter: InboxFilter) => void;
    requestCount?: number;
};

const FILTERS: InboxFilter[] = ['Inbox', 'Requests'];

export default function FilterChips({ active, onChange, requestCount = 0 }: Props) {
    return (
        <View className="flex-row px-5 py-3">
            {FILTERS.map((filter) => {
                const isActive = active === filter;
                return (
                    <Pressable
                        key={filter}
                        onPress={() => onChange(filter)}
                        className={`mr-2 flex-row items-center rounded-full border px-5 py-2.5 ${isActive ? 'border-black bg-black' : 'border-gray-200 bg-white'
                            }`}
                    >
                        <Text
                            className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-gray-800'
                                }`}
                        >
                            {filter}
                        </Text>
                        {filter === 'Requests' && requestCount > 0 && (
                            <View className="ml-2 h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1">
                                <Text className="text-[11px] font-bold text-white">
                                    {requestCount}
                                </Text>
                            </View>
                        )}
                    </Pressable>
                );
            })}
        </View>
    );
}