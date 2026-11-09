import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, ScrollView, Text } from 'react-native';

import {
    OPEN_TO_OPTIONS,
    OpenToId,
    updateCurrentUser,
    useCurrentUser,
} from '@/data/current-user';

import { useProfileNav } from '../navigation/profile-navigator';
import ScreenShell from '../shared/screen-shell';
import { INK, MUTED } from '../theme';

export default function EditOpenToScreen() {
    const current = useCurrentUser();
    const { pop } = useProfileNav();
    const [selected, setSelected] = useState<OpenToId[]>(current.openTo);

    const toggle = (id: OpenToId) =>
        setSelected((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));

    function save() {
        updateCurrentUser({ openTo: selected });
        pop();
    }

    return (
        <ScreenShell title="Open to" onBack={pop} rightLabel="Done" onRightPress={save}>
            <ScrollView>
                <Text className="px-5 pb-2 pt-5 text-sm leading-5 text-neutral-500">
                    Let travellers know how you can help. You can turn these on or off anytime.
                </Text>

                {OPEN_TO_OPTIONS.map((option) => {
                    const on = selected.includes(option.id);
                    return (
                        <Pressable
                            key={option.id}
                            onPress={() => toggle(option.id)}
                            className="flex-row items-center border-b border-neutral-100 px-5 py-4 active:bg-neutral-100"
                        >
                            <Text className="flex-1 pr-4 text-base text-neutral-950">{option.label}</Text>
                            <Ionicons
                                name={on ? 'checkmark-circle' : 'ellipse-outline'}
                                size={24}
                                color={on ? INK : MUTED}
                            />
                        </Pressable>
                    );
                })}
            </ScrollView>
        </ScreenShell>
    );
}