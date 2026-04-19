import http from "./http";

export const getLogs = () => http.get("/logs");

export const createLog = (data) => http.post("/logs", data);

