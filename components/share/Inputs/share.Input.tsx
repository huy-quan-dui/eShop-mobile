import { App_color } from '@/utils/constant';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Control, Controller, FieldError, RegisterOptions } from 'react-hook-form';
import { StyleProp, StyleSheet, Text, TextInput, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';

interface Iprops {
    control: Control<any>;
    name: string;
    label?: string;
    placeholder?: string;
    icons?: React.ReactNode;
    rules?: RegisterOptions;
    sevice?: boolean;
    error?: FieldError;
    editable?: boolean;
    disabled?: boolean;

    containerStyle?: StyleProp<ViewStyle>;
    inputBoxStyle?: StyleProp<ViewStyle>;
    textInputStyle?: StyleProp<TextStyle>;
    labelStyle?: StyleProp<TextStyle>;
    errorTextStyle?: StyleProp<TextStyle>;
}


const ShareInput = (iprops: Iprops) => {
    const { control, name, label, placeholder, icons, rules = {},
        sevice, error, containerStyle, inputBoxStyle,
        textInputStyle, labelStyle, errorTextStyle, editable = true, disabled = true,
    } = iprops;

    const [showPassword, setShowPassword] = React.useState(!sevice);
    return (
        <View style={[Styles.container, containerStyle]}>
            {/* Label */}
            {label && <Text style={[Styles.textLabel, labelStyle]}>{label}</Text>}

            <Controller
                control={control}
                name={name}
                rules={rules}
                render={({ field: { onChange, onBlur, value }, }) => (
                    < View style={[Styles.inputBox, inputBoxStyle,
                    { borderColor: error ? App_color.error : App_color.borderLight }]}
                    >
                        {/* {icons trái} */}
                        {icons && <View style={{ marginRight: 2 }}>{icons}</View>}

                        <TextInput style={[Styles.textPlaceholder, textInputStyle]}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            placeholder={placeholder}
                            placeholderTextColor={App_color.TextInput}
                            secureTextEntry={!showPassword && sevice}
                            editable={editable}
                        />

                        {/* show/hide password  */}
                        {sevice && (<TouchableOpacity onPress={() => setShowPassword(!showPassword)}
                            disabled={disabled}>
                            <Ionicons name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                                size={24} color={App_color.textSecondary} />
                        </TouchableOpacity>)}
                    </View>
                )}
            />
            {/* Show Error Messeger */}
            {error && (<Text style={[Styles.errorText, errorTextStyle]}>{error.message}</Text>)}
        </View >
    )
}

const Styles = StyleSheet.create({
    container: {
        marginBottom: 8,
    },
    TextTitle: {
        fontSize: 30,
        fontFamily: 'Poppins-Bold',
        color: '#111827',
        marginBottom: 8,
    },
    textSubtitle: {
        color: App_color.textSubtitle,
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
    },

    textLabel: {
        color: App_color.textPrimary,
        fontSize: 16, marginBottom: 4,
        fontFamily: 'Poppins-Medium',
    },


    inputBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E5E7EB',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 5,

    },

    textPlaceholder: {
        flex: 1,
        marginLeft: 10,
        color: App_color.TextInput,
        // '#1F2937'
        fontFamily: 'Poppins',
    },
    errorText: {
        color: App_color.error,
        marginTop: 4,
        fontFamily: 'Poppins-Medium',
        fontSize: 12,
    },
    button: {
        borderRadius: 12,
        paddingVertical: 15,
        marginTop: 24,
    },
})

export default ShareInput