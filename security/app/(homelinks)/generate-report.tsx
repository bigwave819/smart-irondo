

import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import AddReportModal from '@/components/AddReportModal'

const GenerateReport = () => {
    const router = useRouter();
    const [ showReportForm, setShowReportForm ] = useState(false);


    const handleCloseModal = () => {
      setShowReportForm(false)
    }
  return (
    <View className='flex-1 bg-white px-5 pt-10'>
      {/** HEADER */}
      <View className='flex-row items-center mb-5'>
        <TouchableOpacity
            className='p-3 flex justify-center items-start rounded-full bg-blue-50 mr-7'
            onPress={() => router.back()}
        >
            <Ionicons name='arrow-back' size={20} color="#3b82f6" />
        </TouchableOpacity>
        <Text className='font-medium text-xl'>Generate Report</Text>
      </View>

      {/** Show the report view all text and add the report modal */}
      <View className='flex-row items-center justify-between'>
        <Text className='text-gray-400 text-xl font-medium'>View All Reports</Text>
        <TouchableOpacity
          className='rounded-full px-4 py-2 bg-blue-500'
          onPress={() => setShowReportForm(true)}
        >
          <Text className='text-white font-medium'>Generate Report</Text>
        </TouchableOpacity>
      </View>

      {/** THE FORM MODAL */}
      <AddReportModal 
        onClose={handleCloseModal}
        isVisble={showReportForm}
      />
    </View>
  )
}

export default GenerateReport