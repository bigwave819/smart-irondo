import {
  View,
  Text,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Pressable,
  Image,
  ActivityIndicator,
  Alert
} from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import useReport from '@/hooks/useReport';
import { useEvidence } from '@/hooks/useEvidence';

interface EvidenceFormData {
  url: string;        // this is the file URI
  reportId: string;
}

interface EvidenceFormProps {
  evidenceForm: EvidenceFormData;
  isVisible: boolean;
  onClose: () => void;
  setEvidenceForm: React.Dispatch<React.SetStateAction<EvidenceFormData>>;
}

const EvidenceModal = ({
  evidenceForm,
  isVisible,
  onClose,
  setEvidenceForm
}: EvidenceFormProps) => {
  const { reports } = useReport();
  const { createEvidence, isCreating } = useEvidence();

  // Pick an image from gallery
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      setEvidenceForm(prev => ({ ...prev, url: result.assets[0].uri }));
    }
  };

  const handleSave = () => {
    if (!evidenceForm.reportId || !evidenceForm.url) {
      Alert.alert("Missing Info", "Please select a report and pick an image.");
      return;
    }

    createEvidence(
      {
        reportId: Number(evidenceForm.reportId),
        fileUrl: evidenceForm.url, // pass the actual file URI
      },
      {
        onSuccess: () => {
          Alert.alert("Success", "Evidence uploaded successfully!");
          onClose();
          setEvidenceForm({ reportId: '', url: '' });
        },
        onError: () => {
          Alert.alert("Error", "Upload failed. Check your console.");
        }
      }
    );
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable className="flex-1 bg-black/50 justify-end" onPress={onClose}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <Pressable className="bg-white rounded-t-3xl px-6 pt-6 pb-10" onPress={(e) => e.stopPropagation()}>

            {/* Header */}
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold text-gray-800">New Evidence</Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close-circle" size={30} color="#94a3b8" />
              </TouchableOpacity>
            </View>

            {/* Report Picker */}
            <View className="mb-6 border border-gray-100 rounded-2xl bg-gray-50 overflow-hidden">
              <Text className="text-slate-500 mt-2 ml-4 font-semibold text-xs uppercase">Link to Report</Text>
              <Picker
                selectedValue={evidenceForm.reportId}
                onValueChange={(val) => setEvidenceForm(prev => ({ ...prev, reportId: val }))}
              >
                <Picker.Item label="Select a report..." value="" />
                {reports?.map((item) => (
                  <Picker.Item 
                    key={item.id} 
                    label={`${item.title} (${item.reportType})`} 
                    value={item.id.toString()} 
                  />
                ))}
              </Picker>
            </View>

            {/* Image Upload */}
            <View className="items-center mb-8">
              <TouchableOpacity
                onPress={pickImage}
                className="w-40 h-40 rounded-3xl bg-gray-100 justify-center items-center overflow-hidden border-2 border-dashed border-gray-300"
              >
                {evidenceForm.url ? (
                  <View className="w-full h-full relative">
                    <Image source={{ uri: evidenceForm.url }} className="w-full h-full" />
                    <View className="absolute inset-0 bg-black/20 justify-center items-center">
                      <Ionicons name="camera" size={30} color="white" />
                    </View>
                  </View>
                ) : (
                  <>
                    <Ionicons name="camera-outline" size={40} color="#94a3b8" />
                    <Text className="text-gray-400 text-xs mt-2">Tap to upload</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* Upload Button */}
            <TouchableOpacity
              onPress={handleSave}
              className={`${isCreating ? 'bg-blue-300' : 'bg-blue-600'} w-full py-4 rounded-2xl items-center shadow-lg`}
              disabled={isCreating}
            >
              {isCreating ? (
                <View className="flex-row items-center">
                  <ActivityIndicator size="small" color="white" />
                  <Text className="text-white font-bold ml-2">Uploading...</Text>
                </View>
              ) : (
                <Text className="text-white font-bold text-lg">Upload Evidence</Text>
              )}
            </TouchableOpacity>

          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
};

export default EvidenceModal;
