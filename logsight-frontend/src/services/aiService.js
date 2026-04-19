import http from "./http";

export const getAIInsights = (logs) => http.post("/ai", { logs });
