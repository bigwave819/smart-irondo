import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AddReportModal from '@/components/AddReportModal';
import { Report } from '@/types';
import { Directory, File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ReportsGridProps {
  isLoading: boolean;
  isError: boolean;
  reports: Report[];
}

const GenerateReport = ({ isError, isLoading, reports }: ReportsGridProps) => {
  const router = useRouter();
  const [showReportForm, setShowReportForm] = useState(false);

  const handleCloseModal = () => setShowReportForm(false);

  const handleDownload = async (reportId: number, title: string) => {
    console.log('🚀 [STEP 1] Starting download process...');
    console.log('📋 Report ID:', reportId);
    console.log('📄 Report Title:', title);
    
    try {
      // Get the auth token
      console.log('🔐 [STEP 1.5] Retrieving auth token...');
      const token = await AsyncStorage.getItem('userToken');
      console.log('🔑 Token exists?', !!token);
      console.log('🔑 Token preview:', token ? `${token.substring(0, 20)}...` : 'No token');
      
      if (!token) {
        console.error('❌ No authentication token found!');
        Alert.alert('Authentication Error', 'Please log in again');
        return;
      }
      
      // Construct the download URL
      const downloadUrl = `${process.env.EXPO_PUBLIC_API_URL}/reports/${reportId}/download`;
      console.log('🌐 [STEP 2] Download URL constructed:', downloadUrl);
      console.log('🔑 API URL from env:', process.env.EXPO_PUBLIC_API_URL);
      
      // Create the destination directory only if it doesn't exist
      console.log('📁 [STEP 3] Creating destination directory...');
      console.log('📍 Paths.document:', Paths.document);
      
      const destination = new Directory(Paths.document, 'reports');
      console.log('📂 Destination path:', destination.uri);
      console.log('✅ Directory exists?', destination.exists);
      
      if (!destination.exists) {
        console.log('🔨 Creating directory...');
        destination.create();
        console.log('✅ Directory created successfully');
      } else {
        console.log('ℹ️ Directory already exists, skipping creation');
      }

      // Download the file with authentication headers
      console.log('⬇️ [STEP 4] Starting file download with auth...');
      console.log('📥 Downloading from URL:', downloadUrl);
      console.log('💾 Saving to directory:', destination.uri);
      console.log('🔐 Using Bearer token authentication');
      
      const downloadedFile = await File.downloadFileAsync(downloadUrl, destination, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      
      console.log('✅ [STEP 5] Download complete!');
      console.log('📄 Downloaded file URI:', downloadedFile.uri);
      console.log('✔️ File exists?', downloadedFile.exists);
      console.log('📊 File size:', downloadedFile.size);

      // Check if sharing is available
      console.log('🔍 [STEP 6] Checking if sharing is available...');
      const isAvailable = await Sharing.isAvailableAsync();
      console.log('📤 Sharing available?', isAvailable);
      
      if (isAvailable) {
        console.log('📨 [STEP 7] Opening share dialog...');
        await Sharing.shareAsync(downloadedFile.uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Save Report',
          UTI: 'com.adobe.pdf'
        });
        console.log('✅ Share dialog completed');
      } else {
        console.log('ℹ️ Sharing not available, showing alert instead');
        Alert.alert(
          "Download Complete",
          `Report saved successfully to: ${downloadedFile.uri}`
        );
      }

      console.log('🎉 [COMPLETE] Download process finished successfully!');

    } catch (error: any) {
      console.error("❌ [ERROR] Download failed!", error.message);
      console.error("🔴 Error type:", error?.constructor?.name);
      console.error("🔴 Error message:", error instanceof Error ? error.message : 'Unknown error');
      console.error("🔴 Full error object:", error);
      console.error("🔴 Error stack:", error instanceof Error ? error.stack : 'No stack trace');
      
      Alert.alert(
        "Download Failed", 
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    }
  };

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

            <TouchableOpacity
              className="p-4 bg-blue-50 rounded-full"
              onPress={() => handleDownload(item.id, item.title)}
            >
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