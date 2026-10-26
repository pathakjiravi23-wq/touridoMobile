
import { useLocalSearchParams, useRouter } from 'expo-router';

import CallScreen from '@/components/messages/call-screen';
import { USERS } from '@/data/messages';

export default function CallRoute() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();

    const user = USERS.find((item) => item.id === id);

    if (!user) {
        return null;
    }

    return (
        <CallScreen
            user={user}
            onEndCall={() => router.back()}
        />
    );
}
