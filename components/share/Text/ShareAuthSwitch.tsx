import { App_color } from '@/utils/constant';
import { Link } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface IProps {
  titleFirst?: string;
  titleSecon?: string;
  titleThird?: string;
  href?: any;
  onPress?: () => void;
  disabled?: boolean;
}


const ShareAuthSwitch = (props: IProps) => {
  const { titleFirst, titleSecon, titleThird, href, onPress, disabled = true } = props;
  const pressableTextColor = disabled ? App_color.textSecondary : App_color.textBlue;
  return (
    <View style={styles.footer}>
      {/* titleFirst */}
      <Text style={{ color: App_color.textSecondary }}>{titleFirst}</Text>
      {/* textSecond */}
      {href ? (
        <Link href={href}>
          <Text style={[styles.textSecond, { color: pressableTextColor }]}>{titleSecon}</Text>
        </Link>
      ) : (<Pressable onPress={onPress} disabled={disabled}>
        <Text style={[styles.textSecond, { color: pressableTextColor }]}>{titleSecon}</Text>
      </Pressable>
      )}
      {/* titleThird */}
      {titleThird && <Text style={styles.textThird}>{titleThird}</Text>}
    </View>
  );
}
const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 24,
  },
  textFirst: {
    color: App_color.textSecondary,
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
  },
  textSecond: {
    color: App_color.textBlue,
    fontFamily: 'Poppins-Medium',
    textDecorationLine: 'underline',
    fontSize: 14,
  },
  textThird: {
    color: App_color.textSecondary,
    fontSize: 14,
    marginRight: 4, 
  }
});

export default ShareAuthSwitch