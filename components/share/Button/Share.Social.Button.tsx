import { App_color } from '@/utils/constant';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, ImageSourcePropType, StyleProp, Text, TouchableOpacity, ViewStyle, } from 'react-native';
type IoniconsName = keyof typeof Ionicons.glyphMap;
interface Iprops {
    iconType: 'Ionicons' | 'url' | 'Image';
    iconSource: IoniconsName | ImageSourcePropType | string;
    text: string;
    onPress?: () => void;
    iconColor?: string;
    textColor?: string;
    disabled?: boolean;
    containerStyle?: StyleProp<ViewStyle>;
}

const ShareSocialButton: React.FC<Iprops> = ({
    disabled=true,containerStyle,iconType, iconSource, onPress, text, iconColor = App_color.textBlue, textColor = App_color.textBlue
}) => {
    const renderIcon = () => {
        switch (iconType) {
            case 'Ionicons':
                return <Ionicons name={iconSource as IoniconsName} size={22} color={iconColor} />;
            case 'url':
                return <Image source={{ uri: iconSource as string }} style={{ width: 24, height: 24 }} />;
            case 'Image':
                return <Image source={iconSource as ImageSourcePropType} style={{ width: 24, height: 24 }} />;
            default:
                return null;
        }
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled}
            style={[{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#FFFFFF',
                borderWidth: 3,
                borderColor: App_color.borderLight,
                paddingVertical: 10,
                borderRadius: 10,
                gap: 8,
                flex: 1,}
            , containerStyle]}
        >
            {renderIcon()}
            <Text style={{ color: textColor, fontFamily: 'Poppins-Medium' }}>{text}</Text>
        </TouchableOpacity>
    );
};

export default ShareSocialButton