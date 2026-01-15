import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AddReportModal from '@/components/AddReportModal';
import { Report } from '@/types';

interface ReportsGridProps {
  isLoading: boolean;
  isError: boolean;
  reports: Report[];
}

const GenerateReport = ({ isError, isLoading, reports }: ReportsGridProps) => {
  const router = useRouter();
  const [showReportForm, setShowReportForm] = useState(false);

  const handleCloseModal = () => setShowReportForm(false);

  const Header = () => (
    <View className="bg-white pb-4">
      {/** HEADER NAVIGATION */}
      <View className='flex-row items-center mb-6'>
        <TouchableOpacity
          className='p-3 rounded-full bg-blue-50 mr-5'
          onPress={() => router.back()}
        >
          <Ionicons name='arrow-back' size={20} color="#3b82f6" />
        </TouchableOpacity>
        <Text className='font-bold text-2xl text-gray-800'>Generate Report</Text>
      </View>

      {/** ACTION BAR */}
      <View className='flex-row items-center justify-between'>
        <Text className='text-gray-400 text-lg font-medium'>Recent Reports</Text>
        <TouchableOpacity
          className='rounded-full px-5 py-2 bg-blue-500 shadow-sm'
          onPress={() => setShowReportForm(true)}
        >
          <Text className='text-white font-semibold'>+ New Report</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isError) {
    return (
      <View className="flex-1 justify-center items-center p-5 bg-white">
        <Ionicons name="alert-circle-outline" size={60} color="#ef4444" />
        <Text className="text-gray-800 font-bold text-lg mt-4">Failed to load reports</Text>
        <TouchableOpacity 
          onPress={() => router.back()}
          className="mt-4 bg-gray-100 px-6 py-2 rounded-full"
        >
          <Text className="text-gray-600">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className='flex-1 bg-white px-5 pt-10'>
      <FlatList
        data={reports}
        ListHeaderComponent={Header}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item }) => (
          <View className="flex-row items-center justify-center p-4 border border-gray-100 rounded-full mb-4 bg-white shadow-sm">
            <View className="bg-blue-50 p-3 rounded-full mr-4">
              <Ionicons name='document-text-outline' color={"#3b82f6"} size={24} />
            </View>
            
            <View className='flex-1'>
              <Text className="font-bold text-gray-800 text-base" numberOfLines={1}>
                {item.title}
              </Text>
              <Text className="text-gray-500 text-xs mt-1">
                {item.reportType} • {item.status}
              </Text>
              <Text className="text-gray-400 text-[10px] mt-1">
                {/* 📍 {item.location.sector}, {item.location.district} */}
              </Text>
            </View>

            <TouchableOpacity className="p-4 bg-blue-50 rounded-full">
               <Ionicons name="download-outline" size={20} color="#3b82f6" />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={() => (
          <View className="items-center justify-center mt-20">
            {isLoading ? (
              <ActivityIndicator size="large" color="#3b82f6" />
            ) : (
              <>
                <View className="bg-gray-50 p-6 rounded-full mb-4">
                  <Ionicons name="document-outline" size={40} color="#d1d5db" />
                </View>
                <Text className="text-gray-500 font-medium text-lg">No reports found</Text>
                <Text className="text-gray-400 text-center px-10 mt-2">
                  You haven't uploaded any reports yet. Tap "New Report" to begin.
                </Text>
              </>
            )}
          </View>
        )}
      />

      <AddReportModal 
        onClose={handleCloseModal}
        isVisble={showReportForm}
      />
    </View>
  );
};

export default GenerateReport;