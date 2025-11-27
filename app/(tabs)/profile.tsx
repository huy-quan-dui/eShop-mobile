import { View, Text, StatusBar, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
// Import các phần đã tách
import useUser from '@/hooks/userUser'
import { useProfileImage } from '@/hooks/useProfileImage'
import PhotoUploadModal from '@/components/profile/PhotoUploadModal'
import { App_color } from '@/utils/constant'
import ProfileMenuItem from '@/components/profile/ProfileMenuItem'
import { removeAccessToken } from '@/utils/axiosInstance'
import SectionHeading from '@/components/share/Text/ShareSectionHeading'
const handleLogout =async () => {
    try{
        console.log("User logging out...");
        await removeAccessToken();
        router.replace("/(routes)/login")
    }catch(error){
        console.error("Error during logout: ", error);
        router.replace("/(routes)/login")
    }
};
const menuItems = [
    {
        id: 'orders',
        title: 'My Orders',
        subtitle: 'Track your orders and view history',
        icon: "bag-handle-outline",
        iconColor: "#2563EB",
        iconBg: "#DBEAFE",
        onPress: () => router.push("/(routes)/my-order")
    },
    {
        id: 'messages',
        title: 'Messages',
        subtitle: 'Check your inbox and conversations',
        icon: "mail-outline",
        iconColor: "#16A34A",
        iconBg: "#DCFCE7",
        onPress: () => router.push("/(tabs)/messages")
    },
    {
        id: 'notifications',
        title: 'Notifications',
        subtitle: 'See all your updates',
        icon: 'notifications-outline',
        iconColor: '#D97706',
        iconBg: '#FEF3C7',
        onPress: () => router.push("/(routes)/notifications/notifications")
    },
    {
        id: 'address',
        title: 'Shipping Address',
        subtitle: 'Manage your saved addresses',
        icon: 'location-outline',
        iconColor: '#8B5CF6',
        iconBg: '#EDE9FE',
        onPress: () => router.push("/(routes)/address/address")
    },
    {
        id: 'change-password',
        title: 'Change Password',
        subtitle: 'Update your password for security',
        icon: "lock-closed-outline",
        iconColor: "#DC2626",
        iconBg: "#FEE2E2",
        onPress: () => router.push("/(routes)/change-password")
    },
    {
        id: 'settings',
        title: 'Settings',
        subtitle: 'Notifications, language, dark mode',
        icon: "settings-outline",
        iconColor: "#4B5563",
        iconBg: "#E5E7EB",
        onPress: () => router.push("/(routes)/setting/setting")
    },
    {
        id: 'logout',
        title: 'Logout',
        subtitle: 'Sign out of your account',
        icon: "log-out-outline",
        iconColor: "#701A75",
        iconBg: "#FAE8FF",
        onPress: handleLogout
    }
];

// --- 2. FUNCTION COMPONENT CHÍNH ---
// Đây là cái bạn bị thiếu lúc nãy
const ProfileScreen = () => {

    const { user, updateUserData } = useUser();

    // Gọi Hook logic xử lý ảnh ở đây
    const imageLogic = useProfileImage(updateUserData);

    return (
        <SafeAreaView
            edges={["bottom"]}
            style={{ flex: 1, paddingTop: 48, backgroundColor: App_color.whitePrimary }}
        >
            <StatusBar barStyle={"dark-content"} backgroundColor={App_color.whitePrimary} />

            {/* Header */}
            <View style={styles.headerContainer}>
                <SectionHeading title='Profile' 
                subtitle={`Welcome, ${user?.name || "User"}`}/>
            </View>



            <ScrollView style={{ flex: 1 }} showsHorizontalScrollIndicator={false}>
                <View style={{ padding: 16 }}>

                    {/* Profile Header Card */}
                    <View style={styles.profileCard}>
                        <View style={styles.userInfoContainer}>
                            <View style={styles.avatarContainer}>
                                <View style={{ position: 'relative' }}>
                                    <Image source={{
                                        uri: user?.avatar?.url ||
                                            'https://plus.unsplash.com/premium_vector-1711987772726-64785d1bade8?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687'
                                    }}
                                        style={styles.avatarImage} resizeMode='cover'
                                    />

                                    {/* Kích hoạt Modal từ Hook */}
                                    <TouchableOpacity
                                        style={styles.editIconBadge}
                                        onPress={() => imageLogic.setShowPhotoModal(true)}
                                    >
                                        <Ionicons name='camera' size={12} color={App_color.whitePrimary} />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.userTextContainer}>
                                <Text style={styles.userName}>{user?.name || "user name"}</Text>
                                <Text style={styles.userEmail}>{user?.email || "user@example.com"}</Text>
                                {/* Kích hoạt Modal từ Hook */}
                                <TouchableOpacity style={{ marginTop: 8 }}
                                    onPress={() => imageLogic.setShowPhotoModal(true)}
                                >
                                    <Text style={styles.testChange}>Change Photo</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Quick Stats */}
                        <View style={{ flexDirection: 'row', gap: 8 }}>
                            <View style={styles.statCard}>
                                <View style={styles.statCardHeader}>
                                    <Ionicons name='time-outline' size={20} color={App_color.blueBox} style={{ marginRight: 8 }} />
                                    <Text style={styles.statCardTitle}>Order</Text>
                                </View>
                                <Text style={styles.statusCardText}>7</Text>
                            </View>
                            <View style={styles.statCard}>
                                <View style={styles.statCardHeader}>
                                    <Ionicons name='person-add-outline' size={20} color={App_color.blueBox} style={{ marginRight: 8 }} />
                                    <Text style={styles.statCardTitle}>Follow</Text>
                                </View>
                                <Text style={styles.statusCardText}>7</Text>
                            </View>
                            <View style={styles.statCard}>
                                <View style={styles.statCardHeader}>
                                    <Ionicons name='bag-check-outline' size={20} color={App_color.blueBox} style={{ marginRight: 8 }} />
                                    <Text style={styles.statCardTitle}>Cart</Text>
                                </View>
                                <Text style={styles.statusCardText}>7</Text>
                            </View>
                        </View>
                    </View>

                    {/* Menu items */}
                    <View style={{ gap: 16 }}>
                        {menuItems.map((item) => (
                            <ProfileMenuItem
                                key={item.id}
                                title={item.title}
                                subtitle={item.subtitle}
                                icon={item.icon}
                                iconColor={item.iconColor}
                                iconBg={item.iconBg}
                                onPress={item.onPress}
                            />
                        ))}
                    </View>

                    {/* Bottom Spacing */}
                    <View style={{ height: 40 }} />
                </View>
            </ScrollView>

            {/* MODAL COMPONENT */}
            <PhotoUploadModal
                visible={imageLogic.showPhotoModal}
                onClose={imageLogic.resetState}
                selectedImage={imageLogic.selectedImage}
                uploadedImageUrl={imageLogic.uploadedImageUrl}
                isUploading={imageLogic.isUploading}
                isApplyingAI={imageLogic.isApplyingAI}
                appliedFeatures={imageLogic.appliedFeatures}
                onPickImage={imageLogic.pickImage}
                onTakePhoto={imageLogic.takePhoto}
                onUpload={imageLogic.uploadImage}
                onApplyAI={imageLogic.applyAIfeature}
                onSave={imageLogic.saveFinalImage}
                onCancelImage={() => {
                    imageLogic.setSelectedImage(null);
                    imageLogic.setUploadedImageUrl(null);
                    imageLogic.setShowAIFeatures(false);
                }}
            />
        </SafeAreaView>
    )
}

// Xuất component này ra để Expo Router sử dụng
export default ProfileScreen

// --- 3. STYLES (Đã được làm sạch) ---
const styles = StyleSheet.create({
    headerContainer: {
        backgroundColor: '#ffffff',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    profileCard: {
        backgroundColor: App_color.whitePrimary,
        borderRadius: 16,
        padding: 24,
        marginBottom: 24,
        shadowColor: App_color.textSecondary,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    userInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    avatarContainer: {
        position: 'relative',
        alignItems: 'center',
        borderRadius: 8,
    },
    avatarImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    editIconBadge: {
        position: 'absolute',
        bottom: 4,
        right: 4,
        width: 24,
        height: 24,
        backgroundColor: App_color.blueBox,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center'
    },
    userTextContainer: {
        marginLeft: 16,
        flex: 1,
    },
    userName: {
        fontSize: 20,
        lineHeight: 28,
        fontFamily: 'Poppins-Bold',
        color: App_color.textPrimary,
    },
    userEmail: {
        fontSize: 16,
        lineHeight: 28,
        fontFamily: 'Poppins-Bold',
        color: App_color.textSubtitle,
    },
    testChange: {
        color: App_color.textBlue,
        fontFamily: 'Poppins-Medium',
        fontSize: 14,
    },
    statCard: {
        flex: 1,
        backgroundColor: App_color.backgroundLight,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
    },
    statCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 4
    },
    statCardTitle: {
        color: App_color.textDarkGray,
        fontFamily: 'Poppins-Medium',
        fontSize: 14,
    },
    statusCardText: {
        fontSize: 20,
        fontFamily: 'poppins-bold',
        marginTop: 4,
        color: App_color.textPrimary,
        width: '75%'
    },
    menuItemIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
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