import axios from "axios";

// Shared API configuration
export const API_BASE_URL =
  (import.meta as any).env?.VITE_API_URL ?? ""; // dùng relative URL để qua Vite proxy khi dev

// Create a shared axios instance
export const createApiClient = (timeout = 15000) => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    headers: { "Content-Type": "application/json" },
    timeout,
    withCredentials: false,
  });

  // Attach Bearer token from localStorage
  instance.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      (config.headers as any).Authorization = `Bearer ${accessToken}`;
    }
    return config;
  });

  return instance;
};

// Default API client
export const apiClient = createApiClient();

// Response interceptor for consistent error handling
apiClient.interceptors.response.use(
  (response) => response?.data?.data || response?.data,
  (error) => {
    const message = error?.response?.data?.message || error.message;
    return Promise.reject(new Error(message));
  }
);
