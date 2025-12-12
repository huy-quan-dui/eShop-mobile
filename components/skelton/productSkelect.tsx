import { App_color } from '@/utils/constant';
import { Skeleton } from 'moti/skeleton';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const ProductSkeleton = () => {
    // Cấu hình chung cho các thanh Skeleton
    const skeletonConfig = {
        colorMode: 'light' as const,
        backgroundColor: App_color.borderLight, // Dùng màu xám #E5E7EB thay cho bg-gray-200
        transition: {
            type: 'timing',
            duration: 1500,
        } as const,
    };

    return (
        <View style={styles.card}>
            {/* 1. Khối hình ảnh (h-32 = 128px) */}
            <Skeleton height={128} width={'100%'} radius={8} {...skeletonConfig} />
            
            {/* Khoảng cách mb-3 */}
            <View style={{ height: 12 }} />

            {/* 2. Khối tiêu đề (h-4 = 16px) */}
            <Skeleton height={16} width={'100%'} radius={4} {...skeletonConfig} />
            
            {/* Khoảng cách mb-2 */}
            <View style={{ height: 8 }} />

            {/* 3. Khối mô tả (h-3 = 12px, w-3/4) */}
            <Skeleton height={12} width={'75%'} radius={4} {...skeletonConfig} />
            
            {/* Khoảng cách mb-2 */}
            <View style={{ height: 8 }} />

            {/* 4. Khối giá tiền (h-4 = 16px, w-1/2) */}
            <Skeleton height={16} width={'50%'} radius={4} {...skeletonConfig} />
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        width: 160,                   // style={{ width: 160 }}
        backgroundColor: App_color.whitePrimary, // bg-white
        borderRadius: 8,              // rounded-lg
        padding: 12,                  // p-3
        marginHorizontal: 8,          // mx-2
        marginBottom: 16,             // mb-4
        
        // shadow-sm (Đổ bóng)
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.00,
        elevation: 2,                 // Bóng cho Android
    }
});

export default ProductSkeleton;