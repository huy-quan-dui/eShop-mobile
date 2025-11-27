import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';

const UploadAction = ({ isUploading, onUpload, onCancel }: any) => {
    return (
        <View style={{ gap: 8 }}>
            <Text style={styles.sectionTitle}>Upload to edit</Text>
            <Text style={styles.sectionSubtitle}>Upload your photo to unlock AI features</Text>

            <TouchableOpacity
                style={[styles.primaryButton, isUploading && styles.disabledButton]}
                onPress={onUpload}
                disabled={isUploading}
            >
                {isUploading ? (
                    <ActivityIndicator color="#FFF" />
                ) : (
                    <Text style={styles.primaryButtonText}>Upload Photo</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} onPress={onCancel}>
                <Text style={styles.secondaryButtonText}>Choose another photo</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    sectionTitle: { fontSize: 18, fontFamily: 'Poppins-Bold', color: '#111827' },
    sectionSubtitle: { fontSize: 14, fontFamily: 'Poppins-Regular', color: '#6B7280', marginBottom: 12 },
    primaryButton: {
        backgroundColor: '#2563EB', paddingVertical: 14, borderRadius: 12,
        alignItems: 'center', justifyContent: 'center', shadowColor: "#2563EB", 
        shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3,
    },
    disabledButton: { backgroundColor: '#93C5FD' },
    primaryButtonText: { color: '#FFFFFF', fontSize: 16, fontFamily: 'Poppins-SemiBold' },
    secondaryButton: { paddingVertical: 14, alignItems: 'center' },
    secondaryButtonText: { color: '#6B7280', fontSize: 15, fontFamily: 'Poppins-Medium' },
});

export default UploadAction;