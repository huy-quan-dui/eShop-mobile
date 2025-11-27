import { View, Text, StyleSheet, TouchableOpacity, ViewStyle, TextStyle } from 'react-native'
import React from 'react'
import { App_color } from '@/utils/constant';

// Generic (Generics), data type : kiểu diệu truyền vào
interface IProp {
    title?: string;
    subtitle?: string;
    containerStyle?: ViewStyle;
    textStyle?: TextStyle
}

const SectionHeading = (iprop: IProp) => {
    const { title, subtitle, containerStyle, textStyle } = iprop;
    return (
        <View style={[styles.container, containerStyle]}>
            <View style={[styles.textContainer]}>
                {/* Render Title */}
                {typeof title === 'string' ? (
                    <Text style={[styles.title, textStyle]}>{title}</Text>
                ) : (
                    title // Nếu là component (Text custom) thì render trực tiếp
                )}

                {/* Render Subtitle */}
                {subtitle && (
                    typeof subtitle === 'string' ? (
                        <Text style={[styles.subtitle , textStyle]}>{subtitle}</Text>
                    ) : (
                        subtitle // Render ReactNode
                    )
                )}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 12, 
        paddingHorizontal: 16, 
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center', 
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 20,
        fontFamily: 'Raleway-Bold', 
        color: App_color.textPrimary,
        marginBottom: 4, 
    },
    subtitle: {
        fontSize: 14,
        fontFamily: 'Raleway-Regular',
        color: App_color.textSubtitle, 
    },
});

export default SectionHeading