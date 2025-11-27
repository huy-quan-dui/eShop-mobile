import { HapticTab } from '@/components/haptic-tab';
import { BlurTabBarBackground } from '@/components/ui/BlutabBarBackground';
import { Colors } from '@/constants/theme';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { useColorScheme, Platform } from 'react-native';

export default function _Layout() {
  const ColorScheme = useColorScheme()
  return (
    <Tabs

      screenOptions={{
        tabBarActiveTintColor: Colors[ColorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: BlurTabBarBackground,

        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
          },
          android: { 
            position: "absolute",
          },
          default: {}
        })
        // tabBarStyle: {
        //   backgroundColor: Colors[ColorScheme ?? "light"].background, // Đặt màu nền
        // borderTopWidth: 1,
        // borderTopColor: Colors[ColorScheme ?? "light"].tabIconDefault,
        // }
      }}
    >
      <Tabs.Screen name='index' options={{
        title: 'Home', tabBarIcon: ({ color, size }) => (
          <Feather name='home' size={size} color={color} />
        ),
      }}
      />

      <Tabs.Screen name='wishlist' options={{
        title: 'Wishlist', tabBarIcon: ({ color, size }) => (
          <Feather name='heart' size={size} color={color} />
        ),
      }}
      />

      <Tabs.Screen name='messages' options={{
        title: 'Messages', tabBarIcon: ({ color, size }) => (
          <Ionicons name='chatbubble-ellipses-outline' size={size} color={color} />
        ),
      }}
      />

      <Tabs.Screen name='cart' options={{
        title: 'Cart', tabBarIcon: ({ color, size }) => (
          <Feather name='shopping-bag' size={size} color={color} />
        ),
      }}
      />

      <Tabs.Screen name='profile' options={{
        title: 'Profile', tabBarIcon: ({ color, size }) => (
          <Ionicons name='person-outline' size={size} color={color} />
        ),
      }}
      />

    </Tabs>
  )
}
