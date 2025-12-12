import ShareInput from '@/components/share/Inputs/share.Input';
import ShareAuthSwitch from '@/components/share/Text/ShareAuthSwitch';
import { App_color } from '@/utils/constant';
import { Ionicons } from '@expo/vector-icons';
import { useMutation } from '@tanstack/react-query';
import axios, { isAxiosError } from 'axios';
import { useRouter } from 'expo-router';
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

interface ForgotPasswordFormData {
  email: string;
}

// SỬA LỖI 4: Hàm gọi API chỉ nên "throw" lỗi, không "toast"
const forgotPasswordRequest = async (data: ForgotPasswordFormData) => {
  try {
    const response = await axios.post(
      `${process.env.EXPO_PUBLIC_API_URL}/api/auth/forgot-password`,
      data
    );
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      if (!error.response) {
        throw new Error('Network error. Please check internet.'); // Ném lỗi
      }
      // Ném lỗi từ server để onError của mutation bắt
      throw new Error(error.response.data?.message || 'Failed to send email.');
    }
    throw new Error('An unexpected error occurred.'); // Ném lỗi
  }
};

export default function forgotPasswordScreen() {
  // SỬA: Bỏ `isSubmitting`, vì `useMutation` đã có `isPending` và `isSuccess`
  // const [isSubmitting, setIsSubmitting] = React.useState(false); 
  const router = useRouter();
  const forgotPasswordForm = useForm<ForgotPasswordFormData>({
    mode: "onChange",
    defaultValues: {
      email: '',
    },
  });

  const handleBackToLogin = () => {
    router.back();
  }

  const mutation = useMutation({
    mutationFn: forgotPasswordRequest,
    onSuccess: (data) => {
      toast.success(data?.message || 'Reset link sent!');
      // Màn hình "Check your email" sẽ tự động hiển thị vì `mutation.isSuccess` là true
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });

  // SỬA LỖI 1: Hàm này chỉ cần gọi mutation
  const onForgotPasswordSubmit = (data: ForgotPasswordFormData) => {
    mutation.mutate(data);
  };

  // SỬA: Hàm này dùng để gọi lại API
  const handleResendEmail = () => {
    const email = forgotPasswordForm.getValues('email');
    if (email) {
      mutation.mutate({ email }); // Gọi lại mutation
    } else {
      toast.error("Email is not available to resend.");
    }
  };

  // SỬA LỖI 2: Dùng `mutation.isSuccess` thay vì `isSubmitting`
  if (mutation.isSuccess) {
    return (
      <SafeAreaView style={{
        flex: 1, backgroundColor: '#FFFFFF',
        justifyContent: 'center', alignItems: 'center',
        paddingHorizontal: 24, paddingVertical: 16 // Thêm padding
      }}>
        {/* ... (Phần "Check your email" và "What's next" của bạn ở đây...
           ... Mình sẽ sửa các nút bấm bên dưới) ... */}
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ alignItems: 'center', marginBottom: 8 }}>
            <View style={{
              width: 80, height: 80, backgroundColor: '#DCFCE7', borderRadius: 40,
              alignItems: 'center', justifyContent: 'center', marginBottom: 24,
            }}>
              <Ionicons name='mail-open-outline' size={30} color={App_color.blueBox} />
            </View>
          </View>
          <Text style={{
            fontSize: 24, fontFamily: 'Poppins-Bold',
            color: App_color.textPrimary, marginBottom: 16, textAlign: 'center'
          }}>
            Check your email
          </Text>
          <Text style={{ color: '#6B7280', fontFamily: 'Poppins-Regular', fontSize: 16, textAlign: 'center' }}>
            We've sent a password reset link to{'\n'}
            <Text style={{ fontFamily: 'Poppins-Medium', color: '#374151' }}>
              {forgotPasswordForm.getValues('email')}
            </Text>
          </Text>
        </View>

        {/* Instructions (Tạm ẩn phần này cho đỡ rối) */}

        {/* SỬA LỖI 3: Sửa các nút bấm */}

        {/* Nút Resend Email */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: App_color.blueBox, width: '100%' }]} // Thêm style
          onPress={handleResendEmail} // Sửa: Dùng `handleResendEmail`
          disabled={mutation.isPending} // Sửa: Dùng `isPending`
        >
          <Text style={{ color: '#FFFFFF', fontFamily: 'Poppins-Medium', fontSize: 16, textAlign: 'center' }}>
            {mutation.isPending ? "Resending..." : "Resend Email"}
          </Text>
        </TouchableOpacity>

        {/* Nút Back to Login */}
        <TouchableOpacity
          onPress={handleBackToLogin} // Sửa: Dùng `handleBackToLogin`
          style={{
            borderWidth: 1, borderColor: App_color.borderLight,
            borderRadius: 12, paddingVertical: 16,
            width: '100%', marginTop: 16 // Thêm style
          }}>
          <Text style={{
            textAlign: 'center', color: App_color.textPrimary,
            fontSize: 18, fontFamily: 'Poppins-SemiBold',
          }}> Back to Login</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      {/* ... (Header và Main Content của bạn) ... */}
      <KeyboardAvoidingView
        style={{ flex: 1 }} // Sửa: flex 1
        behavior={Platform.OS === 'ios' ? "padding" : "height"}>
        <ScrollView style={{ paddingHorizontal: 24, paddingTop: 24 }}
          showsVerticalScrollIndicator={false}>

          {/* Header */}
          <View style={{
            flexDirection: 'row', alignItems: 'center', marginTop: 4,
            marginBottom: 16, marginRight: 16, padding: 8,
          }}>
            <TouchableOpacity onPress={handleBackToLogin}
              style={{ padding: 4, marginLeft: -8, marginRight: 16, }}>
              <Ionicons name='arrow-back' size={30} color={App_color.textPrimary} />
            </TouchableOpacity>
            <Text style={{
              fontSize: 20, fontFamily: 'Poppins-SemiBold',
              color: App_color.textPrimary,
            }}> Forgot Password </Text>
          </View>

          {/* Main Content */}
          <View style={styles.container}>
            <Text style={styles.TextTitle}>Reset Your Password</Text>
            <Text style={styles.textSubtitle}>
              Enter your email address below and we'll send you a link to reset your password.
            </Text>
          </View>

          {/* Form field  */}
          <View style={{ gap: 6, marginTop: 30 }}>

            {/* ---------------------- form email field ---------------------- */}
            <ShareInput
              control={forgotPasswordForm.control}
              name='email'
              label='Email Address'
              placeholder='Enter your Email'
              icons={<Ionicons name='mail-outline' size={20} color={"#9CA3AF"} />}
              rules={{
                required: 'Email is required',
                pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address' }
              }}
              error={forgotPasswordForm.formState.errors.email}
            />

            {/* ----------------------submit Button----------------------*/}
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: forgotPasswordForm.formState.isValid ? App_color.blueBox : App_color.grayBox },
              ]}
              onPress={forgotPasswordForm.handleSubmit(onForgotPasswordSubmit)}
              // SỬA: Thêm `mutation.isPending` vào `disabled`
              disabled={!forgotPasswordForm.formState.isValid || mutation.isPending}
            >
              <Text style={{ color: '#FFFFFF', textAlign: 'center', fontFamily: 'Poppins-Medium' }}>
                {/* SỬA: Hiển thị trạng thái loading */}
                {mutation.isPending ? "Sending..." : "Send Reset Link"}
              </Text>
            </TouchableOpacity>

            <ShareAuthSwitch
              titleFirst="Remember your password? "
              titleSecon="Login"
              onPress={handleBackToLogin}
            />

          </View>
        </ScrollView>
      </KeyboardAvoidingView >
    </SafeAreaView >
  )
}

// ... (const styles = ... của bạn)
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