import { Alert, ScrollView, Text, View } from 'react-native';

import { useProfileNav } from '../navigation/profile-navigator';
import ListRow from '../shared/list-row';
import ScreenShell from '../shared/screen-shell';

const soon = (name: string) => () => alert(`${name} coming soon!`);

export default function SettingsScreen() {
    const { pop, push } = useProfileNav();

    function confirmLogout() {
        Alert.alert('Log out?', 'You can log back in anytime.', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Log out',
                style: 'destructive',
                onPress: () => {
                    // TODO: clear your auth session here
                },
            },
        ]);
    }

    return (
        <ScreenShell title="Settings" onBack={pop}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
                <Section title="Your account">
                    <ListRow icon="person-outline" label="Edit profile" onPress={() => push('edit-profile')} />
                    <ListRow icon="lock-closed-outline" label="Privacy" onPress={() => push('privacy')} />
                    <ListRow icon="shield-checkmark-outline" label="Security" onPress={soon('Security')} />
                </Section>

                <Section title="Preferences">
                    <ListRow
                        icon="notifications-outline"
                        label="Notifications"
                        onPress={() => push('notifications')}
                    />
                    <ListRow icon="language-outline" label="Language" onPress={soon('Language')} />
                    <ListRow icon="contrast-outline" label="Appearance" onPress={soon('Appearance')} />
                </Section>

                <Section title="Support">
                    <ListRow icon="help-circle-outline" label="Help center" onPress={soon('Help center')} />
                    <ListRow icon="flag-outline" label="Report a problem" onPress={soon('Report a problem')} />
                    <ListRow icon="information-circle-outline" label="About" onPress={soon('About')} />
                </Section>

                <View className="mt-8 border-y border-neutral-200">
                    <ListRow icon="log-out-outline" label="Log out" danger onPress={confirmLogout} />
                </View>
            </ScrollView>
        </ScreenShell>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <View className="mt-6">
            <Text className="mb-1 px-5 text-sm font-medium text-neutral-500">{title}</Text>
            <View className="border-y border-neutral-200">{children}</View>
        </View>
    );
}