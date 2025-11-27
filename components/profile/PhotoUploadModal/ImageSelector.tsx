import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ImageSelector = ({ onTakePhoto, onPickImage }: { onTakePhoto: () => void, onPickImage: () => void }) => {
    return (
        <View style={{ gap: 16 }}>
            <Text style={styles.infoText}>How would you like to upload?</Text>
            
            <OptionButton 
                title="Take a photo" desc="Use your camera" 
                icon="camera" iconColor="#2563EB" bgColor="#DBEAFE"
                onPress={onTakePhoto} 
            />
            <OptionButton 
                title="Choose from Gallery" desc="Select from your photos" 
                icon="image" iconColor="#16A34A" bgColor="#DCFCE7"
                onPress={onPickImage} 
            />
        </View>
    );
};

// Component nút bấm nhỏ nội bộ
const OptionButton = ({ title, desc, icon, iconColor, bgColor, onPress }: any) => (
    <TouchableOpacity style={styles.optionButton} onPress={onPress}>
        <View style={[styles.iconBox, { backgroundColor: bgColor }]}>
            <Ionicons name={icon} size={24} color={iconColor} />
        </View>
        <View style={{ flex: 1 }}>
            <Text style={styles.optionTitle}>{title}</Text>
            <Text style={styles.optionDesc}>{desc}</Text>
        </View>
        <Ionicons name='chevron-forward' size={20} color="#9CA3AF" />
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    infoText: { fontSize: 16, fontFamily: 'Poppins-Medium', color: '#4B5563', marginBottom: 8 },
    optionButton: {
        flexDirection: 'row', alignItems: 'center', padding: 16, marginBottom: 12,
        borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 16, backgroundColor: '#FFFFFF',
    },
    iconBox: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
    optionTitle: { fontSize: 16, fontFamily: 'Poppins-SemiBold', color: '#1F2937' },
    optionDesc: { fontSize: 13, fontFamily: 'Poppins-Medium', color: '#6B7280' },
});

export default ImageSelector;