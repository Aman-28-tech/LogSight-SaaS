import http from "./http";

export { loginUser, registerUser, socialLoginUser, verifyOTP, resendOTP, forgotPassword, resetPassword } from "./authService";
export { getLogs, createLog } from "./logService";
export { getAIInsights } from "./aiService";

export default http;
