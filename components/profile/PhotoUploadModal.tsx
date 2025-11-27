import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';


// Import các component con (được định nghĩa bên dưới hoặc tách file)
import ImageSelector from './PhotoUploadModal/ImageSelector';
import PreviewSection from './PhotoUploadModal/PreviewSection';
import UploadAction from './PhotoUploadModal/UploadAction';
import AIControlSection from './PhotoUploadModal/AIControlSection';

interface Props {
    visible: boolean;
    onClose: () => void;
    selectedImage: string | null;
    uploadedImageUrl: string | null;
    isUploading: boolean;
    isApplyingAI: boolean;
    appliedFeatures: string[];
    onPickImage: () => void;
    onTakePhoto: () => void;
    onUpload: (uri: string) => void;
    onApplyAI: (feature: string) => void;
    onSave: () => void;
    onCancelImage: () => void;
}

const PhotoUploadModal = (props: Props) => {
    const { visible, onClose, selectedImage, uploadedImageUrl } = props;

    return (
        <Modal visible={visible} animationType='slide' presentationStyle='pageSheet'>
            <SafeAreaView style={styles.safeArea}>
                {/* Header chung */}
                <View style={styles.headerContainer}>
                    <Text style={styles.headerTitle}>Update Profile Photo</Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Ionicons name='close' size={24} color="#333" />
                    </TouchableOpacity>
                </View>

                {/* Nội dung thay đổi theo trạng thái */}
                <View style={styles.contentContainer}>
                    {!selectedImage ? (
                        // CASE 1: Chưa chọn ảnh -> Hiện Menu chọn
                        <ImageSelector
                            onTakePhoto={props.onTakePhoto}
                            onPickImage={props.onPickImage}
                        />
                    ) : (
                        // CASE 2: Đã có ảnh -> Hiện Preview + Các hành động
                        <View style={{ flex: 1 }}>
                            <PreviewSection
                                imageUri={uploadedImageUrl || selectedImage}
                                isProcessing={props.isApplyingAI}
                            />

                            {!uploadedImageUrl ? (
                                // 2A: Chưa Upload
                                <UploadAction
                                    isUploading={props.isUploading}
                                    onUpload={() => props.onUpload(selectedImage)}
                                    onCancel={props.onCancelImage}
                                />
                            ) : (
                                // 2B: Đã Upload -> Dùng AI
                                <AIControlSection
                                    isApplyingAI={props.isApplyingAI}
                                    appliedFeatures={props.appliedFeatures}
                                    onApplyAI={props.onApplyAI}
                                    onSave={props.onSave}
                                    onCancel={props.onCancelImage}
                                />
                            )}
                        </View>
                    )}
                </View>
            </SafeAreaView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
    headerContainer: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6',
    },
    headerTitle: { fontSize: 18, color: '#111827', fontFamily: 'Poppins-Bold' },
    closeButton: { padding: 4 },
    contentContainer: { flex: 1, padding: 20 }
});

export default PhotoUploadModal;