import { useState } from 'react';
import { ScrollView, Switch, Text, View } from 'react-native';

import { useProfileNav } from '../navigation/profile-navigator';
import ScreenShell from '../shared/screen-shell';
import { INK } from '../theme';

const ITEMS = [
    { key: 'invites', label: 'Trip and event invites' },
    { key: 'hosting', label: 'Hosting and stay requests' },
    { key: 'help', label: 'Nearby help requests' },
    { key: 'messages', label: 'New messages' },
] as const;

export default function NotificationsScreen() {
    const { pop } = useProfileNav();
    const [on, setOn] = useState<Record<string, boolean>>({
        invites: true,
        hosting: true,
        help: false,
        messages: true,
    });

    return (
        <ScreenShell title="Notifications" onBack={pop}>
            <ScrollView>
                <View className="mt-4 border-y border-neutral-200">
                    {ITEMS.map((item) => (
                        <View
                            key={item.key}
                            className="flex-row items-center border-b border-neutral-100 px-5 py-4"
                        >
                            <Text className="flex-1 text-base text-neutral-950">{item.label}</Text>
                            <Switch
                                value={on[item.key]}
                                onValueChange={(v) => setOn((s) => ({ ...s, [item.key]: v }))}
                                trackColor={{ false: '#D4D4D4', true: INK }}
                                thumbColor="#FFFFFF"
                            />
                        </View>
                    ))}
                </View>
            </ScrollView>
        </ScreenShell>
    );
}