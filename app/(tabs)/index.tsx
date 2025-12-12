import BigSaleBanner from '@/components/home/banner';
import Header from '@/components/home/Header';
import ProductSection from '@/components/home/products';
import ProductSkeleton from '@/components/skelton/productSkelect';
import useUser from '@/hooks/userUser';
import axiosInstance from '@/utils/axiosInstance';
import { App_color } from '@/utils/constant';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { Platform, StatusBar, Text, View, } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';


const Index = () => {

  const fetchProducts = async () => {
    const response = await axiosInstance.get("/api/product/api/get-all-products", {
      params: { page: 1, limit: 10 }
    })
    // console.log(response)
    return response.data.products
  }

  const { data: products, isLoading } = useQuery({
    queryKey: ['product'],
    queryFn: fetchProducts,
  });
  // console.log(products)

  const { user } = useUser();
  // console.log("CHECK USER NÈ:", JSON.stringify(user, null, 2));
  // Fetch recommended products for the user 
  const { data: recommendedProducts, isLoading: recommendedLoading,
    error: recommendedError
  } = useQuery({
    queryKey: ["recommendedProducts", user?._id],
    queryFn: async () => {
      // check Id
      if (!user || !user?._id) return [];

      const response = await axiosInstance.get(`/api/recommendation/user/${user._id}`);
      return response.data.data.products || response.data?.products || [];
    },
    enabled: !!user?._id,
    staleTime: 1000 * 60 * 5
  })
  console.log("kết quả :", recommendedProducts)

  // Log kiểm tra kết quả cuối cùng khi data về
  useEffect(() => {
    if (recommendedProducts && recommendedProducts.length > 0) {
      console.log("--> THÀNH CÔNG: Đã lấy được sản phẩm gợi ý:", recommendedProducts.length, "sản phẩm");
    }
  }, [recommendedProducts]);

  // Log lỗi nếu có
  useEffect(() => {
    if (recommendedError) {
      console.log("--> LỖI API GỢI Ý:", recommendedError);
    }
  }, [recommendedError]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: App_color.background }}>
      <StatusBar barStyle={'dark-content'} backgroundColor={App_color.backgroundLight} />
      <Header />
      <ScrollView showsVerticalScrollIndicator={false}>
        <BigSaleBanner />
        {
          user ? (
            <>
              {recommendedLoading ? (
                <View style={{ paddingVertical: 20 }}>
                  <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
                    <Text className="text-2xl text-gray-900" style={{
                      fontFamily: "Inter_18pt-SemiBold",
                      fontWeight: Platform.OS === 'android' ? '600' : 'normal'
                    }}>You might like</Text>
                  </View>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <ProductSkeleton />
                    <ProductSkeleton />
                    <ProductSkeleton />
                    <ProductSkeleton />
                    <ProductSkeleton />
                  </ScrollView>
                </View>
              ) : (recommendedProducts && recommendedProducts.length > 0 && (
                <View style={{ paddingHorizontal: 20 }}>
                  <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
                    <Text className="text-2xl text-gray-900" style={{
                      fontFamily: "Inter_18pt-SemiBold",
                      fontWeight: Platform.OS === 'android' ? '600' : 'normal'
                    }}>You might like</Text>
                  </View>
                  <ProductSection title='' products={recommendedProducts} hideTitle={true} />
                </View>
              ))}
            </>
          ) : (<></>)
        }

        {isLoading ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: 8, marginVertical: 16 }}>
            {[0, 1, 2, 3, 4].map((i: any) => (
              <ProductSkeleton key={i} />
            ))}
          </ScrollView>
        ) : (<>
          <ProductSection title="New item" products={products} />
        </>)}
      </ScrollView>
    </SafeAreaView>
  );
};


export default Index;
