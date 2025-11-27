import { use, useState } from 'react'
import * as SecureStore from 'expo-secure-store';



interface User {
    id: string;
    name: string;
    email: string
    avatar?: {
        id: string
        file_id: string
        url: string;
    };
}

const useUser = () => {
    const [user, setUser] = useState<User>()
    const getUserData = async () => {
        try {
            const userString = await SecureStore.getItemAsync('user');
            if (userString) {
                const userData = JSON.parse(userString);
                setUser(userData)
                return userData
            }
            return null
        } catch (error) {
            console.error('Error getting user data from SecureStore:', error);
            return null;
        }
    }

    const updateUserData = async (newUserData: User) => {
        try {
            // Cập nhật trạng thái (State)
            setUser(newUserData);

            // Cập nhật SecureStore để dữ liệu được duy trì khi khởi động lại ứng dụng
            const userString = JSON.stringify(newUserData);
            await SecureStore.setItemAsync('user', userString);

        } catch (error) {
            console.error('Error updating user data in SecureStore:', error);
        }
    }

    return { user, setUser, getUserData, updateUserData, }

}



export default useUser