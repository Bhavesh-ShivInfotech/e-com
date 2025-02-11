//setup Axios
import axios from "axios";

const API = axios.create({
  baseURL: "https://e-com-pharmacy-final.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      // console.log("token", token);
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default API;
