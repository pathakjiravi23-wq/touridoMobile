import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { updateCurrentUser, useCurrentUser } from '@/data/current-user';

import { useProfileNav } from '../navigation/profile-navigator';
import ScreenShell from '../shared/screen-shell';
import { FAINT, INK } from '../theme';

export default function EditLinksScreen() {
    const current = useCurrentUser();
    const { pop } = useProfileNav();
    const [links, setLinks] = useState<string[]>(current.links);
    const [draft, setDraft] = useState('');

    function addLink() {
        const v = draft.trim();
        if (!v) return;
        const url = /^https?:\/\//.test(v) ? v : `https://${v}`;
        setLinks((c) => [...c, url]);
        setDraft('');
    }

    function save() {
        updateCurrentUser({ links });
        pop();
    }

    return (
        <ScreenShell title="Links" onBack={pop} icon="close" rightLabel="Done" onRightPress={save}>
            <ScrollView contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled">
                <View className="flex-row items-center rounded-2xl border border-neutral-300 px-4">
                    <TextInput
                        value={draft}
                        onChangeText={setDraft}
                        onSubmitEditing={addLink}
                        placeholder="Add link (e.g. yourblog.com)"
                        placeholderTextColor={FAINT}
                        autoCapitalize="none"
                        keyboardType="url"
                        returnKeyType="done"
                        className="flex-1 py-3.5 text-base text-neutral-950"
                    />
                    <Pressable onPress={addLink} hitSlop={8}>
                        <Ionicons name="add-circle" size={26} color={INK} />
                    </Pressable>
                </View>

                <View className="mt-5">
                    {links.length === 0 && (
                        <Text className="text-sm text-neutral-400">No links yet.</Text>
                    )}
                    {links.map((link, i) => (
                        <View
                            key={`${link}-${i}`}
                            className="mb-2 flex-row items-center rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3"
                        >
                            <Text numberOfLines={1} className="flex-1 text-base text-neutral-950">
                                {link}
                            </Text>
                            <Pressable
                                onPress={() => setLinks((c) => c.filter((_, idx) => idx !== i))}
                                hitSlop={8}
                                accessibilityLabel="Remove link"
                            >
                                <Ionicons name="close" size={18} color={FAINT} />
                            </Pressable>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </ScreenShell>
    );
}