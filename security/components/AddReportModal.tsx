

import { View, Text, KeyboardAvoidingView, Platform, Modal, Pressable, TouchableOpacity, TextInput } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';


interface ReportFormProps {
    onClose: () => void;
    isVisble: boolean
}

const AddReportModal = ({
    onClose,
    isVisble
}: ReportFormProps) => {
    return (
        <Modal visible={isVisble} animationType='slide' transparent onRequestClose={onClose}>
            <Pressable className='bg-black/50 flex-1 justify-end'>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    <Pressable className='bg-white rounded-t-xl p-5 pb-12'>
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-2xl font-bold">New Evidence</Text>
                            <TouchableOpacity onPress={onClose}>
                                <Ionicons name="close-circle" size={30} color="#cbd5e1" />
                            </TouchableOpacity>
                        </View>
                        <View className='mb-5'>
                            <Text className='text-slate-500 mb-2 ml-2 font-semibold'>Title</Text>
                            <TextInput 
                                placeholder='Enter Title'
                                className='rounded-full bg-gray-100 px-5 py-4 font-medium text-lg'
                            />
                        </View>
                        <View className='mb-5'>
                            <Text className='text-slate-500 mb-2 ml-2 font-semibold'>Title</Text>
                            <TextInput 
                                placeholder='Enter Title'
                                className='rounded-full bg-gray-100 px-5 py-4 font-medium text-lg'
                            />
                        </View>
                        <TouchableOpacity
                            className='rounded-full bg-blue-500 py-5'
                        >
                            <Text className='text-white text-lg font-medium text-center'>Generate Report</Text>
                        </TouchableOpacity>
                    </Pressable>
                </KeyboardAvoidingView>
            </Pressable>
        </Modal>
    )
}

export default AddReportModal