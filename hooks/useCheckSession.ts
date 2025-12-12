import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect } from 'react';

export const useCheckSession = () => {
    useEffect(() => {
        const checkSession = async () => {
            try {
                const timestamp = await AsyncStorage.getItem("login_timestamp");
                // if never login thì thôi
                if (!timestamp) return;

                const Day_MS = 2 * 24 * 60 * 60 * 1000
                const now = Date.now();
                const loginTime = parseInt(timestamp, 10)

                if (now - loginTime > Day_MS) {
                    console.log("đăng nhập hết hạn, dăng nhập lại")

                    // thực hiện logout, xóa timetamp
                    await SecureStore.deleteItemAsync("access_token");
                    await SecureStore.deleteItemAsync("refresh_token");
                    await AsyncStorage.removeItem("user");
                    await AsyncStorage.removeItem("login_timestamp")

                    // điều hướng về loginScreen

                    router.replace("/(routes)/login")
                    alert("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
                } else {
                    console.log("Phiên đăng nhập vẫn còn hiệu lực.");
                }
            } catch (error) {
                console.log("error session", error)
            }
        };
        checkSession();
    })
}


