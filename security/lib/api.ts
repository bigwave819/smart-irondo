import axios from "axios";

// Replace with your actual local IP (e.g., 192.168.1.5)
const BASE_URL = "http://10.62.96.154:3000/api/user"; 

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});