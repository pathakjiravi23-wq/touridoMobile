import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { useState } from 'react';
import { Image, Pressable, Share, Text, View } from 'react-native';

import { APP_DOMAIN, useCurrentUser } from '@/data/current-user';

import { useProfileNav } from '../navigation/profile-navigator';
import ScreenShell from '../shared/screen-shell';
import { INK } from '../theme';

function ActionButton({
    icon,
    label,
    onPress,
}: {
    icon: React.ComponentProps<typeof Ionicons>['name'];
    label: string;
    onPress: () => void;
}) {
    return (
        <Pressable onPress={onPress} className="items-center" style={{ width: 84 }}>
            <View className="h-14 w-14 items-center justify-center rounded-full bg-neutral-100 active:bg-neutral-200">
                <Ionicons name={icon} size={24} color={INK} />
            </View>
            <Text className="mt-2 text-center text-sm text-neutral-950">{label}</Text>
        </Pressable>
    );
}

export default function ShareProfileScreen() {
    const { pop } = useProfileNav();
    const user = useCurrentUser();
    const url = `${APP_DOMAIN}/@${user.username}`;
    const [copied, setCopied] = useState(false);

    async function copyLink() {
        await Clipboard.setStringAsync(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    }

    return (
        <ScreenShell title="Share profile" onBack={pop} icon="close">
            <View className="flex-1 items-center px-8 pt-6">
                <Image
                    source={{ uri: user.avatar }}
                    className="h-20 w-20 rounded-full border border-neutral-200 bg-neutral-100"
                />
                <Text className="mt-3 text-xl font-bold text-neutral-950">{user.name}</Text>
                <Text className="mt-0.5 text-base text-neutral-400">@{user.username}</Text>

                <View className="mt-8 items-center rounded-3xl border border-neutral-200 bg-white p-6">
                    <View className="h-48 w-48 items-center justify-center rounded-2xl bg-neutral-50">
                        <Ionicons name="qr-code-outline" size={140} color={INK} />
                    </View>
                </View>

                <Text className="mt-6 text-center text-sm text-neutral-500">
                    Scan the code or share your link so people can find your profile.
                </Text>

                <View className="mt-10 flex-row justify-center gap-6">
                    <ActionButton
                        icon={copied ? 'checkmark' : 'link-outline'}
                        label={copied ? 'Copied' : 'Copy link'}
                        onPress={copyLink}
                    />
                    <ActionButton
                        icon="share-outline"
                        label="Share to..."
                        onPress={() => Share.share({ message: `Find ${user.name} on tourido: ${url}` })}
                    />
                </View>
            </View>
        </ScreenShell>
    );
}