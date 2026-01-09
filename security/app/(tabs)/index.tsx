import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');
// Increased card size by reducing horizontal margins
const CARD_WIDTH = (width - 48) / 2; 

interface User {
  location?: {
    village: string;
    cell: string;
    sector: string;
    district: string;
  };
}

const CardData = [
  {
    id: '1',
    name: 'Upload Evidence',
    icon: 'finger-print' as const,
    color: '#3b82f6', // Blue
  },
  {
    id: '2',
    name: 'Criminal Photo',
    icon: 'person-add' as const, // Represents adding/catching criminal
    color: '#ef4444', // Red
  },
  {
    id: '3',
    name: 'Generate Report',
    icon: 'document-attach' as const,
    color: '#10b981', // Emerald
  },
  {
    id: '4',
    name: 'Ask Support',
    icon: 'call' as const,
    color: '#8b5cf6', // Purple
  }
];

const Index = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const savedUser = await AsyncStorage.getItem('user');
        if (savedUser) setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Failed to load user", error);
      }
    };
    loadUser();
  }, []);

  return (
    <ScrollView className="flex-1 bg-slate-50 px-4 pt-14">
      {/* HEADER SECTION - Keeps Blur for top buttons */}
      <View className="flex-row items-center justify-between mb-10">
        <TouchableOpacity className="overflow-hidden rounded-full border border-white shadow-md">
          <BlurView intensity={60} className="p-4">
            <Ionicons name="location" size={22} color="#3b82f6" />
          </BlurView>
        </TouchableOpacity>

        <View className="flex-1 px-4">
          <Text className="text-xl font-black text-slate-900 leading-tight">
            {user?.location?.village || "Loading..."}
          </Text>
          <Text className="text-[10px] text-slate-400 font-bold uppercase tracking-widest" numberOfLines={1}>
            {user?.location ? `${user.location.district}, ${user.location.sector}` : "Locating..."}
          </Text>
        </View>

        <TouchableOpacity className="overflow-hidden rounded-full border border-white shadow-md">
          <BlurView intensity={60} className="p-4">
            <Ionicons name="notifications" size={22} color="#1e293b" />
          </BlurView>
        </TouchableOpacity>
      </View>

      {/* ACTION GRID - No Blur, Centered and Fully Rounded */}
      <View className="flex-row flex-wrap justify-between">
        {CardData.map((card) => (
          <TouchableOpacity 
            key={card.id} 
            style={{ width: CARD_WIDTH, height: CARD_WIDTH * 1.2 }}
            className="mb-6 rounded-[40px] border-2 border-white bg-white/80 shadow-xl shadow-slate-200 items-center justify-center p-6"
          >
            {/* The "Liquid" Icon Body */}
            <View 
              className="w-24 h-24 rounded-full items-center justify-center mb-5" 
              style={{ backgroundColor: `${card.color}15` }} // 15% opacity background
            >
              {/* Inner Circle with Icon */}
              <View 
                className="w-16 h-16 rounded-full items-center justify-center border-4 border-white shadow-sm"
                style={{ backgroundColor: card.color }}
              >
                <Ionicons name={card.icon} size={30} color="white" />
              </View>
            </View>
            
            <Text className="text-center text-sm font-black text-slate-800 uppercase tracking-tight">
              {card.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

export default Index;