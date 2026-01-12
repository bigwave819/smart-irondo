import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as z from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { api } from '@/lib/api';

// ===================
// CONFIG & SCHEMA
// ===================
const BACKEND_URL = 'http://10.129.20.154:3000/api/user/login'; // Updated to /login

const loginSchema = z.object({
  phone: z
    .string()
    .min(10, 'Phone must be at least 10 digits')
    .regex(/^\d+$/, 'Phone must be numeric'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

// ===================
// API FUNCTION
// ===================
const loginUser = async (data: LoginFormData) => {
  // REQUIREMENT: Log the endpoint and data being sent
  console.log(`📡 Requesting: POST ${BACKEND_URL}`);
  console.log(`📤 Data Sent:`, data);

  const response = await api.post(BACKEND_URL, data);
  return response.data;
};

const Login = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { phone: '', password: '' },
  });

  // ===================
  // MUTATION
  // ===================
  const { mutate, isPending } = useMutation({
    mutationFn: loginUser,
    onSuccess: async (data) => {
      console.log('✅ Login Successful:', data);
      
      try {
        // Clear old tokens and save new user data
        await AsyncStorage.removeItem('userToken');
        const userValue = typeof data.user === 'object' ? JSON.stringify(data.user) : data.user;
        await AsyncStorage.setItem('user', userValue);
        await AsyncStorage.setItem('userToken', data.token);
        router.replace('/(tabs)'); 
      } catch (e) {
        console.error('💾 Storage Error:', e);
      }
    },
    onError: (error: any) => {
      // REQUIREMENT: Log the error
      const errorMsg = error.response?.data?.message || error.message || 'Login failed';
      console.error('❌ Login Error:', errorMsg);
      if (error.response) console.log('❌ Error Data:', error.response.data);

      Alert.alert('Login Failed', errorMsg);
    },
  });

  const onSubmit = (data: LoginFormData) => {
    mutate(data);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} className="px-5">
        
        <View className="items-center mb-10">
          <View className="bg-blue-100 p-4 rounded-full mb-4">
            <Ionicons name="person" size={40} color="#3b82f6" />
          </View>
          <Text className="text-3xl font-bold text-gray-900">Welcome Back</Text>
          <Text className="text-gray-500 mt-2">Log in to your account</Text>
        </View>

        {/* PHONE INPUT */}
        <Controller
          control={control}
          name="phone"
          render={({ field: { onChange, value } }) => (
            <View className="mb-4">
              <View className="relative">
                <View className="absolute left-4 top-4 z-10">
                  <Ionicons name="call-outline" size={20} color="#6b7280" />
                </View>
                <TextInput
                  placeholder="Phone number"
                  value={value}
                  onChangeText={onChange}
                  keyboardType="phone-pad"
                  editable={!isPending}
                  placeholderTextColor="#9ca3af"
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-lg text-gray-900"
                />
              </View>
              {errors.phone && <Text className="text-red-500 mt-1 ml-2">{errors.phone.message}</Text>}
            </View>
          )}
        />

        {/* PASSWORD INPUT */}
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <View className="mb-4">
              <View className="relative">
                <View className="absolute left-4 top-4 z-10">
                  <Ionicons name="lock-closed-outline" size={20} color="#6b7280" />
                </View>
                <TextInput
                  placeholder="Password"
                  value={value}
                  onChangeText={onChange}
                  secureTextEntry={!showPassword}
                  editable={!isPending}
                  placeholderTextColor="#9ca3af"
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 pl-12 pr-12 text-lg text-gray-900"
                />
                <TouchableOpacity
                  className="absolute right-4 top-4 z-10"
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={22}
                    color="#6b7280"
                  />
                </TouchableOpacity>
              </View>
              {errors.password && <Text className="text-red-500 mt-1 ml-2">{errors.password.message}</Text>}
            </View>
          )}
        />

        <TouchableOpacity className="mb-8 self-end">
          <Text className="font-semibold text-blue-600">Forgot Password?</Text>
        </TouchableOpacity>

        {/* Login Button */}
        <TouchableOpacity
          className={`rounded-2xl items-center py-4 shadow-lg ${
            isPending ? 'bg-blue-300' : 'bg-blue-500 shadow-blue-200'
          }`}
          onPress={handleSubmit(onSubmit)}
          disabled={isPending}
        >
          {isPending ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text className="text-lg text-white font-bold">Sign In</Text>
          )}
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;