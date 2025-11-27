import { createFormData } from "@/utils/imageHelper";
import { ImageKitResponse } from "@/types/image.type";

export const ImageService = {
  uploadToImageKit: async (uri: string): Promise<ImageKitResponse> => {
    const formData = createFormData(uri);

    const response = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Basic ${btoa(process.env.EXPO_PUBLIC_IMAGEKIT_PRIVATE_KEY! + ":")}`,
        'Accept': 'application/json',
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Upload failed");
    }
    
    return data;
  }
};