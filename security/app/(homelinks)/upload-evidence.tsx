import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import EvidenceModal from '@/components/EvidenceModal';
import { useEvidence } from '@/hooks/useEvidence';

interface EvidenceFormData {
  reportId: string;
  url: string;
}

const UploadEvidence = () => {
  const router = useRouter();
  const [showEvidenceForm, setShowEvidenceForm] = useState(false);
  const [evidenceForm, setEvidenceForm] = useState<EvidenceFormData>({
    reportId: '',
    url: ''
  });

  const { evidences, isError, isLoading } = useEvidence();

  if (isError) {
    return (
      <View className="flex-1 justify-center items-center bg-white p-6">
        <Ionicons name="alert-circle" size={48} color="#ef4444" />
        <Text className="text-red-500 font-bold text-lg mt-2">Connection Error</Text>
        <Text className="text-gray-500 text-center mt-1">{isError}</Text>
      </View>
    );
  }

  const ListEmptyComponent = () => (
    <View className="flex-1 items-center justify-center py-20">
      {isLoading ? (
        <ActivityIndicator size="large" color="#3b82f6" />
      ) : (
        <View className="items-center">
          <View className="bg-slate-50 p-6 rounded-full mb-4">
            <Ionicons name='cloud-upload-outline' size={40} color="#94a3b8" />
          </View>
          <Text className="text-slate-800 font-bold text-xl">No Evidence Found</Text>
          <Text className="text-slate-500 text-center px-10 mt-2">
            Records appear here once uploaded. Tap the blue button to start.
          </Text>
        </View>
      )}
    </View>
  );

  const Header = () => (
    <View className="bg-white pb-6">
      {/* HEADER NAVIGATION */}
      <View className='flex-row items-center justify-between mb-8'>
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className='rounded-full p-3 bg-slate-50 items-center justify-center mr-4 border border-slate-100'
          >
            <Ionicons name='arrow-back' size={20} color="#1e3a8a" />
          </TouchableOpacity>
          <View>
            <Text className='text-2xl font-black text-slate-900'>Evidence Log</Text>
            <Text className='text-slate-400 text-xs font-medium uppercase tracking-widest'>Case Files</Text>
          </View>
        </View>
      </View>

      {/* ACTION BAR */}
      <View className='flex-row justify-between items-center'>
        <View>
          <Text className="text-slate-800 text-lg font-bold">Recent Uploads</Text>
          <Text className="text-slate-400 text-sm">{evidences?.length || 0} items found</Text>
        </View>
        <TouchableOpacity
          onPress={() => setShowEvidenceForm(true)}
          activeOpacity={0.7}
          className='flex-row items-center px-5 py-3 rounded-full bg-blue-600 shadow-lg shadow-blue-300'
        >
          <Ionicons name='add' size={22} color="white" />
          <Text className='font-bold text-white ml-1'>Add New</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <View className="flex-1 px-5 pt-4">
        <FlatList
          data={evidences}
          ListEmptyComponent={ListEmptyComponent}
          ListHeaderComponent={Header}
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => (
            <View className='flex-row items-center p-4 border border-slate-100 rounded-full mb-4 bg-white shadow-sm shadow-slate-200'>
              {/* ICON BLOCK */}
              <View className="bg-blue-50 p-4 rounded-full mr-4">
                <Ionicons 
                  name={item.type === 'image' ? 'image-outline' : 'document-text-outline'} 
                  color={"#2563eb"} 
                  size={24} 
                />
              </View>
                
              {/* TEXT BLOCK */}
              <View className="flex-1">
                <Text className="text-slate-900 font-bold text-base capitalize">
                  {item.type || 'General File'}
                </Text>
                <Text className="text-slate-500 text-xs mt-0.5">
                  Uploaded by <Text className="text-blue-600 font-semibold">{item.userName || 'Unknown'}</Text>
                </Text>
              </View>

              {/* ACTION BUTTON */}
              <TouchableOpacity 
                activeOpacity={0.6}
                className='h-12 w-12 rounded-full bg-slate-50 border border-slate-100 flex justify-center items-center'
              >
                <Ionicons name='chevron-forward' size={20} color="#3b82f6" />
              </TouchableOpacity>
            </View>
          )}
        />
      </View>

      <EvidenceModal
        evidenceForm={evidenceForm}
        isVisible={showEvidenceForm}
        onClose={() => setShowEvidenceForm(false)}
        setEvidenceForm={setEvidenceForm}
      />
    </SafeAreaView>
  );
};

export default UploadEvidence;