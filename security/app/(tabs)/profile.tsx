import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';

// Get Ionicons name type
type IoniconsName = keyof typeof Ionicons.glyphMap;

type User = {
  fullName: string;
  phone: string;
  role: string;
  location?: {
    cell: string;
  };
};

type Link = {
  id: number;
  name: string;
  icon: IoniconsName;
};

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Error loading user:", error);
      }
    };
    fetchUser();
  }, []);

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

  const Links: Link[] = [
    { id: 1, name: "Account", icon: "person-outline" },
    { id: 2, name: "Security", icon: "lock-closed-outline" },
    { id: 3, name: "Privacy & Policy", icon: "shield-checkmark-outline" },
    { id: 4, name: "Help & Support", icon: "help-circle-outline" },
    { id: 5, name: "Appearance", icon: "color-palette-outline" },
  ];

  if (!user) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white px-5 w-full">
      {/* Header */}
      <View className="mb-10">
        <Text className="text-3xl font-bold text-center">
          Profile
        </Text>
      </View>

      {/* User Info */}
      <View className="w-full bg-white rounded-3xl shadow-lg py-5 px-6">
        <View className="flex-row items-center mb-3">
          <Ionicons name="person-circle-outline" size={28} color="#3B82F6" className="mr-3" />
          <Text className="text-xl font-semibold">Names:</Text>
          <Text className="ml-2">{user.fullName}</Text>
        </View>
        <View className="flex-row items-center mb-3">
          <Ionicons name="call-outline" size={28} color="#3B82F6" className="mr-3" />
          <Text className="text-xl font-semibold">Phone:</Text>
          <Text className="ml-2">{user.phone}</Text>
        </View>
        <View className="flex-row items-center mb-3">
          <Ionicons name="ribbon-outline" size={28} color="#3B82F6" className="mr-3" />
          <Text className="text-xl font-semibold">Role:</Text>
          <Text className="ml-2">{user.role}</Text>
        </View>
        <View className="flex-row items-center mb-3">
          <Ionicons name="location-outline" size={28} color="#3B82F6" className="mr-3" />
          <Text className="text-xl font-semibold">Location:</Text>
          <Text className="ml-2">{user.location?.cell}</Text>
        </View>
      </View>

      {/* Links */}
      <View className="mt-10">
        {Links.map((link) => (
          <View key={link.id} className="flex-row items-center py-4 border-gray-200">
            <Ionicons name={link.icon} size={24} color="#3B82F6" className="mr-4" />
            <Text className="text-lg ">{link.name}</Text>
          </View>
        ))}
      </View>

      {/* Logout as link */}
      <View className="border-t border-gray-300 mt-7">
        <TouchableOpacity
          onPress={handleLogout}
          className="flex-row items-center py-4"
          disabled={loading}
        >
          <Ionicons name="log-out-outline" size={24} color="#EF4444" className="mr-4" />
          {loading ? (
            <ActivityIndicator color="#EF4444" />
          ) : (
            <Text className="text-lg text-red-600">Logout</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Profile;
