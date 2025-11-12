import axios from "axios";

console.log("API URL being used:", import.meta.env.VITE_API_URL);


// استخدام localhost للتطوير المحلي
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
console.log("🌐 API Base URL:", API_BASE_URL);

const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

// request interceptor to attach token if present
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
