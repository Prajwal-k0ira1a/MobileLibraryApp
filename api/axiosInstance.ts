import axios, { AxiosError, AxiosResponse } from "axios";
import { API_BASE_URL, API_TIMEOUT } from "../utils/constants";
import { clearAuthToken, getAuthToken } from "../utils/token";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: API_TIMEOUT, // Use environment timeout
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const token = await getAuthToken();
      if (token) {
        config.headers = config.headers ?? {};
        (config.headers as any).Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Failed to get auth token for request:", error);
    }
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors and network issues
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config;

    // Handle authentication errors
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.warn("Authentication error, clearing token");
      try {
        await clearAuthToken();
        // You could trigger a logout here if you have access to the auth context
      } catch (clearError) {
        console.error("Failed to clear auth token:", clearError);
      }

      // Return a more user-friendly error
      return Promise.reject(new Error("Session expired. Please login again."));
    }

    // Handle network errors
    if (!error.response) {
      return Promise.reject(
        new Error("Network error. Please check your connection.")
      );
    }

    // Handle server errors
    if (error.response.status >= 500) {
      return Promise.reject(new Error("Server error. Please try again later."));
    }

    // Handle rate limiting
    if (error.response.status === 429) {
      return Promise.reject(
        new Error("Too many requests. Please wait a moment.")
      );
    }

    // Handle other HTTP errors
    const errorMessage =
      (error.response.data as any)?.message ||
      error.message ||
      "An error occurred";
    return Promise.reject(new Error(errorMessage));
  }
);

export default axiosInstance;
