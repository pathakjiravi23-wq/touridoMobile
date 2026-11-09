import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, View } from 'react-native';

import {
    CurrentUser,
    FieldKey,
    updateCurrentUser,
    useCurrentUser,
} from '@/data/current-user';

import { useProfileNav } from '../navigation/profile-navigator';
import ScreenShell from '../shared/screen-shell';
import { FAINT } from '../theme';

const CONFIG: Record<
    FieldKey,
    { title: string; label: string; placeholder: string; hint: string; max: number; required?: boolean; multiline?: boolean }
> = {
    name: {
        title: 'Edit name',
        label: 'Name',
        placeholder: 'Your name',
        hint: 'This is how people see you.',
        max: 40,
        required: true,
    },
    username: {
        title: 'Edit username',
        label: 'Username',
        placeholder: 'username',
        hint: 'Letters, numbers, dots and underscores only.',
        max: 30,
        required: true,
    },
    bio: {
        title: 'Edit bio',
        label: 'Bio',
        placeholder: 'Write a bio...',
        hint: 'Your bio is public.',
        max: 150,
        multiline: true,
    },
    location: {
        title: 'Edit location',
        label: 'Location',
        placeholder: 'Where are you based?',
        hint: 'Shown on your profile.',
        max: 60,
    },
};

export default function EditFieldScreen({ field = 'name' }: { field?: FieldKey }) {
    const cfg = CONFIG[field];
    const current = useCurrentUser();
    const { pop } = useProfileNav();
    const [value, setValue] = useState(current[field]);

    const cleaned =
        field === 'username' ? value.replace(/^@/, '').replace(/\s/g, '') : value.trim();
    const canSave = !cfg.required || cleaned.length > 0;

    function save() {
        if (!canSave) return;
        if (field === 'username' && !/^[a-zA-Z0-9._]+$/.test(cleaned)) {
            alert('Use only letters, numbers, dots and underscores.');
            return;
        }
        updateCurrentUser({ [field]: cleaned } as Partial<CurrentUser>);
        pop();
    }

    return (
        <ScreenShell
            title={cfg.title}
            onBack={pop}
            icon="close"
            rightLabel="Done"
            onRightPress={save}
            rightDisabled={!canSave}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                className="flex-1"
            >
                <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 20 }}>
                    <Text className="mb-2 text-sm text-neutral-500">{cfg.label}</Text>

                    <TextInput
                        autoFocus
                        value={value}
                        onChangeText={setValue}
                        placeholder={cfg.placeholder}
                        placeholderTextColor={FAINT}
                        multiline={cfg.multiline}
                        maxLength={cfg.max}
                        className="rounded-2xl border border-neutral-300 px-4 py-3 text-base text-neutral-950"
                        style={cfg.multiline ? { minHeight: 120, textAlignVertical: 'top' } : undefined}
                    />

                    <View className="mt-2 flex-row justify-between">
                        <Text className="text-xs text-neutral-400">{cfg.hint}</Text>
                        <Text className="text-xs text-neutral-400">
                            {value.length}/{cfg.max}
                        </Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </ScreenShell>
    );
}