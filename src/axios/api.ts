// src/axios/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: "https://dummyjson.com",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log("API Request:", {
      method: config.method,
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      data: config.data,
    });
    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log("API Response:", {
      status: response.status,
      url: response.config.url,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error("API Error:", {
      status: error.response?.status,
      message: error.message,
      url: error.config?.url,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);

export default api;
