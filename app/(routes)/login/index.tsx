
import ShareSocialButton from '@/components/share/Button/Share.Social.Button';
import ShareInput from '@/components/share/Inputs/share.Input';
import ShareLineText from '@/components/share/Text/share.line.text';
import ShareAuthSwitch from '@/components/share/Text/ShareAuthSwitch';
import { App_color } from '@/utils/constant';
import { Ionicons } from '@expo/vector-icons';
import { useMutation } from '@tanstack/react-query';
import axios, { isAxiosError } from 'axios';
import { router } from 'expo-router';
import React from 'react';
import { useForm } from "react-hook-form";
import {
  KeyboardAvoidingView, Platform,
  ScrollView,
  StyleSheet, Text,
  TouchableOpacity, View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { toast } from 'sonner-native';
import * as SecureStore from 'expo-secure-store';
import { storeAccessToken } from '@/utils/axiosInstance';

interface LoginFormData {
  email: string;
  password: string;
}

const loginUser = async (userdata: LoginFormData) => {
  // Handle user sign-up logic here
  try {
    const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/api/auth/login`, userdata);
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      if (!error.response) {
        throw new Error('Network error: Please check your internet connection.');
      }
      // Handle deffined startus code here
      const status = error?.response?.status;
      const errordata = error?.response?.data;
      if (status === 400 || status === 422) {
        toast.error(errordata?.message || 'Invalid input data. Please check your information and try again.');
      }
      else if (status === 401) { // Typically for login or protected routes
        toast.error(errordata?.message || 'Unauthorized. Please check your credentials or token.');
      }
      else if (status === 404) { // Typically for non-existent resources or user accounts
        toast.error(errordata?.message || 'The requested resource or user was not found.');
      }
      else if (status === 429) { // Security: Too many failed login attempts
        toast.error(errordata?.message || 'Too many login attempts. Please try again later.');
      }
      else if (status >= 500) {
        toast.error(errordata?.message || 'A server error occurred. Please try again later.');
      }
      else {
        // A catch-all for other 4xx errors
        toast.error(errordata?.message || 'An unexpected error occurred. Please try again.');
      }
    } else {
      toast.error('An unexpected client-side error occurred.');
    }
    throw error;
  }
}
export default function LoginScreen() {
  const [showPassword, setShowPassword] = React.useState(false);
  const loginForm = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onBlur',
  });

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: async (data) => {
      toast.success("Login successful! welcomw back")
      const user = {
        id: data?.user?.id,
        name: data?.user?.name,
        email: data?.user?.email,
        avatar: data?.user?.avatar,
      };
      // Store user data and tokens
      await SecureStore.setItemAsync("user", JSON.stringify(user))

      // store access token if available
      if (data?.accessToken) {
        await storeAccessToken(data.accessToken);
      }
      // Store refesh token if available
      if (data?.refeshToken) {
        await SecureStore.setItemAsync("refesh_token", data.refeshToken)
      }
      router.replace("/(tabs)")
    },
    onError: (error: Error) => {
      toast.error(error?.message)
    }
  });

  const onLoginSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <KeyboardAvoidingView
        style={{ flex: 0 }}
        behavior={Platform.OS === 'ios' ? "padding" : "height"}>
        <ScrollView style={{ paddingHorizontal: 24, paddingTop: 24 }}
          showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.container}>
            <Text style={styles.TextTitle}>Welcome back</Text>
            <Text style={styles.textSubtitle}>Sign in to your account</Text>
          </View>

          {/* Form field  */}
          <View style={{ gap: 6, marginTop: 8 }}>

            {/* ---------------------- form email field ---------------------- */}
            <ShareInput
              control={loginForm.control}
              name='email'
              label='Email'
              placeholder='Enter your Email'
              icons={<Ionicons name='mail-outline' size={20} color={"#9CA3AF"} />}
              rules={{
                required: 'Email is required',
                pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address' }
              }}
              error={loginForm.formState.errors.email}
              editable={!loginMutation.isPending}
            />

            {/* ---------------------- form password field ---------------------- */}
            <ShareInput containerStyle={{ marginTop: 16 }}
              control={loginForm.control}
              name='password'
              label='Password'
              placeholder='Enter your password'
              icons={<Ionicons name='lock-closed-outline' size={20} color={"#9CA3AF"} />}
              sevice={true}
              rules={{
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' },
              }}
              error={loginForm.formState.errors.password}
              editable={!loginMutation.isPending}
              disabled={loginMutation.isPending}
            />
          </View>

          {/* -----------------------Forgot password----------------------  */}
          <TouchableOpacity style={{ alignSelf: 'flex-end', marginTop: 8 }}
            onPress={() => router.push("/(routes)/forgot-password")}
            disabled={loginMutation.isPending}
          >
            <Text style={{ color: App_color.textBlue, fontFamily: 'Poppins-Medium' }}>
              Forgot password?
            </Text>
          </TouchableOpacity>

          {/* ----------------------submit Button----------------------*/}
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: loginForm.formState.isValid ? App_color.blueBox : App_color.grayBox },
            ]}
            onPress={loginForm.handleSubmit(onLoginSubmit)}
            disabled={!loginForm.formState.isValid}
          >
            <Text style={{ color: '#FFFFFF', textAlign: 'center', fontFamily: 'Poppins-Medium' }}>
              Sign in
            </Text>
          </TouchableOpacity>

          {/* ---------------------- Divider ---------------------- */}
          <ShareLineText />

          {/* ---------------------- Social Login button ---------------------- */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 16 }}>
            {/* Google Sign in */}
            <ShareSocialButton
              iconType='Image'
              iconSource={require('@/assets/img/signIn.signup/Google.png')}
              text='Google'
              disabled={loginMutation.isPending}
            />
            {/* ---------------------- facebook Sign in ---------------------- */}
            <ShareSocialButton
              iconType='Ionicons'
              iconSource='logo-facebook'
              text='Facebook'
              disabled={loginMutation.isPending}
            />
          </View>
          {/*---------------------- Swich to Sign up ---------------------- */}
          <ShareAuthSwitch
            titleFirst="Don't have an account? "
            titleSecon="Sign up"
            href="/signup"
            disabled={loginMutation.isPending}
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