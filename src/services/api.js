import axios from "axios";
import { LIST_OF_CATEGORY, DELETE_CATEGORY } from "./apiendpoints";
import { CallSharp, Category } from "@mui/icons-material";
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

//Generic POST request

export const postData = async (endpoint, data) => {
  try {
    const response = await API.post(endpoint, data);
    return response.data;
  } catch (error) {
    console.error("Error posting data:", error.response?.data || error.message);
    throw error;
  }
};

export const deleteData = async (endpoint, data) => {
  try {
    const response = await API.put(endpoint, { data });
    return response.data;
  } catch (error) {
    console.log("Error deleting data: ", error.response?.data || error.message);
    throw error;
  }
};

// Category-specific API Calls

export const fetchCategories = async () => {
  return postData(LIST_OF_CATEGORY, {
    model: "Category",
    limit: 500,
    condition: { is_archived: false },
  });
};

export const deleteCategory = async (categoryId) => {
  return deleteData(`${DELETE_CATEGORY}/${categoryId}`, {
    is_archived: true,
  });
};

export default API;
