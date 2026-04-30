import axios from "axios";

const backendUrl = (import.meta.env.VITE_BACKEND_URL || "").trim().replace(/\/$/, "");

if (!backendUrl && import.meta.env.PROD) {
  console.error("VITE_BACKEND_URL is missing in production. API calls will fail.");
}

const api = axios.create({
  baseURL: backendUrl || "http://localhost:3000",
  withCredentials: true,
});

export default api;
