import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  LIST_OF_CATEGORY,
  DELETE_CATEGORY,
  ADD_CATEGORY,
  EDIT_CATEGORY,
  DELETE_PRODUCT,
  LIST_OF_PRODUCT,
  ADD_PRODUCT,
  EDIT_PRODUCT,
  CHANGE_IMAGE,
  VIEW_PRODUCT,
} from "./apiendpoints";
import { CallSharp, Category } from "@mui/icons-material";
// import { config } from "webpack";
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

const createMultipartInstance = () => {
  const instance = axios.create({
    baseURL: API.defaults.baseURL,
  });

  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("adminToken");
      if (token) {
        config.headers["Authorization"] = token;
      }
      config.headers["Content-Type"] = "multipart/form-data";
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  return instance;
};

const multipartAPI = createMultipartInstance();
export const getData = async (endpoint) => {
  try {
    const response = await API.get(endpoint);
    return response.data;
  } catch (error) {
    toast.error(error.response?.data || "Error fetching data");
    throw error;
  }
};

export const postData = async (endpoint, data) => {
  try {
    const response = await API.post(endpoint, data);
    return response.data;
  } catch (error) {
    toast.error(error.response?.data || "Error posting data");
    throw error;
  }
};

export const putData = async (endpoint, data) => {
  try {
    const response = await API.put(endpoint, data);
    return response.data;
  } catch (error) {
    toast.error(error.response?.data);
    throw error;
  }
};
export const deleteData = async (endpoint, data) => {
  try {
    const response = await API.put(endpoint, data);
    return response.data;
  } catch (error) {
    toast.error(error.response?.data);
    throw error;
  }
};

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

export const addCategory = async (formData) => {
  try {
    const response = await multipartAPI.post(ADD_CATEGORY, formData);
    return response.data;
  } catch (error) {
    toast.error(error.response?.data);
    return error;
  }
};

export const editCategory = async (categoryId, formData) => {
  try {
    const response = await multipartAPI.put(
      `${EDIT_CATEGORY}/${categoryId}`,
      formData
    );
    return response.data;
  } catch (error) {
    toast.error(error.response?.data);
    return error;
  }
};

export const fetchProducts = async () => {
  const response = await API.post(LIST_OF_PRODUCT);
  return response?.data;
};

export const deleteProduct = async (productId) => {
  return deleteData(`${DELETE_PRODUCT}/${productId}`, {
    is_archived: true,
  });
};

export const addProduct = async (formData) => {
  try {
    const response = await multipartAPI.post(ADD_PRODUCT, formData);
    return response.data;
  } catch (error) {
    toast.error(error.response?.data);
    return error;
  }
};

export const viewProduct = async (productId) => {
  try {
    const response = await API.get(`${VIEW_PRODUCT}/${productId}`);
    return response?.data;
  } catch (error) {
    toast.error(error.response?.data || "Error fetching products");
    throw error;
  }
};

export const editProduct = async (productId, formData) => {
  try {
    const response = await multipartAPI.put(
      `${EDIT_PRODUCT}/${productId}`,
      formData
    );
    return response.data;
  } catch (error) {
    toast.error(error.response?.data);
    return error;
  }
};

export const editImage = async (formData) => {
  try {
    const response = await multipartAPI.post(CHANGE_IMAGE, formData);
    return response?.data;
  } catch (error) {
    toast.error(error.response?.data);
    return error;
  }
};
export default API;
