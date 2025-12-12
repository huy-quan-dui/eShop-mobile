import { router, useGlobalSearchParams } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
  KeyboardAvoidingView, Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity, View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ShareAuthSwitch from '@/components/share/Text/ShareAuthSwitch';
import { App_color } from '@/utils/constant';
import { Ionicons } from '@expo/vector-icons';
import { useMutation } from '@tanstack/react-query';
import axios, { isAxiosError } from 'axios';
import { toast } from 'sonner-native';

interface VerifyOTPData {
  otp: string;
  email: string;
  name?: string;
  password?: string;
}

interface ResendOTPData {
  email: string;
  name: string;
  password: string;
}

const SignUpOtp = () => {
  const [otp, setOtp] = React.useState(['', '', '', '']);
  const [countDown, setcountDown] = React.useState(60);
  const [canResend, setCanResend] = React.useState(false);
  // get dymanic parameters from signup screen
  const { name, email, password } = useGlobalSearchParams<
    {
      name: string;
      email: string;
      password: string
    }
  >();
  const inputRefs = useRef<(TextInput | null)[]>([]);

  // countdown timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout | any;
    if (countDown > 0 && !canResend) {
      timer = setTimeout(() => {
        setcountDown(countDown - 1);
      }, 1000);
    } else if (countDown === 0) {
      setCanResend(true)
    }
    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [canResend, countDown])

  // Start countDown on Component mount 
  useEffect(() => {
    setCanResend(false)
    setcountDown(60)
  }, [])

  // Validate required parameters
  useEffect(() => {
    if (!name || !email || !password) {
      toast.error("Missing information", {
        description: "Please go back and fill all the required fields."
      });
      router.back();
    };
  }, [name, email, password]);

  // VerifyOTP
  const verifyOtp = async (data: VerifyOTPData) => {
    try {
      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/api/auth/verify`,
        // pay load
        {
          verificationCode: data.otp,
          email: data.email,
          name: data?.name,
          password: data?.password,
        },
        {
          timeout: 10000,
        }

      )
      return response.data
    } catch (error) {
      console.error("OTP verification error", error)
      if (isAxiosError(error)) {
        if (!error.response) {
          throw new Error('Network error: Please check your internet connection.');
        }
        // --- BỔ SUNG LOG VÀO ĐÂY ---
        const status = error?.response?.status;
        const errorData = error?.response?.data;
        console.error("Backend Error Status:", status);
        console.error("Backend Error Data:", errorData);

        if (status === 400 || status === 422) {
          toast.error(errorData?.message || "Invalid OTP or signup data.")
        }
        else if (status === 404) {
          toast.error(errorData?.message || 'OTP expired or not found.');
        }
        else if (status === 409) {
          toast.error(errorData?.message || 'User alrer exists.');
        }
        else if (status === 429) {
          toast.error(errorData?.message || 'Too many attempts. please try again later.');
        }
        else if (status >= 500) {
          toast.error(errorData?.message || 'Server error: Please try again later.');
        }
        else if (status === 401) {
          toast.error(errorData?.message || 'Verification token is invalid or missing.');
        }
        else {
          toast.error(errorData?.message || 'Sign-up failed. Please try again.');
        }
      }
      toast.error("An unexpected error occurred.")
    }
  };

  // ResendOTP
  const resendOtp = async (data: ResendOTPData) => {
    try {
      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/api/auth/resend-otp`,
        {
          email: data.email,
        },
        {
          timeout: 10000,
        }
      );

      toast.success(response.data?.message || 'A new OTP has been sent to your email.');

      return response.data;
    } catch (error) {
      console.error("Resend OTP error", error);

      if (isAxiosError(error)) {
        if (!error.response) {
          // Handle network or timeout errors
          throw new Error('Network error: Please check your internet connection and try again.');
        }

        // Handle different API response status codes
        const status = error?.response?.status;
        const errorData = error?.response?.data;

        if (status === 400 || status === 422) {
          toast.error(errorData?.message || "Invalid email format.");
        }
        else if (status === 404) {
          toast.error(errorData?.message || 'This email is not registered.');
        }
        else if (status === 429) {
          toast.error(errorData?.message || 'Too many attempts. Please try again later.');
        }
        else if (status >= 500) {
          toast.error(errorData?.message || 'Server error: Could not resend OTP. Please try again later.');
        }
        else {
          toast.error(errorData?.message || 'Failed to resend OTP. Please try again.');
        }
      } else {
        // Handle non-Axios errors
        toast.error("An unexpected error occurred.");
      }

      // It's good practice to re-throw the error if you want to handle it further up the call stack
      throw error;
    }
  };

  const verifyOTPMutation = useMutation({
    mutationFn: verifyOtp,
    onSuccess: (data) => {
      toast.success("Welcome!", {
        description: `Account create successfully for ${name}!`
      })
      // Navigate to next csreen on success
      router.replace("/(routes)/login")
    },
    onError: (error: Error) => {
      toast.error("Verification Failed", {
        description: error.message,
      })
    }
  });

  const resendOTPMutation = useMutation({
    mutationFn: resendOtp,
    onSuccess: (data) => {
      toast.success("New OTP Sent!", {
        description: `A new OTP has been sent to ${email}.`
      });
      // Clear current OTP
      setOtp(["", "", ""]);
      inputRefs.current[0]?.focus();
      // Restart countdown
      setCanResend(false)
      setcountDown(60)
    },
    onError: (error: Error) => {
      console.log("Resend OTP error: ", error.message);
      toast.error("Failed to Resend OTP", {
        description: error.message,
      });
    }
  });

  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) return; // chỉ 1 ký tự mỗi ô

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Nếu xoá => focus lùi
    if (value === "") {
      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
      return;
    }

    // Nếu nhập => focus sang phải
    if (index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Khi nhập đủ 4 số => tự động kiểm tra
    const otpCode = newOtp.join("");
    if (otpCode.length === 4) {
      handleVerifyOtp(otpCode);
    }
  };

  const handleVerifyOtp = (code?: string) => {
    const otpCode = code || otp.join("");
    if (otpCode.length !== 4) {
      toast.error("Invalid OTP", { description: "Please enter complete 4-digit" })
      return;
    }
    if (!name || !email || !password) {
      toast.error("Missing Information", {
        description: "Requaired signup data is miss"
      })
      return;
    }
    // Trigger the verification mutation with all signup data
    verifyOTPMutation.mutate({
      otp: otpCode,
      email: email,
      name: name,
      password: password
    })
  }

  const handleResendOTP = () => {
    if (!canResend || resendOTPMutation.isPending) return;
    if (!email) {
      toast.error("Missing Email", {
        description: "Email address is required to resend OTP.",
      });
      return;
    }
    resendOTPMutation.mutate({
      email: email as string,
      name: name as string,
      password: password as string,
    })
  }

  const handleGoBack = () => {
    router.back();
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  // Format countdown time as MM:SS

  const isOTPComplete = otp.every((digit) => digit !== "");
  const isVerifying = verifyOTPMutation.isPending;
  const isResending = resendOTPMutation.isPending;
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(1, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >

        {/* Header with Back Button */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}
            disabled={isVerifying}
            onPress={handleGoBack}
          >
            <Ionicons name="arrow-back" size={24} color={'#1F2937'} />
          </TouchableOpacity>
          <Text style={styles.headerText}>Verify OTP</Text>
        </View>
        {/* Các thành phần khác cho màn hình OTP của bạn có thể đặt ở đây */}

        <View style={{ flex: 1, paddingHorizontal: 24 }}>
          <View style={{ alignItems: 'center', marginBottom: 32 }}>
            <View style={styles.iconContainer}>
              <Ionicons name='shield-checkmark' size={40} color={"#2563EB"} />
            </View>
            <Text className="text-xl font-poppins-bold text-gray-900 mb-2 text-center">
              Hi {name || "Robot"}! Verify your account</Text>
            <Text className='text-gray-500 font-poppins text-base text-center'>
              We've sent a 4-digit Verification code to {name || "robot"}</Text>
          </View>
          {/* OTP input fields  */}
          <View style={{
            flexDirection: 'row', justifyContent: 'center',
            marginBottom: 32, gap: 16,
          }}>
            {otp.map((digit, index) => (
              <View key={index}
                style={{ width: 64, height: 64 }}
              >
                <TextInput
                  ref={(ref: TextInput | null): void => {
                    inputRefs.current[index] = ref;
                  }}
                  style={{
                    width: '100%', height: '100%', textAlign: 'center',
                    fontSize: 24, fontFamily: 'Poppins-Bold', borderWidth: 2, borderRadius: 12,
                    borderColor: digit ? App_color.borderColor : App_color.borderLight,
                    backgroundColor: digit ? App_color.backgroundActive : App_color.backgroundLight,
                  }}
                  value={digit}
                  onChangeText={(value) => handleOtpChange(value, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  selectTextOnFocus
                />
              </View>
            ))}
          </View>
          {/* Verify Button */}
          <TouchableOpacity
            style={[styles.button, isOTPComplete && !isVerifying && styles.buttonDisabled]}
            onPress={() => handleVerifyOtp()}
            disabled={!isOTPComplete || isVerifying}
          >
            <Text style={styles.text}
            >{isVerifying ? "Verifying..." : "Verify OTP"}
            </Text>
          </TouchableOpacity>
          {/* resend OTP */}
          <View style={{ flexDirection: "row", justifyContent: "center", }}>
            <ShareAuthSwitch
              titleFirst="Didn't recent the code? "
              titleSecon={canResend ? "Resend now" : `Resend in ${formatTime(countDown)}`}
              disabled={isResending}
              onPress={handleResendOTP}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: App_color.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 24,
    marginBottom: 24,
  },
  backButton: {
    marginRight: 8,
    padding: 4,
    borderRadius: 9999,
    backgroundColor: App_color.background,
  },
  headerText: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: App_color.textPrimary,
  },

  iconContainer: {
    width: 80,
    height: 80,
    backgroundColor: App_color.blueLight,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    flexDirection: 'row',
  },
  button: {
    backgroundColor: App_color.blueBox,
    paddingVertical: 12,
    marginBottom: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: App_color.grayBox,
  },
  text: {
    color: App_color.whitePrimary,
    fontSize: 18,
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
  },
});


export default SignUpOtp