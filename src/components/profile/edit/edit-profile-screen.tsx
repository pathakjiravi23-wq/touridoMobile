import { Image, Pressable, ScrollView, Text, View } from 'react-native';

import { useCurrentUser } from '@/data/current-user';

import { useProfileNav } from '../navigation/profile-navigator';
import ListRow from '../shared/list-row';
import ScreenShell from '../shared/screen-shell';

export default function EditProfileScreen() {
    const u = useCurrentUser();
    const { pop, push } = useProfileNav();

    return (
        <ScreenShell title="Edit profile" onBack={pop} icon="close">
            <ScrollView showsVerticalScrollIndicator={false}>
                <View className="items-center py-7">
                    <Image
                        source={{ uri: u.avatar }}
                        className="h-24 w-24 rounded-full border border-neutral-200 bg-neutral-100"
                    />
                    <Pressable onPress={() => alert('Photo picker coming soon!')} hitSlop={8} className="mt-3">
                        <Text className="text-base font-semibold text-neutral-950">Edit picture</Text>
                    </Pressable>
                </View>

                <View className="border-t border-neutral-200">
                    <ListRow label="Name" value={u.name} onPress={() => push('edit-field', 'name')} />
                    <ListRow label="Username" value={`@${u.username}`} onPress={() => push('edit-field', 'username')} />
                    <ListRow label="Bio" value={u.bio || 'Write bio'} onPress={() => push('edit-field', 'bio')} />
                    <ListRow
                        label="Interests"
                        value={u.interests.length ? `${u.interests.length} selected` : 'Add interests'}
                        onPress={() => push('edit-interests')}
                    />
                    <ListRow
                        label="Open to"
                        value={u.openTo.length ? `${u.openTo.length} selected` : 'Choose'}
                        onPress={() => push('edit-open-to')}
                    />
                    <ListRow
                        label="Links"
                        value={u.links.length ? `${u.links.length}` : 'Add link'}
                        onPress={() => push('edit-links')}
                    />
                    <ListRow
                        label="Location"
                        value={u.location || 'Add location'}
                        onPress={() => push('edit-field', 'location')}
                    />
                </View>
            </ScrollView>
        </ScreenShell>
    );
}