import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AIControlSection = ({ isApplyingAI, appliedFeatures, onApplyAI, onSave, onCancel }: any) => {
    return (
        <View style={{ flex: 1 }}>
            <Text style={styles.sectionTitle}>AI Enhancements</Text>
            
            <ScrollView style={{ marginTop: 8 }} showsVerticalScrollIndicator={false}>
                <View style={{ gap: 12 }}>
                    <AIFeatureButton
                        title="Remove Background" desc="Isolate the subject"
                        icon="cut-outline" iconColor="#7C3AED" bgColor="#F3E8FF"
                        isActive={appliedFeatures.includes("bg-remove")}
                        onPress={() => onApplyAI("bg-remove")} disabled={isApplyingAI}
                    />
                    <AIFeatureButton
                        title="Smart Relight" desc="Fix lighting & shadows"
                        icon="sunny-outline" iconColor="#D97706" bgColor="#FEF3C7"
                        isActive={appliedFeatures.includes("relight")}
                        onPress={() => onApplyAI("relight")} disabled={isApplyingAI}
                    />
                    <AIFeatureButton
                        title="Enhance Quality" desc="Sharpen & upscale details"
                        icon="sparkles-outline" iconColor="#2563EB" bgColor="#DBEAFE"
                        isActive={appliedFeatures.includes("quality-improve")}
                        onPress={() => onApplyAI("quality-improve")} disabled={isApplyingAI}
                    />
                </View>
            </ScrollView>

            {/* Footer Buttons */}
            <View style={styles.footerContainer}>
                <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={onSave}>
                    <Text style={styles.saveButtonText}>Save Profile</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const AIFeatureButton = ({ title, desc, icon, iconColor, bgColor, isActive, onPress, disabled }: any) => (
    <TouchableOpacity
        style={[styles.aiButton, isActive && styles.aiButtonActive, disabled && { opacity: 0.6 }]}
        onPress={onPress} disabled={disabled}
    >
        <View style={[styles.aiIconBox, { backgroundColor: bgColor }]}>
            <Ionicons name={icon} size={22} color={iconColor} />
        </View>
        <View style={{ flex: 1 }}>
            <Text style={styles.aiTitle}>{title}</Text>
            <Text style={styles.aiDesc}>{desc}</Text>
        </View>
        {isActive && (
            <View style={styles.checkMark}>
                <Ionicons name='checkmark' size={14} color="white" />
            </View>
        )}
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    sectionTitle: { fontSize: 18, fontFamily: 'Poppins-Bold', color: '#111827', marginBottom: 8 },
    aiButton: { flexDirection: 'row', alignItems: 'center', padding: 12, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, backgroundColor: '#FFFFFF' },
    aiButtonActive: { borderColor: '#3B82F6', backgroundColor: '#EFF6FF' },
    aiIconBox: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    aiTitle: { fontSize: 15, fontFamily: 'Poppins-SemiBold', color: '#1F2937' },
    aiDesc: { fontSize: 12, fontFamily: 'Poppins-Regular', color: '#6B7280' },
    checkMark: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#2563EB', alignItems: 'center', justifyContent: 'center' },
    footerContainer: { flexDirection: 'row', gap: 12, marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
    cancelButton: { flex: 1, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', alignItems: 'center', backgroundColor: '#FFFFFF' },
    cancelButtonText: { fontFamily: 'Poppins-Medium', color: '#4B5563' },
    saveButton: { flex: 1, padding: 14, borderRadius: 12, backgroundColor: '#2563EB', alignItems: 'center', shadowColor: "#2563EB", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 2, elevation: 2 },
    saveButtonText: { fontFamily: 'Poppins-Bold', color: '#FFFFFF' },
});

export default AIControlSection;