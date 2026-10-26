import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { View } from 'react-native';

const COLORS = {
  background: '#FFFFFF',
  active: '#111111',
  inactive: '#A3A3A3',
  pill: '#F3F4F6',
};

// Single source of truth for the tab bar style.
// messages-screen.tsx imports this to restore the bar after a chat closes.
export const TAB_BAR_STYLE = {
  backgroundColor: COLORS.background,
  borderTopWidth: 0,
  elevation: 0,
  shadowOpacity: 0,
  height: 62,
  paddingTop: 8,
  paddingBottom: 8,
  display: 'flex' as const,
};

export default function AppTabs() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: COLORS.active,
        tabBarInactiveTintColor: COLORS.inactive,
        tabBarStyle: TAB_BAR_STYLE,
        tabBarItemStyle: {
          justifyContent: 'center',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarAccessibilityLabel: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              color={color}
              size={26}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="messages"
        options={{
          tabBarAccessibilityLabel: 'Messages',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'chatbubbles' : 'chatbubbles-outline'}
              color={color}
              size={26}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="make-trip"
        options={{
          tabBarAccessibilityLabel: 'AI trip planner',
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                width: 58,
                height: 40,
                borderRadius: 14,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: focused ? COLORS.active : COLORS.pill,
              }}
            >
              <Ionicons
                name={focused ? 'sparkles' : 'sparkles-outline'}
                size={22}
                color={focused ? '#FFFFFF' : color}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarAccessibilityLabel: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              color={color}
              size={26}
            />
          ),
        }}
      />


      <Tabs.Screen name="call" options={{ href: null }} />
    </Tabs>
  );
}