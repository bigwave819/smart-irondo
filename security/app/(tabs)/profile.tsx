import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query'; // Import this

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient(); // Initialize the client

  const handleLogout = async () => {
    try {
      setLoading(true);

      await AsyncStorage.multiRemove(["userToken", "user"]);
      queryClient.clear();
      router.replace('/(auth)'); 
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className='bg-white flex-1 justify-center px-5'>
      <TouchableOpacity
        className={`rounded-full w-full py-4 ${loading ? 'bg-red-300' : 'bg-red-500'}`}
        onPress={handleLogout}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Text className='text-center text-xl font-bold text-white'>Logout</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default Profile;