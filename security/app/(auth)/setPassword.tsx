import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const BACKEND_URL = 'http://10.129.20.154:3000/api/user/activate';

const passwordSchema = z
  .object({
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Confirm Password must be at least 6 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type PasswordForm = z.infer<typeof passwordSchema>;

// =========================
// API Call Logic
// =========================
const setPasswordApi = async (data: PasswordForm & { phone: string | null }) => {
  console.log(`🚀 Sending request to: ${BACKEND_URL}`);
  console.log(`📦 Payload:`, { phone: data.phone, password: data.password });

  const res = await axios.post(BACKEND_URL, {
    phone: data.phone,
    password: data.password,
  });
  return res.data;
};

const SetPassword = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: setPasswordApi,
    onSuccess: async () => {
      Alert.alert('Success', 'Password updated successfully!', [
        { text: 'Login', onPress: () => router.push('/(auth)/Login') }
      ]);
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || 'Failed to set password';
      Alert.alert('Error', msg);
    },
  });

  const onSubmit = async (data: PasswordForm) => {
    // Correct way to get phone: Inside the submission flow
    const phone = await AsyncStorage.getItem('userPhone');
    
    if (!phone) {
      Alert.alert('Error', 'Session expired. Please start the verification again.');
      router.replace('/(auth)');
      return;
    }

    mutate({ ...data, phone });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 justify-center px-5 bg-white"
    >
      <View className="items-center mb-10">
        <View className="bg-indigo-100 p-4 rounded-full mb-4">
          <Ionicons name="shield-checkmark" size={40} color="#4f46e5" />
        </View>
        <Text className="text-3xl font-bold text-gray-900 text-center">
          Secure Account
        </Text>
        <Text className="text-gray-500 text-center mt-2">
          Set a password for your phone number
        </Text>
      </View>

      {/* Password Input */}
      <Controller
        control={control}
        name="password"
        render={({ field: { value, onChange } }) => (
          <View className="mb-5">
            <View className="relative">
              <Ionicons
                name="lock-closed"
                size={20}
                color="#6b7280"
                className="absolute left-4 top-4 z-10"
              />
              <TextInput
                placeholder="Enter your password"
                secureTextEntry={!showPassword}
                value={value}
                onChangeText={onChange}
                editable={!isPending}
                placeholderTextColor="#9ca3af"
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 pl-12 pr-12 text-lg text-gray-900"
              />
              <TouchableOpacity
                className="absolute right-4 top-4 z-10"
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={22}
                  color="#6b7280"
                />
              </TouchableOpacity>
            </View>
            {errors.password && (
              <Text className="text-red-500 mt-1 ml-2">{errors.password.message}</Text>
            )}
          </View>
        )}
      />

      {/* Confirm Password Input */}
      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { value, onChange } }) => (
          <View className="mb-5">
            <View className="relative">
              <Ionicons
                name="lock-closed"
                size={20}
                color="#6b7280"
                className="absolute left-4 top-4 z-10"
              />
              <TextInput
                placeholder="Confirm password"
                secureTextEntry={!showPassword}
                value={value}
                onChangeText={onChange}
                editable={!isPending}
                placeholderTextColor="#9ca3af"
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 pl-12 pr-12 text-lg text-gray-900"
              />
            </View>
            {errors.confirmPassword && (
              <Text className="text-red-500 mt-1 ml-2">{errors.confirmPassword.message}</Text>
            )}
          </View>
        )}
      />

      {/* Submit Button */}
      <View className="mt-6">
        <TouchableOpacity
          className={`py-4 rounded-full items-center justify-center shadow-lg ${
            isPending ? 'bg-blue-300' : 'bg-blue-500 shadow-indigo-200'
          }`}
          onPress={handleSubmit(onSubmit)}
          disabled={isPending}
        >
          {isPending ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text className="text-white font-bold text-lg">
              Set Password
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default SetPassword;