import http from "./http";

export const loginUser = (data) => http.post("/auth/login", data);

export const registerUser = (data) => http.post("/auth/register", data);

export const socialLoginUser = (data) => http.post("/auth/social", data);
export const verifyOTP = (data) => http.post("/auth/verify", data);
export const resendOTP = (data) => http.post("/auth/resend-otp", data);
export const forgotPassword = (data) => http.post("/auth/forgot-password", data);
export const resetPassword = (data) => http.post("/auth/reset-password", data);

