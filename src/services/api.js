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
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//dashboard get data
export const getData = async (endpoint) => {
  try {
    const response = await API.get(endpoint);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching data:",
      error.response?.data || error.message
    );
    throw error;
  }
};
export default API;
