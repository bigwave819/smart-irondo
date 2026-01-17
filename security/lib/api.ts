import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const BASE_URL = `${process.env.EXPO_PUBLIC_API_URL}`; 

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Use a request interceptor to inject the token automatically
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('userToken');

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// We export a simple hook to use it
export const useApi = () => api;