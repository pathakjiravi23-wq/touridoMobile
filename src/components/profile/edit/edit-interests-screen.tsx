import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { INTEREST_OPTIONS, updateCurrentUser, useCurrentUser } from '@/data/current-user';

import { useProfileNav } from '../navigation/profile-navigator';
import Chip from '../shared/chip';
import ScreenShell from '../shared/screen-shell';

export default function EditInterestsScreen() {
    const current = useCurrentUser();
    const { pop } = useProfileNav();
    const [selected, setSelected] = useState<string[]>(current.interests);

    const toggle = (item: string) =>
        setSelected((c) => (c.includes(item) ? c.filter((x) => x !== item) : [...c, item]));

    function save() {
        updateCurrentUser({ interests: selected });
        pop();
    }

    return (
        <ScreenShell title="Interests" onBack={pop} rightLabel="Done" onRightPress={save}>
            <ScrollView contentContainerStyle={{ padding: 20 }}>
                <Text className="text-sm leading-5 text-neutral-500">
                    Pick what you love doing. People with shared interests find you for trips, events and
                    road trips.
                </Text>

                <View className="mt-5 flex-row flex-wrap">
                    {INTEREST_OPTIONS.map((item) => (
                        <Chip
                            key={item}
                            label={item}
                            selected={selected.includes(item)}
                            onPress={() => toggle(item)}
                        />
                    ))}
                </View>

                <Text className="mt-4 text-xs text-neutral-400">{selected.length} selected</Text>
            </ScrollView>
        </ScreenShell>
    );
}