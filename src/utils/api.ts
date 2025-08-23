import axios from "axios";

export const api = axios.create({
  baseURL: "https://yuga-ai-backend-mvp.onrender.com",
  withCredentials: true,
});
