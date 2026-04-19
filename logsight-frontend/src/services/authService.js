import http from "./http";

export const loginUser = (data) => http.post("/auth/login", data);

export const registerUser = (data) => http.post("/auth/register", data);

export const socialLoginUser = (data) => http.post("/auth/social", data);

