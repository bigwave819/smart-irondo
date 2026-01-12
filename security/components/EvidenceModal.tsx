import { View, Text, Modal, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity, Pressable } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

interface EvidenceFormData {
    report: string;
    url: string;
}

interface EvidenceFormProps {
    evidenceForm: EvidenceFormData;
    isVisble: boolean;
    onClose: () => void;
    onSave: () => void;
    setEvidenceForm: React.Dispatch<React.SetStateAction<EvidenceFormData>>;
}

const EvidenceModal = ({
    evidenceForm,
    isVisble,
    onClose,
    onSave,
    setEvidenceForm
}: EvidenceFormProps) => {
  return (
    <Modal visible={isVisble} animationType='slide' transparent onRequestClose={onClose}>
        {/* Semi-transparent Backdrop */}
        <Pressable className="flex-1 bg-black/50 justify-end" onPress={onClose}>
            <KeyboardAvoidingView
                behavior={ Platform.OS === 'ios' ? 'padding' : 'height' }
            >
                {/* Prevent click inside from closing modal */}
                <Pressable className="bg-white rounded-t-[40px] p-8 pb-12">
                    <View className="flex-row justify-between items-center mb-6">
                        <Text className="text-2xl font-bold">New Evidence</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close-circle" size={30} color="#cbd5e1" />
                        </TouchableOpacity>
                    </View>

                    <View className='mb-6'>
                        <Text className="text-slate-500 mb-2 ml-1 font-semibold">Report Title</Text>
                        <TextInput 
                            placeholder='e.g. Crime Scene Photo'
                            value={evidenceForm.report}
                            onChangeText={(text) => setEvidenceForm({...evidenceForm, report: text})}
                            className='w-full rounded-full py-4 px-5 bg-gray-100'
                        />
                    </View>

                    <TouchableOpacity 
                        onPress={onSave}
                        className="bg-blue-600 w-full py-4 rounded-full items-center"
                    >
                        <Text className="text-white font-bold text-lg">Save Evidence</Text>
                    </TouchableOpacity>
                </Pressable>
            </KeyboardAvoidingView>
        </Pressable>
    </Modal>
  );
};

export default EvidenceModal;