import { ScrollView, Switch, Text, View } from 'react-native';

import { updateCurrentUser, useCurrentUser } from '@/data/current-user';

import { useProfileNav } from '../navigation/profile-navigator';
import ScreenShell from '../shared/screen-shell';
import { INK } from '../theme';

function ToggleRow({
    label,
    hint,
    value,
    onChange,
}: {
    label: string;
    hint?: string;
    value: boolean;
    onChange: (v: boolean) => void;
}) {
    return (
        <View className="flex-row items-center border-b border-neutral-100 px-5 py-4">
            <View className="flex-1 pr-4">
                <Text className="text-base text-neutral-950">{label}</Text>
                {hint ? <Text className="mt-1 text-sm text-neutral-400">{hint}</Text> : null}
            </View>
            <Switch
                value={value}
                onValueChange={onChange}
                trackColor={{ false: '#D4D4D4', true: INK }}
                thumbColor="#FFFFFF"
            />
        </View>
    );
}

export default function PrivacyScreen() {
    const { pop } = useProfileNav();
    const user = useCurrentUser();

    return (
        <ScreenShell title="Privacy" onBack={pop}>
            <ScrollView>
                <View className="mt-4 border-y border-neutral-200">
                    <ToggleRow
                        label="Private profile"
                        hint={
                            user.isPrivate
                                ? 'Only approved people can see your posts and trips.'
                                : 'Anyone can see your posts and trips.'
                        }
                        value={user.isPrivate}
                        onChange={(v) => updateCurrentUser({ isPrivate: v })}
                    />
                    <ToggleRow
                        label="Show recent views"
                        hint="Visible on your profile once you reach 1K views."
                        value={user.showRecentViews}
                        onChange={(v) => updateCurrentUser({ showRecentViews: v })}
                    />
                </View>
            </ScrollView>
        </ScreenShell>
    );
}