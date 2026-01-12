import {
  View,
  Text,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import useReport from '@/hooks/useReport'
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Props {
  isVisble: boolean;
  onClose: () => void;
}

const AddReportModal = ({ isVisble, onClose }: Props) => {
  const [reportType, setReportType] = useState("Routine Patrol");
  const [incidentType, setIncidentType] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const { createReport, isCreating } = useReport()

  const handleSubmit = async () => {
    try {
      console.log("➡ Submitting report...");

    const userData = await AsyncStorage.getItem("user");

    if (!userData) {
      console.warn("⚠ No user found in AsyncStorage");
      return;
    }

    const user = JSON.parse(userData);
    console.log("👤 Logged in user:", user);



    const payload = {
      reportType,
      incidentType,
      title,
      description,
      location: user.location,
      reportDate: new Date(),
    };

    createReport(payload, {
      onSuccess: (res) => {
        console.log("✅ Report created successfully:", res);
        onClose();
      },
      onError: (err) => {
        console.error("❌ Error creating report:", err);
      },
    });

    console.log(payload); // replace with API call
    onClose();
    } catch (error) {
      console.log(`error due to ${error}`);      
      onClose();
    }
  };

  return (
    <Modal visible={isVisble} animationType="slide" transparent>
      <Pressable
        className="flex-1 bg-black/50 justify-end"
        onPress={onClose}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <Pressable className="bg-white rounded-t-[40px] p-8 pb-12">
            {/* HEADER */}
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-2xl font-bold">New Report</Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons
                  name="close-circle"
                  size={30}
                  color="#cbd5e1"
                />
              </TouchableOpacity>
            </View>

            {/* REPORT TYPE */}
            <Text className="text-slate-500 mb-2 font-semibold">
              Report Type
            </Text>
            <View className="bg-gray-100 rounded-full mb-4 px-3">
              <Picker
                selectedValue={reportType}
                onValueChange={setReportType}
              >
                <Picker.Item
                  label="Routine Patrol"
                  value="Routine Patrol"
                />
                <Picker.Item label="Crime" value="Crime" />
                <Picker.Item label="Emergency" value="Emergency" />
              </Picker>
            </View>

            {/* INCIDENT TYPE */}
            {(reportType === "Crime" ||
              reportType === "Emergency") && (
                <>
                  <Text className="text-slate-500 mb-2 font-semibold">
                    Incident Type
                  </Text>
                  <View className="bg-gray-100 rounded-full mb-4 px-3">
                    <Picker
                      selectedValue={incidentType}
                      onValueChange={setIncidentType}
                    >
                      <Picker.Item
                        label="Select incident"
                        value=""
                      />
                      <Picker.Item label="Theft" value="Theft" />
                      <Picker.Item
                        label="Violence"
                        value="Violence"
                      />
                      <Picker.Item
                        label="Suspicious Activity"
                        value="Suspicious"
                      />
                      <Picker.Item
                        label="Property Damage"
                        value="Damage"
                      />
                    </Picker>
                  </View>
                </>
              )}

            {/* TITLE */}
            <Text className="text-slate-500 mb-2 font-semibold">
              Title
            </Text>
            <TextInput
              placeholder="Short report title"
              value={title}
              onChangeText={setTitle}
              className="w-full rounded-full py-4 px-5 bg-gray-100 mb-4"
            />

            {/* DESCRIPTION */}
            <Text className="text-slate-500 mb-2 font-semibold">
              Description
            </Text>
            <TextInput
              placeholder="Explain what happened..."
              value={description}
              onChangeText={setDescription}
              multiline
              className="w-full rounded-2xl py-4 px-5 bg-gray-100 h-28"
            />

            {/* BUTTON */}
            <TouchableOpacity
              onPress={handleSubmit}
              className="bg-blue-600 w-full py-4 rounded-full items-center mt-6"
              disabled={isCreating}
            >
              {isCreating ? (
                <ActivityIndicator size={20} color="gray" />
              ) : (
                <Text className="text-white font-bold text-lg">
                  Submit Report
                </Text>
              )}
            </TouchableOpacity>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
};

export default AddReportModal;
