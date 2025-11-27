import axiosInstance from '@/utils/axiosInstance';
import { AvatarUpdatePayload } from "@/types/image.type";

export const UserService = {
  updateAvatar: async (avatarData: AvatarUpdatePayload) => {
    const response = await axiosInstance.post('/api/auth/update-avatar', { avatar: avatarData });
    return response.data;
  }
};