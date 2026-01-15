import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import EvidenceModal from '@/components/EvidenceModal';

interface EvidenceFormData {
  reportId: string;
  url: string;
}

const UploadEvidence = () => {
  const router = useRouter();
  const [evidences, setEvidences] = useState<EvidenceFormData[]>([]);
  const [showEvidenceForm, setShowEvidenceForm] = useState(false);
  const [evidenceForm, setEvidenceForm] = useState<EvidenceFormData>({
    reportId: '',
    url: ''
  });



  return (
    <View className='flex-1 bg-white px-5 pt-12'>
      {/** HEADER */}
      <View className='flex-row items-center mb-8'>
        <TouchableOpacity
          onPress={() => router.back()}
          className='rounded-full p-3 bg-blue-50 items-center justify-center mr-4'
        >
          <Ionicons name='arrow-back' size={20} color="#1e3a8a" />
        </TouchableOpacity>
        <Text className='text-xl font-bold'>Upload Evidence</Text>
      </View>

      {/** THE MAIN CONTENT */}
      <View className='flex-row justify-between items-center mb-4'>
        <Text className="text-slate-500 text-lg font-semibold">View All Evidences</Text>
        <TouchableOpacity 
          onPress={() => setShowEvidenceForm(true)}
          className='px-5 py-2 rounded-full bg-blue-500'
        >
          <Text className='font-medium text-xl text-white'>+ Add Evidence</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1">
      </ScrollView>

      {/* MODAL COMPONENT */}
      <EvidenceModal 
        evidenceForm={evidenceForm}
        isVisible={showEvidenceForm}
        onClose={() => setShowEvidenceForm(false)}
        setEvidenceForm={setEvidenceForm}
      />
    </View>
  );
};

export default UploadEvidence;