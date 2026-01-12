import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useRef, useState, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as z from 'zod';

const OTP_LENGTH = 6;
const BACKEND_URL = 'http://10.129.20.154:3000/api/user/verify-code';

const otpSchema = z.object({
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  activationCode: z.string().length(OTP_LENGTH, `Verification code must be ${OTP_LENGTH} digits`),
});

type OTPForm = z.infer<typeof otpSchema>;

const verifyOTP = async (data: OTPForm) => {
  // Requirement: Log the backend URL where the request is sent
  console.log(`🚀 Sending request to: ${BACKEND_URL}`);
  console.log(`📦 Payload:`, data);

  const res = await axios.post(BACKEND_URL, {
    phone: data.phone,
    activationCode: data.activationCode,
  });

  return res.data;
};

const OTPPage = () => {
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const inputs = useRef<Array<TextInput | null>>([]);
  
  const { 
    control, 
    handleSubmit, 
    setValue, // Added to sync manual OTP input with Zod
    trigger,  // Added to re-validate manually
    formState: { errors } 
  } = useForm<OTPForm>({
    resolver: zodResolver(otpSchema),
    defaultValues: { phone: '', activationCode: '' },
  });

  // Sync the [otp] array state with the React Hook Form state
  useEffect(() => {
    const combinedCode = otp.join('');
    setValue('activationCode', combinedCode);
    
    // If user finished typing, trigger validation immediately to clear errors
    if (combinedCode.length === OTP_LENGTH) {
      trigger('activationCode');
    }
  }, [otp, setValue, trigger]);

  const { mutate, isPending } = useMutation({
    mutationFn: verifyOTP,
    onSuccess: async (data) => {
      await AsyncStorage.setItem('userPhone', data.phone);
      Alert.alert('Success', 'OTP verified successfully!');
      router.push('/(auth)/setPassword');
    },
    onError: (error: any) => {
      const errorMsg = error.response?.data?.message || 'Failed to verify OTP';
      Alert.alert('Error', errorMsg);
    },
  });

  const handleOtpChange = (text: string, index: number) => {
    // Only allow numbers
    const cleanText = text.replace(/[^0-9]/g, '');
    if (!cleanText && text !== '') return;

    const newOtp = [...otp];
    newOtp[index] = cleanText.slice(-1); // Take only the last character
    setOtp(newOtp);

    // Auto-focus next input
    if (cleanText && index < OTP_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (index: number) => {
    if (otp[index] === '' && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = ''; // Optional: clear previous box on backspace
      setOtp(newOtp);
      inputs.current[index - 1]?.focus();
    }
  };

  const onSubmit = (formData: OTPForm) => {
    // Double check logic: isPending is already handled by the button's 'disabled' prop
    mutate(formData);
  };

  return (
    <ScrollView 
      contentContainerStyle={{ flexGrow: 1 }}
      className="bg-white"
      keyboardShouldPersistTaps="handled"
    >
      <View className="flex-1 justify-center items-center px-6 py-8">
        <View className="mb-12 items-center">
          <Text className="text-4xl font-bold text-gray-900 mb-3 text-center">Verify Your Account</Text>
          <Text className="text-base text-gray-600 text-center">We've sent a code to your phone</Text>
        </View>

        <Controller
          control={control}
          name="phone"
          render={({ field: { value, onChange } }) => (
            <View className="w-full mb-8">
              <Text className="text-sm font-semibold text-gray-800 mb-2">Phone Number</Text>
              <View className="relative">
                <View className="absolute left-4 top-4 z-10">
                  <Ionicons name="call" size={20} color="#6366f1" />
                </View>
                <TextInput
                  placeholder="Enter phone number"
                  value={value}
                  onChangeText={onChange}
                  keyboardType="phone-pad"
                  editable={!isPending}
                  className="w-full bg-gray-50 border-2 border-gray-200 rounded-lg py-4 pl-12 pr-4 text-base"
                />
              </View>
              {errors.phone && (
                <Text className="text-sm text-red-500 mt-1">{errors.phone.message}</Text>
              )}
            </View>
          )}
        />

        <View className="w-full mb-8">
          <Text className="text-sm font-semibold text-gray-800 mb-4">Verification Code</Text>
          <View className="flex-row justify-between">
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {inputs.current[index] = ref}}
                value={digit}
                keyboardType="number-pad"
                maxLength={1}
                onChangeText={(text) => handleOtpChange(text, index)}
                onKeyPress={({ nativeEvent }) => {
                  if (nativeEvent.key === 'Backspace') handleBackspace(index);
                }}
                editable={!isPending}
                className={`w-12 h-16 bg-gray-50 border-2 rounded-lg text-center text-xl font-bold ${
                  errors.activationCode ? 'border-red-300' : 'border-gray-300'
                } text-indigo-600`}
              />
            ))}
          </View>
          {errors.activationCode && (
            <Text className="text-sm text-red-500 mt-2 text-center">{errors.activationCode.message}</Text>
          )}
        </View>

        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          disabled={isPending}
          className={`w-full py-4 rounded-lg items-center justify-center ${
            isPending ? 'bg-indigo-300' : 'bg-indigo-600'
          }`}
        >
          {isPending ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text className="text-white font-bold text-base">Verify Code</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default OTPPage;