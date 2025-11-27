import { App_color } from '@/utils/constant'
import React from 'react'
import { Text, View } from 'react-native'

const ShareLineText = () => {
    return (
        < View style={{
            flexDirection: 'row',
            alignItems: 'center', marginVertical: 24
        }}>
            <View style={{ flex: 1, height: 1.2, backgroundColor: App_color.grayBox }} />
            <Text style={{ marginHorizontal: 8, color: App_color.textSecondary, fontFamily: 'Poppins-Medium' }}>Or using other method</Text>
            <View style={{ flex: 1, height: 1.2, backgroundColor: App_color.grayBox }} />
        </View >
    )
}

export default ShareLineText