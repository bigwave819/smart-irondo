import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    try {
      setLoading(true);

      // Clear AsyncStorage
      await AsyncStorage.multiRemove(["userToken", "user"]);

      // Clear react-query cache
      queryClient.clear();

      // Navigate to auth screen
      router.replace('/(auth)');
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white justify-center px-5">
      {/* Header */}
      <View className="mb-10">
        <Text className="text-3xl font-bold text-center text-slate-900">
          Profile
        </Text>
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        className={`rounded-full w-full py-4 ${loading ? 'bg-red-300' : 'bg-red-500'}`}
        onPress={handleLogout}
        disabled={loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Text className="text-center text-xl font-bold text-white">
            Logout
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default Profile;
