import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Provider from '@/config/providers';
import * as SecureStore from 'expo-secure-store';
import { View, ActivityIndicator } from 'react-native';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const colorScheme = useColorScheme();
  
  // Biến kiểm soát màn hình chờ
  const [isReady, setIsReady] = useState(false);

  const [fontsLoaded] = useFonts({
    "SpaceMono-Regular": require("../assets/fonts/SpaceMono-Regular.ttf"),
    "Inter-Regular": require("../assets/fonts/Inter_18pt-Regular.ttf"),
    "Inter-SemiBold": require("../assets/fonts/Inter_18pt-SemiBold.ttf"),
    "Inter-Bold": require("../assets/fonts/Inter_18pt-Bold.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Raleway-Regular": require("../assets/fonts/Raleway-Regular.ttf"),
    "Raleway-Bold": require("../assets/fonts/Raleway-Bold.ttf"),
  });

  useEffect(() => {
    // 1. Nếu Font chưa load xong thì cứ chờ, chưa làm gì cả
    if (!fontsLoaded) return;

    const checkInitialNavigation = async () => {
      try {
        // Lấy token
        const token = await SecureStore.getItemAsync("refresh_token");
        
        const currentGroup= segments[0];

        console.log("--> Check Login: Token =", !!token, "| Vị trí:", segments[0]);

        if (token) {
          // --- đã login ---
          // Nếu chưa ở trong App (tabs) thì mới đá vào. 
          // Nếu đang ở trang Login/Signup ((auth)) -> Đá về Trang chủ
          if (currentGroup === '(auth)') {
            router.replace('/(tabs)');
          }
        } else {
          // --- KHÔNG CÓ TOKEN ---
          // Nếu chưa ở trang Login thì mới đá về Login.
          if (currentGroup !=='(auth)') {
            router.replace('/(auth)/login');
          }
        }
      } catch (e) {
        console.error("Lỗi check login:", e);
        // Gặp lỗi thì an toàn nhất là về Login
        router.replace('/(auth)/login');
      } finally {
        // QUAN TRỌNG: Dù có token hay không, dù lỗi hay không
        // Bắt buộc phải tắt Loading để hiện giao diện
        setIsReady(true);
      }
    };

    checkInitialNavigation();

    // SỬA LỖI TREO: Chỉ chạy lại khi fontsLoaded thay đổi. 
    // KHÔNG cho 'segments' vào đây nữa.
  }, [fontsLoaded]); 

  // Màn hình chờ (Loading xoay vòng)
  if (!fontsLoaded || !isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Provider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="app" options={{ headerShown: false }} />
            <Stack.Screen name="(routes)/login/index" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          </Stack>
          <StatusBar style="auto" />
        </Provider>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}
