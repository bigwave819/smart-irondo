


import React from 'react'
import { Tabs } from 'expo-router'
import { FontAwesome, Ionicons } from '@expo/vector-icons'
import Octicons from '@expo/vector-icons/Octicons'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

const RootLayout = () => {
  return (
    <Tabs 
      screenOptions={{ 
        headerShown: false,
        tabBarActiveTintColor: "#3b82f6",
        tabBarInactiveTintColor: '#B3B3B3',
      }}
    >
      <Tabs.Screen
        name='index'
        options={{ 
          title: 'Home',
          tabBarIcon: ({ color, size }) => <FontAwesome5 name="home" size={24} color={color} />
        }}
      />
      <Tabs.Screen
        name='notification'
        options={{ 
          title: 'Notification',
          tabBarIcon: ({ color, size }) => <Ionicons name="notifications" size={24} color={color} />
        }}
      />
      <Tabs.Screen
        name='report'
        options={{ 
          title: 'Reports',
          tabBarIcon: ({ color, size }) => <Octicons name="report" size={24} color={color} />
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{ 
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <FontAwesome name="user" size={24} color={color} />
        }}
      />
    </Tabs>
  )
}

export default RootLayout