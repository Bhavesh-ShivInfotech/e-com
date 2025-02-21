import API from "../../services/api";
import { LOGIN } from "../../services/apiendpoints";

export const login = async (email, password, role) => {
  try {
    const response = await API.post(LOGIN, {
      email_id: email,
      password: password,
      role: role,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
