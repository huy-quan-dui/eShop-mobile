
import { App_color } from '@/utils/constant';
import { Ionicons } from '@expo/vector-icons';
import React, { useRef } from 'react';
import {
    StyleSheet, TextInput, TextInputProps, TouchableOpacity, View, ViewStyle
} from 'react-native';

// Kế thừa TextInputProps để dùng được các props chuẩn (autoFocus, keyboardType...)
interface SearchInputProps extends TextInputProps {
    value: string;
    onChangeText: (text: string) => void;
    onPressFilter?: () => void; // Hàm mở bộ lọc
    showFilter?: boolean;       // Có hiện nút lọc không?
    containerStyle?: ViewStyle; // Style tùy biến cho khung bao ngoài
    placeholder?: string;
}

const SearchInput = (props: SearchInputProps) => {
    const {
        value,
        onChangeText,
        onPressFilter,
        showFilter = false,
        containerStyle,
        placeholder,
        ...otherProps // Các props còn lại
    } = props;

    const inputRef = useRef<TextInput>(null);

    // Hàm xử lý khi bấm nút X
    const handleClear = () => {
        onChangeText('');
        inputRef.current?.focus(); // Giữ bàn phím không bị lặn xuống
    };

    return (
        <View style={[styles.container, containerStyle]}>
            {/* 1. Icon Kính lúp (Trái) */}
            <Ionicons
                name="search-outline"
                size={20}
                color={App_color.textSecondary}
                style={styles.iconLeft}
            />

            {/* 2. Input Chính */}
            <TextInput
                ref={inputRef}
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={App_color.textSecondary}
                returnKeyType="search"
                {...otherProps}
            />

            <View style={styles.rightArea}>
                {/* Nút Xóa (Chỉ hiện khi có chữ) */}
                {value.length > 0 && (
                    <TouchableOpacity onPress={handleClear} style={styles.clearBtn}>
                        <Ionicons name="close-circle" size={18} color={App_color.textSecondary} />
                    </TouchableOpacity>
                )}

                {/* Nút Bộ lọc (Tùy chọn) */}
                {showFilter && (
                    <View style={styles.filterContainer}>
                        <View style={styles.divider} />
                        <TouchableOpacity onPress={onPressFilter}>
                            <Ionicons name="options-outline" size={22} color={App_color.blueBox} />
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: App_color.whitePrimary,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: App_color.borderLight,
        height: 48,
        paddingHorizontal: 12,
        // Shadow nhẹ
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    iconLeft: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        height: '100%',
        marginTop: 4,
        color: App_color.textPrimary,
        fontFamily: 'Poppins-Regular',
        fontSize: 14,
    },
    rightArea: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    clearBtn: {
        padding: 4,
    },
    filterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 4,
    },
    divider: {
        width: 1,
        height: 24,
        backgroundColor: App_color.borderLight,
        marginHorizontal: 8,
    }
});

export default SearchInput;