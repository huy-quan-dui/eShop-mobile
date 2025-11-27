import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { App_color } from '@/utils/constant';

interface Props {
    title: string;
    subtitle: string;
    icon: any; // Tên icon của Ionicons
    iconColor: string;
    iconBg?: string; // Màu nền của icon (nếu có)
    onPress: () => void;
}

const ProfileMenuItem = ({ title, subtitle, icon, iconColor, iconBg, onPress }: Props) => {
    return (
        <TouchableOpacity 
            style={styles.menuItem}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {/* Icon Container */}
                <View style={[styles.menuItemIconContainer, iconBg ? { backgroundColor: iconBg } : {}]}>
                    <Ionicons name={icon} size={24} color={iconColor} />
                </View>
                
                {/* Text Content */}
                <View style={{ flex: 1 }}>
                    <Text style={styles.menuTitle}>{title}</Text>
                    <Text style={styles.menusubtitle}>{subtitle}</Text>
                </View>

                {/* Arrow Right (Tùy chọn, thường menu nào cũng có) */}
                <Ionicons name="chevron-forward" size={20} color={App_color.textSubtitle} />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    menuItem: {
        backgroundColor: App_color.whitePrimary,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: App_color.borderLight,
        padding: 16,
        shadowColor: 'rgba(0,0,0,0.1)',
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 1,
        shadowOpacity: 1,
        elevation: 2,
    },
    menuItemIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
        // Nếu không truyền iconBg thì mặc định màu nhạt
        backgroundColor: '#F3F4F6' 
    },
    menuTitle: {
        fontSize: 18,
        fontFamily: 'Poppins-SemiBold',
        color: App_color.textPrimary,
    },
    menusubtitle: {
        fontSize: 14,
        marginTop: 4,
        fontFamily: 'Poppins-Medium',
        color: App_color.textSubtitle,
    },
});

export default ProfileMenuItem;