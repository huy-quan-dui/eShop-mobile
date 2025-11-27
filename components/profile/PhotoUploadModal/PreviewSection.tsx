import React from 'react';
import { View, Image, Text, ActivityIndicator, StyleSheet } from 'react-native';

const PreviewSection = ({ imageUri, isProcessing }: { imageUri: string | null, isProcessing: boolean }) => {
    return (
        <View style={styles.previewContainer}>
            <View style={styles.imageWrapper}>
                {isProcessing && (
                    <View style={styles.loadingOverlay}>
                        <ActivityIndicator size="large" color="#FFFFFF" />
                        <Text style={styles.loadingText}>Processing AI...</Text>
                    </View>
                )}
                {imageUri && (
                    <Image source={{ uri: imageUri }} style={styles.previewImage} resizeMode='cover' />
                )}
            </View>
            <Text style={styles.previewLabel}>Preview</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    previewContainer: { alignItems: 'center', marginTop: 10, marginBottom: 20 },
    imageWrapper: {
        position: 'relative', shadowColor: "#000", shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15, shadowRadius: 10, elevation: 5, borderRadius: 70,
    },
    previewImage: { width: 140, height: 140, borderRadius: 70, borderWidth: 4, borderColor: '#FFFFFF' },
    loadingOverlay: {
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 70,
        backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', zIndex: 10,
    },
    loadingText: { color: 'white', fontSize: 10, fontFamily: 'Poppins-Bold', marginTop: 4 },
    previewLabel: { marginTop: 12, fontSize: 14, color: '#6B7280', fontFamily: 'Poppins-Medium' },
});

export default PreviewSection;