import { View, Text, TouchableOpacity, FlatList } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import useReport from '@/hooks/useReport'

const Report = () => {

  const router = useRouter()
  const { reports, isError, isLoading } = useReport()

  if (isError) {
    return (
      <View className="flex-1 justify-center items-center px-6 bg-white">
        <Ionicons name="alert-circle-outline" size={64} color="#ef4444" />
        <Text className="text-gray-800 font-bold text-lg mt-4">
          Failed to load reports
        </Text>

        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-6 bg-gray-100 px-8 py-3 rounded-full"
        >
          <Text className="text-gray-700 font-semibold">
            Go Back
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  const Header = () => {
    return (
      <View className="mb-4">
        {/* HEADER */}
        <View className="flex-row items-center pt-5 mb-3">
          <TouchableOpacity
            onPress={() => router.back()}
            className="rounded-full p-3 bg-blue-100"
          >
            <Ionicons name="arrow-back" size={22} color="#3b82f6" />
          </TouchableOpacity>

          <Text className="text-2xl ml-5 font-bold text-gray-800">
            Reports
          </Text>
        </View>

        {/* SUB TEXT */}
        <Text className="text-gray-500 text-base">
          Recent Reports
        </Text>
      </View>
    )
  }

  return (
    <View className="flex-1 bg-white px-5">

      <FlatList
        data={reports}
        contentContainerStyle={{ paddingBottom: 40 }}
        ListHeaderComponent={Header}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          return (
            <View className="flex-row items-center p-4 border border-gray-100 rounded-2xl mb-4 bg-white shadow-sm">

              {/* ICON */}
              <View className="bg-blue-50 p-3 rounded-full mr-4">
                <Ionicons
                  name="document-text-outline"
                  color="#3b82f6"
                  size={24}
                />
              </View>

              {/* TEXT */}
              <View className="flex-1">
                <Text
                  className="font-semibold text-gray-800 text-base"
                  numberOfLines={1}
                >
                  {item.title}
                </Text>

                <Text className="text-gray-500 text-sm mt-1">
                  {item.reportType} • {item.status}
                </Text>
              </View>

              {/* ACTION */}
              <TouchableOpacity className="p-3 bg-blue-50 rounded-full">
                <Ionicons
                  name="download-outline"
                  size={20}
                  color="#3b82f6"
                />
              </TouchableOpacity>

            </View>
          )
        }}
      />
    </View>
  )
}

export default Report
