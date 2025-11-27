 import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
 import { Toaster } from 'sonner-native';
 import React, { useState } from 'react'
 
 export default function Provider({children}: {children: React.ReactNode}) {
   const [queryClient] = useState(() => new QueryClient({
    defaultOptions:{
      queries:{
        retry: 2,
        staleTime: 1000*60 //1 minute
      }
    }
   })) 
    return (
        <QueryClientProvider client={queryClient}>
        {children} 
        <Toaster position="bottom-center"/>
        </QueryClientProvider>
   )
 }