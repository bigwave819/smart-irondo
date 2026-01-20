import { View, Text, TouchableOpacity, ActivityIndicator, Image, FlatList } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useNotifications } from '@/hooks/useNotifications'

const NotificationScreen = () => {
  const router = useRouter()
  const { notifications, isError, isLoading } = useNotifications()

  /** Empty State */
  const Empty = () => {
    return (
      <View className="flex-1 items-center justify-center mt-16">
        {isLoading ? (
          <ActivityIndicator size="large" color="#1e3a8a" />
        ) : (
          <View className="items-center">
            <Image
              source={require('@/assets/images/notification.png')}
              style={{ width: 150, height: 150, resizeMode: 'contain', marginBottom: 20 }}
            />
            <Text className='text-2xl font-bold text-gray-800 mb-2'>No notifications yet</Text>
            <Text className='text-center text-gray-400 px-6'>
              You have no notifications right now. Come back later.
            </Text>
          </View>
        )}
      </View>
    )
  }

  /** Header */
  const Header = () => {
    return (
      <View className='px-4 pt-8 pb-4 bg-slate-50 shadow-sm'>
        <View className='flex-row items-center justify-between mb-4'>
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => router.back()}
              className='rounded-full p-3 bg-white items-center justify-center mr-4 border border-slate-200 shadow'
            >
              <Ionicons name='arrow-back' size={20} color="#1e3a8a" />
            </TouchableOpacity>
            <View>
              <Text className='text-2xl font-black text-slate-900'>Evidence Log</Text>
              <Text className='text-slate-400 text-xs font-medium uppercase tracking-widest'>Case Files</Text>
            </View>
          </View>
        </View>
      </View>
    )
  }

  /** Notification Card */
  const renderItem = ({ item }: any) => (
    <View className="bg-white rounded-xl shadow-md px-4 py-3 mb-3 mx-4 flex-row items-start">
      <View className="mr-3 mt-1">
        <Ionicons name="notifications-outline" size={24} color="#1e3a8a" />
      </View>
      <View className="flex-1">
        <Text className='text-lg font-semibold text-gray-900'>{item.title}</Text>
        <Text className='text-gray-500 mt-1'>{item.message}</Text>
        <Text className='text-xs text-gray-400 mt-1'>
          {new Date(item.createdAt).toLocaleString()}
        </Text>
      </View>
    </View>
  )

  return (
    <View className='flex-1 bg-slate-50'>
      <FlatList
        data={notifications}
        ListEmptyComponent={Empty}
        ListHeaderComponent={Header}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  )
}

export default NotificationScreen
