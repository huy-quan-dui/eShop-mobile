import BigSaleBanner from '@/components/home/banner';
import Header from '@/components/home/Header';
import ProductSkeleton from '@/components/skelton/productSkelect';
import axiosInstance from '@/utils/axiosInstance';
import { App_color } from '@/utils/constant';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { StatusBar, } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';


const Index = () => {


  const fetchProducts = async () => {
    const response = await axiosInstance.get("/product/api/get-all-products", {
      params: { page: 1, limit: 10 }
    })
    // console.log(response)
    return response.data.products
  }

  const { data: products, isLoading } = useQuery({
    queryKey: ['product'],
    queryFn: fetchProducts
  });

  console.log(products)

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: App_color.background }}>
      <StatusBar barStyle={'dark-content'} backgroundColor={App_color.backgroundLight} />
      <Header />
      <ScrollView showsVerticalScrollIndicator={false}>
        <BigSaleBanner />

        {!isLoading ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className='my-4 mx-2'>
            {[0,1,2,3,4].map((i:any)=>(
              <ProductSkeleton key={i}/>
            ))}
          </ScrollView>
        ) : (<></>)}
      </ScrollView>
    </SafeAreaView>
  );
};


export default Index;