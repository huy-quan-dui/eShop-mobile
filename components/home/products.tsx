import { View, Text, Platform, TouchableOpacity, StyleSheet, Image } from 'react-native';
import React, { useState } from 'react';
import useUser from '@/hooks/userUser';
import { Ionicons } from '@expo/vector-icons';
import { App_color } from '@/utils/constant';
import { router } from 'expo-router';
import { ScrollView } from 'react-native-gesture-handler';

// Định nghĩa props cho rõ ràng (Optional)
interface Props {
    title: string;
    products?: any[];
    showTimer?: boolean;
    isFlashSale?: boolean;
    hideTitle?: boolean;
}

const ProductSection = ({
    title,
    products,
    showTimer = false,
    isFlashSale = false,
    hideTitle = false
}: Props) => {
    const [timers, setTimers] = useState<{ [key: string]: number }>({});
    const [wishlist, setWishlist] = useState<number[]>([]);
    const { user } = useUser();

    const handleProductPress = (product: any) => {
        // Handle press
    }

    const handleWishlishToggle = (products: any) => {
        // Handle wishlist
    }

    return (
        <View style={styles.container}>
            {!hideTitle && (
                <View style={styles.header}>
                    {/* --- Title --- */}
                    <Text style={styles.title}>
                        {title}
                    </Text>

                    {/* --- Timer (Flash Sale) --- */}
                    {showTimer && (
                        <View style={styles.timerContainer}>
                            <Ionicons name='time' size={16} color={App_color.error} />
                            <Text style={styles.timerText}>
                                02:15:15
                            </Text>
                        </View>
                    )}

                    {/* --- See All Button --- */}
                    <TouchableOpacity
                        style={styles.seeAllButton}
                        onPress={() => router.push("/(routes)/product")}
                    >
                        <Text style={styles.seeAllText}>
                            See all
                        </Text>
                        <Ionicons name='chevron-forward' size={16} color={App_color.textBlue} />
                    </TouchableOpacity>
                </View>
            )}

            {/* Phần hiển thị danh sách sản phẩm */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginHorizontal: -4 }}>
                <View style={{ flexDirection: "row", paddingHorizontal: 4 }}>

                    {products?.map((product: any, index: number) => {
                        // console.log(`Sản phẩm ${index}:`, JSON.stringify(product, null, 2));
                        const DEFAULT_AVATAR = "https://ik.imagekit.io/gw4av6kyj/product/fried-rice.jpg?updatedAt=1764043411143"
                        const discountPercentage = (product?.price && product.regular_price > product.price) ? Math.round(
                            ((product.regular_price - product.price) / product.regular_price) * 100) : 0;

                        return (
                            <View key={index} style={index > 0 ? styles.marginLefts : null}>
                                <TouchableOpacity
                                    style={[styles.productCard, index > 0 && styles.marginLefts]}
                                    onPress={() => handleProductPress(product)} activeOpacity={0.9}>
                                    
                                    {/* --- Image Section --- */}
                                    <View style={{ position: "relative" }}>
                                        <Image source={{
                                            uri: product?.image || DEFAULT_AVATAR
                                        }}
                                            style={styles.productImage}
                                            resizeMode='cover' />

                                        {/* Wishlist Heart Icon */}
                                        <TouchableOpacity
                                            style={styles.wishlistButton}
                                            activeOpacity={0.7}
                                            onPress={(e) => handleWishlishToggle(product)}>
                                            <Ionicons
                                                name="heart"
                                                size={18}
                                                color={App_color.error} />
                                        </TouchableOpacity>

                                        {/* Flash Sale / Discount Badge */}
                                        {isFlashSale ? (
                                            <View style={styles.badgeDiscountContainer}>
                                                <View style={{ flexDirection: 'row', alignItems: "center" }}>
                                                    <Ionicons name='flash' size={10} color={App_color.blueBox} />
                                                    <Text style={styles.badgeFlashSaleText}>
                                                        {timers[product.id] || "00:00:00"}
                                                    </Text>
                                                </View>
                                            </View>
                                        ) : (discountPercentage > 0 && (
                                            <View style={styles.badgeDiscountContainer}>
                                                <Text style={styles.badgeDiscountText}>-{discountPercentage}%</Text>
                                            </View>
                                        ))}
                                    </View>

                                    {/* --- Content Section --- */}
                                    <View style={{ padding: 16 }}>
                                        {/* Shop Info */}
                                        <View style={styles.shopInfoContainer}>
                                            <Image source={{
                                                uri: product?.Shop?.avatar ||
                                                    "https://images.unsplash.com/photo-1572584642822-6f8de0243c93?q=80&w=1080&auto=format&fit=crop"
                                            }}
                                                style={styles.shopAvatar}
                                                resizeMode='cover'
                                            />

                                            <View style={{ flex: 1 }}>
                                                <Text style={styles.shopName} numberOfLines={1}>
                                                    {product?.Shop?.name || "Official Store"}
                                                </Text>
                                                <View style={styles.shopRatingRow}>
                                                    <Ionicons name='star' size={10} color='#FCD34D' />
                                                    <Text style={styles.shopRatingText}>
                                                        {product?.Shop?.rating}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>

                                        {/* Product Title */}
                                        <Text style={styles.productTitle} numberOfLines={2}>
                                            {product.title}
                                        </Text>

                                        {/* Rating & Reviews */}
                                        <View style={styles.ratingContainer}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Ionicons name='star' size={12} color="#FCD34D" />
                                                <Text style={styles.reviewText}>
                                                    {product.rating || "4.5"}({product.review?.length || "1"})
                                                </Text>
                                            </View>
                                        </View>

                                        {/* Price */}
                                        <View style={styles.priceContainer}>
                                            <View style={{ flexDirection: 'row', gap: 8 }}>
                                                <Text style={styles.priceText}>
                                                    VNĐ {product?.price}
                                                </Text>
                                            </View>
                                        </View>

                                    </View>
                                </TouchableOpacity>
                            </View>
                        );
                    })}
                    {/* Add some padding at the end */}
                    <View style={{ width: 16 }} />
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        color: '#111827',
        fontFamily: 'Inter-18pt-SemiBold',
        fontWeight: Platform.OS === 'android' ? '600' : '400',
    },

    // --- Timer Styles ---
    timerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FEF2F2',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 999,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    timerText: {
        color: '#DC2626',
        marginLeft: 8,
        fontSize: 14,
        fontFamily: 'Inter-SemiBold',
        fontWeight: '600',
    },

    // --- Button Styles ---
    seeAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EFF6FF',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 999,
    },
    seeAllText: {
        color: '#2563EB',
        marginRight: 4,
        fontSize: 14,
        fontWeight: '600',
    },

    // --- Product Card Styles ---
    productCard: {
        width: 160,
        backgroundColor: 'white',
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#F9FAFB',
        overflow: 'hidden',
    },
    marginLefts: {
        marginLeft: 16, 
    },
    productImage: {
        width: '100%',
        height: 144,
        backgroundColor: '#F3F4F6',
    },
    wishlistButton: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 32,
        height: 32,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
    },

    // --- Badges ---
    badgeFlashSaleContainer: {
        position: 'absolute',
        top: 12,
        left: 12,
        zIndex: 10,
        backgroundColor: 'rgba(239, 68, 68, 0.95)',
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
    },
    badgeFlashSaleText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
        marginLeft: 4,
    },
    badgeDiscountContainer: {
        position: 'absolute',
        top: 12,
        left: 12,
        zIndex: 10,
        backgroundColor: App_color.error,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 999,
    },
    badgeDiscountText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },

    // --- Shop Info Section (NEW) ---
    shopInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12, // mb-3
    },
    shopAvatar: {
        width: 24, // w-6
        height: 24, // h-6
        borderRadius: 12, // rounded-full
        marginRight: 8, // mr-2
    },
    shopName: {
        fontSize: 12, // text-xs
        color: '#4B5563', // text-gray-600
        fontFamily: 'Inter-Regular', // font-inter-regular
    },
    shopRatingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2, // mt-0.5
    },
    shopRatingText: {
        fontSize: 12, // text-xs
        color: '#6B7280', // text-gray-500
        marginLeft: 4, // ml-1
        fontWeight: '500', // font-medium
    },

    // --- Product Info Section (NEW) ---
    productTitle: {
        fontSize: 14, // text-sm
        fontFamily: 'Poppins-SemiBold', // font-poppins-semibold
        color: '#1F2937', // text-gray-800
        marginBottom: 8, // mb-2
        lineHeight: 20, // leading-5
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8, // mb-2
    },
    reviewText: {
        fontSize: 12, // text-xs
        color: '#4B5563', // text-gray-600
        marginLeft: 4, // ml-1
        fontWeight: '500', // font-medium
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12, // mb-3
    },
    priceText: {
        fontSize: 18, // text-lg
        color: '#111827', // text-gray-900
        fontFamily: "Inter_18pt-SemiBold",
        fontWeight: Platform.OS === "android" ? "600" : "400",
    }
});

export default ProductSection;