import { useState } from 'react';
import { toast } from 'sonner-native';
import { MediaService } from '@/services/media.service';
import { ImageService } from '@/services/image.service';
import { UserService } from '@/services/user.service';
import { generateAIUrl } from '@/utils/imageHelper';

export const useProfileImage = (updateUserData: any) => {
    // --- State ---
    const [showPhotoModal, setShowPhotoModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
    const [uploadedImageId, setUploadedImageId] = useState<string>("");
    
    // Loading states
    const [isUploading, setIsUploading] = useState(false);
    const [isApplyingAI, setIsApplyingAI] = useState(false);
    
    // AI Feature states
    const [showAIFeatures, setShowAIFeatures] = useState(false);
    const [appliedFeatures, setAppliedFeatures] = useState<string[]>([]);

    // --- Actions ---

    const handleImageSelection = async (source: 'library' | 'camera') => {
        try {
            const uri = source === 'library' 
                ? await MediaService.pickFromLibrary() 
                : await MediaService.takePhoto();

            if (uri) {
                setSelectedImage(uri);
                setShowAIFeatures(true);
                // Reset upload state
                setUploadedImageUrl(null);
                setUploadedImageId("");
                setAppliedFeatures([]);
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || 'Error selecting image');
        }
    };

    const uploadImage = async (imageUri: string) => {
        setIsUploading(true);
        try {
            const data = await ImageService.uploadToImageKit(imageUri);
            
            setUploadedImageUrl(data.url);
            setUploadedImageId(data.fileId);
            setShowAIFeatures(true);
            toast.success('Upload thành công!');
        } catch (error: any) {
            console.error("Lỗi upload:", error);
            toast.error(error.message || 'Upload thất bại');
        } finally {
            setIsUploading(false);
        }
    };

    const applyAIfeature = async (feature: string) => {
        if (!uploadedImageUrl) {
            toast.error("Vui lòng upload ảnh trước");
            return;
        }

        setIsApplyingAI(true);
        try {
            // Logic toggle feature
            let newFeaturesList = [...appliedFeatures];
            if (newFeaturesList.includes(feature)) {
                newFeaturesList = newFeaturesList.filter(f => f !== feature);
            } else {
                newFeaturesList.push(feature);
            }
            setAppliedFeatures(newFeaturesList);

            // Giả lập delay UX
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Logic tạo URL chuyển sang Utils
            const finalUrl = generateAIUrl(uploadedImageUrl, newFeaturesList);
            
            setUploadedImageUrl(finalUrl);
            
            if (newFeaturesList.length > 0) {
                toast.success('Applied AI features successfully!');
            } else {
                toast.info('Reset to original image');
            }

        } catch (error) {
            console.error("AI Error", error);
            toast.error('Failed to apply feature');
        } finally {
            setIsApplyingAI(false);
        }
    };

    const saveFinalImage = async () => {
        if (!uploadedImageUrl || !uploadedImageId) return;
        try {
            const result = await UserService.updateAvatar({
                file_id: uploadedImageId,
                url: uploadedImageUrl
            });

            if (result.success) {
                await updateUserData(result.user);
                toast.success('Profile photo updated successfully!');
                resetState();
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile photo.');
        }
    };

    const resetState = () => {
        setShowPhotoModal(false);
        setSelectedImage(null);
        setShowAIFeatures(false);
        setUploadedImageUrl(null);
        setAppliedFeatures([]);
        setUploadedImageId("");
    };

    return {
        showPhotoModal, setShowPhotoModal,
        selectedImage, 
        setSelectedImage,
        uploadedImageUrl,        
        setUploadedImageUrl, 
        isUploading,
        showAIFeatures,
        setShowAIFeatures,
        appliedFeatures,
        isApplyingAI,
        pickImage: () => handleImageSelection('library'),
        takePhoto: () => handleImageSelection('camera'),
        uploadImage,
        applyAIfeature,
        saveFinalImage,
        resetState
    };
};