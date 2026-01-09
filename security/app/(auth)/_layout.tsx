import React, { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '@/lib/api';
import axios from 'axios';

const BACKEND_URL = 'http://10.13.80.154:3000/api/user';

const RootLayout = () => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [userIsActive, setUserIsActive] = useState(false);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        // 1. Check if we already have a session token
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          setAuthenticated(true);
          setLoading(false);
          return;
        }

        // 2. Check if we have a stored phone to verify status
        const phone = await AsyncStorage.getItem('userPhone');
        if (phone) {
          // IMPORTANT: Changed from .post to .get to match your backend
          console.log(`🔍 Checking status for: ${phone}`);
          const res = await axios.get(`${BACKEND_URL}/check/${phone}`); 
          console.log(`the url is ${BACKEND_URL}/check/${phone}`);
          
          
          // Your backend returns { isActive: boolean }
          setUserIsActive(res.data.isActive);
        } else {
          setUserIsActive(false);
        }
      } catch (error: any) {
        console.log('❌ Error fetching user status:', error?.response?.data || error.message);
        setUserIsActive(false);
      } finally {
        setLoading(false);
      }
    };

    checkUserStatus();
  }, []);

  // Handle Redirection based on state
  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (authenticated) {
      router.replace('/(tabs)');
    } else if (userIsActive) {
      router.replace('/(auth)/Login');
    } else {
      // New or inactive users go to the landing/OTP start page
      router.replace('/');
    }
  }, [authenticated, userIsActive, loading]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#1D4ED8" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="Login" />
      <Stack.Screen name="setPassword" />
      <Stack.Screen name="/(tabs)" />
    </Stack>
  );
};

export default RootLayout;