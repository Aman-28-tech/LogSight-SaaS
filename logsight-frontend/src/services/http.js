import axios from "axios";

import { API_BASE_URL } from "../config/env";

const http = axios.create({
  baseURL: API_BASE_URL,
});

http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

http.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API ERROR:", error.response?.data || error.message);

    // If 401 Unauthorized occurs on an API route (not during login/auth), log the user out
    if (error.response?.status === 401 && !error.config.url.includes("/auth/")) {
      localStorage.removeItem("token");
      window.location.reload();
    }

    return Promise.reject(error);
  }
);

export default http;

