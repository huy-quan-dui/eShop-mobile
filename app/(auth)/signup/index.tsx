import ShareSocialButton from '@/components/share/Button/Share.Social.Button';
import ShareInput from '@/components/share/Inputs/share.Input';
import ShareLineText from '@/components/share/Text/share.line.text';
import ShareAuthSwitch from '@/components/share/Text/ShareAuthSwitch';
import { App_color } from '@/utils/constant';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import axios, { isAxiosError } from 'axios';
import { useForm } from "react-hook-form";
import {
  KeyboardAvoidingView, Platform,
  ScrollView,
  StyleSheet, Text,
  TouchableOpacity, View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { toast } from 'sonner-native';
import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}
const signUpUser = async (userdata: SignUpFormData) => {
  // Handle user sign-up logic here
  try {
    const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/api/auth/register`, userdata);
    return response.data;

  } catch (error) {

    if (isAxiosError(error)) {
      if (!error.response) {
        throw new Error('Network error: Please check your internet connection.');
      }

      // Lấy message lỗi từ server (ví dụ: "Email đã được sử dụng")
      const errordata = error?.response?.data;
      const message = errordata?.message || 'An unknown error occurred.';

      // Ném lỗi này cho useMutation (onError) xử lý
      throw new Error(message);

    } else {
      // Lỗi không xác định (ví dụ: lỗi code phía client)
      throw new Error('An unexpected client-side error occurred.');
    }
  }
};
export default function signupScreen() {
  const SignUpForm = useForm<SignUpFormData>({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onBlur',
  });

  const signUpMutation = useMutation({
    mutationFn: signUpUser,
    onSuccess: (data, variables) => {
      router.replace({
        pathname: "/(routes)/signup-otp",
        params: {
          email: variables?.email,
          name: variables?.name,
          password: variables?.password
        }
      })
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });

  const onSignUpSubmit = (data: SignUpFormData) => {
    signUpMutation.mutate(data);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <KeyboardAvoidingView
        style={{ flex: 0 }}
        behavior={Platform.OS === 'ios' ? "padding" : "height"}>
        <ScrollView style={{ paddingHorizontal: 24, paddingTop: 24 }}
          showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.container}>
            <Text style={styles.TextTitle}>Sign Up </Text>
            <Text style={styles.textSubtitle}>Join us and explore more.</Text>
          </View>

          {/* Form field  */}
          <View style={{ gap: 6, marginTop: 8 }}>
            {/* ---------------------- form name field ---------------------- */}
            <ShareInput
              control={SignUpForm.control}
              name='name'
              label='Name'
              placeholder='Enter your Name'
              icons={<Ionicons name='person-outline' size={20} color={"#9CA3AF"} />}
              // editable={!signUpMutation.isPending}
              rules={{
                required: "name is required",
                pattern: {
                  value: /^[A-Za-zÀ-ỹ]+(?:\s[A-Za-zÀ-ỹ]+)*$/,
                  message: 'No special characters or extra spaces allowed'
                }
              }}
              error={SignUpForm.formState.errors.name}
            />

            {/* ---------------------- form email field ---------------------- */}
            <ShareInput
              control={SignUpForm.control}
              name='email'
              label='Email'
              placeholder='Enter your Email'
              icons={<Ionicons name='mail-outline' size={20} color={"#9CA3AF"} />}
              // editable={!signUpMutation.isPending}
              rules={{
                required: 'Email is required',
                pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address' }
              }}
              error={SignUpForm.formState.errors.email}
            />

            {/* ---------------------- form password field ---------------------- */}
            <ShareInput containerStyle={{ marginTop: 16 }}
              control={SignUpForm.control}
              name='password'
              label='Password'
              placeholder='Enter your password'
              icons={<Ionicons name='lock-closed-outline' size={20} color={"#9CA3AF"} />}
              sevice={true}
              editable={!signUpMutation.isPending}
              disabled={signUpMutation.isPending}
              rules={{
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' },
              }}
              error={SignUpForm.formState.errors.password}
            />
          </View>

          {/* ----------------------submit Button----------------------*/}
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: SignUpForm.formState.isValid ? App_color.blueBox : App_color.grayBox },
            ]}
            onPress={SignUpForm.handleSubmit(onSignUpSubmit)}
            disabled={!SignUpForm.formState.isValid || signUpMutation.isPending}
          >
            <Text style={{ color: '#FFFFFF', textAlign: 'center', fontFamily: 'Poppins-Medium' }}>
              {signUpMutation.isPending ? 'Signing Up...' : 'Sign Up'}
            </Text>
          </TouchableOpacity>

          {/* ---------------------- Divider ---------------------- */}
          <ShareLineText />

          {/* ---------------------- Social Login button ---------------------- */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 16 }}>
            {/* ---------------------- Google Sign in ---------------------- */}
            <ShareSocialButton
              iconType='Image'
              iconSource={require('@/assets/img/signIn.signup/Google.png')}
              text='Google'
            // disabled={signUpMutation.isPending}
            />
            {/* ---------------------- facebook Sign in ---------------------- */}
            <ShareSocialButton
              iconType='Ionicons'
              iconSource='logo-facebook'
              text='Facebook'
            // disabled={signUpMutation.isPending}
            />
          </View>
          {/*---------------------- Swich to Sign up ---------------------- */}
          <ShareAuthSwitch
            titleFirst="Already have an account? "
            titleSecon="Login"
            href="/login"
          />
        </ScrollView>
      </KeyboardAvoidingView >
    </SafeAreaView >
  )
}

const styles = StyleSheet.create({
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
    color: '#6B7280',
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
