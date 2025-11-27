import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const BigSaleBanner = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.card} 
        activeOpacity={0.9} // Hiệu ứng khi bấm vào mượt hơn
      >
        {/* 1. Background Image */}
        <Image
          source={require('@/assets/images/banners/1Banner.png')} 
          style={styles.image}
          resizeMode='cover'
        />

        {/* 2. Gradient Overlay */}
        <LinearGradient
          // Mình giữ nguyên màu bạn chọn (Đen mờ bên trái -> Trong suốt -> Đen nhẹ bên phải)
          colors={["rgba(0,0,0,0.4)", "transparent", "rgba(0,0,0,0.1)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          {/* 3. Text Container */}
          <View style={styles.textContainer}>
            <Text style={styles.bigSaleText}>
              BIG SALE
            </Text>
            
            {/* Mình thêm dòng phụ này để banner trông đầy đặn hơn (tuỳ chọn) */}
            <Text style={styles.subText}>Up to 50% off</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
  },
  card: {
    height: 192, 
    borderRadius: 16, 
    overflow: 'hidden', 
    backgroundColor: '#fff',
    
    // Shadow-lg (Đổ bóng)
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject, 
    justifyContent: 'center', 
  },
  textContainer: {
    width: '65%', 
    paddingHorizontal: 24, 
  },
  bigSaleText: {
    
    fontFamily: 'Poppins-Bold',
    fontSize: 36, 
    fontWeight: '700', 
    color: '#1f2937',
    
    textTransform: 'uppercase',
    letterSpacing: 1,
    lineHeight: 40,
    textShadowColor: 'rgba(255, 255, 255, 0.9)', 
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subText: {
    marginTop: 4,
    fontSize: 14,
    color: '#4b5563', // gray-600
    fontFamily: 'Poppins-Medium',
    fontWeight: '500',
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  }
});

export default BigSaleBanner;