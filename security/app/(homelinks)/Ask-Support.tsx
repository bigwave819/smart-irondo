import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const AskSupport = () => {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const BACKEND_URL = `${process.env.EXPO_PUBLIC_API_URL}/send`

  const handleSend = async () => {
    if (!title || !message) {
      return Alert.alert(
        'Missing fields',
        'Please fill all fields'
      );
    }

    try {
      setLoading(true);

      // 🔥 CALL YOUR API HERE
      await fetch(`${BACKEND_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message,
          type: 'support'
        })
      });

      Alert.alert(
        'Success',
        'Your message was sent to support'
      );

      setTitle('');
      setMessage('');
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to send message'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white px-5 pt-12">

      {/* HEADER */}
      <View className="flex-row items-center mb-8">
        <TouchableOpacity
          onPress={() => router.back()}
          className="mr-4 p-2 bg-slate-100 rounded-full"
        >
          <Ionicons name="arrow-back" size={22} color="#1e3a8a" />
        </TouchableOpacity>

        <Text className="text-2xl font-black text-slate-900">
          Ask Support
        </Text>
      </View>

      {/* FORM */}
      <View className="space-y-5">
        {/* MESSAGE */}
        <View>
          <Text className="text-slate-500 mb-2">Message</Text>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Describe your issue..."
            multiline
            numberOfLines={6}
            className="border border-slate-200 rounded-xl p-4 h-36"
            textAlignVertical="top"
          />
        </View>

        {/* SEND BUTTON */}
        <TouchableOpacity
          onPress={handleSend}
          disabled={loading}
          className="bg-blue-600 py-4 rounded-xl items-center mt-4"
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-lg">
              Send to Support
            </Text>
          )}
        </TouchableOpacity>

      </View>
    </View>
  );
};

export default AskSupport;
