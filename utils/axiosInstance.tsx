import axios, { AxiosResponse } from 'axios'; 
import * as SecureStore from 'expo-secure-store';
import { CustomAxiosRequestConfig } from './axiosInstance.types';

const axiosInstance = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
    withCredentials: false // disable cookies for react native
})

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];


const getAccessToken = async (): Promise<string | null> => {
    try {
        return await SecureStore.getItemAsync("access_token");
    } catch (error) {
        console.error("Error getting access token: ", error);
        return null;
    }
}
export const storeAccessToken = async (token: string): Promise<void> => {
    try {
        await SecureStore.setItemAsync("access_token", token);
    } catch (error) {
        console.error("Error storing access token: ", error);
    }
}
export const removeAccessToken = async (): Promise<void> => {
    try {
        await SecureStore.deleteItemAsync("access_token");
    } catch (error) {
        console.error("Error removing access token: ", error);
    }
}
const handleLogout = () => { }
const subscribeTokenRefresh = (callback: (token: string) => void): void => {
    refreshSubscribers.push(callback);
};
const onRefreshSuccess = (token: string): void => {
    refreshSubscribers.forEach((callback) => callback(token));
    refreshSubscribers = [];
};

// Request interceptor
axiosInstance.interceptors.request.use(
    async (config) => {
        // Add authorization header if token exists
        const token = await getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response  interceptor 
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config as CustomAxiosRequestConfig;
        const is401 = error.response?.status === 401;
        const isRetry = originalRequest._retry;
        const hasAuthHeader = originalRequest.headers?.Authorization;

        if (is401 && !isRetry && hasAuthHeader) {

            // Đảm bảo headers tồn tại trước khi truy cập
            if (!originalRequest.headers) {
                originalRequest.headers = {} as any;
            }

            if (isRefreshing) {
                // làm mới token -> cho request vào hàng đợi
                return new Promise<AxiosResponse>((resolve) => {
                    subscribeTokenRefresh((token: string) => {
                        originalRequest.headers!.Authorization = `Bearer ${token}`;
                        resolve(axiosInstance(originalRequest));
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Get refresh token from secure store 
                const refreshToken = await SecureStore.getItemAsync("refresh_token");
                if (!refreshToken) {
                    throw new Error("No refresh token available");
                }

                const response = await axios.post(
                    `${process.env.EXPO_PUBLIC_API_URL}/auth/refresh-token`,
                    { refreshToken },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${refreshToken}`
                        }
                    }
                )

                const newAccessToken = response.data?.access_token; // Lưu lại token mới

                // SỬA LỖI 2: Kiểm tra token trước khi sử dụng
                if (!newAccessToken) {
                    throw new Error("Refresh token response missing new access token.");
                }

                await storeAccessToken(newAccessToken) // Lưu token mới vào SecureStore

                isRefreshing = false;
                onRefreshSuccess(newAccessToken); // Gọi các request đang chờ

                // SỬA LỖI 1: Cập nhật header cho request gốc trước khi thử lại
                originalRequest.headers!.Authorization = `Bearer ${newAccessToken}`;

                return axiosInstance(originalRequest)

            } catch (refreshError) {
                isRefreshing = false;
                refreshSubscribers = []

                // Clear token and redirct to login 
                await removeAccessToken();
                await SecureStore.deleteItemAsync("refresh_token");
                await SecureStore.deleteItemAsync("user_data");
                handleLogout() // only for protected requests
                return Promise.reject(refreshError)
            }

        }

        return Promise.reject(error)
    }
)

export default axiosInstance;