import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api",
});

// LOGIN API
export const loginUser = (data) => API.post("/auth/login", data);

export default API;