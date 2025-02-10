import axios from "axios";

const API_URL =
  "https://e-com-pharmacy-final.onrender.com/api/admin/dashBoard/recentlyRegistration";

export const fetchRecentlyJoinedCustomers = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data.slice(0, 10);
  } catch (error) {
    console.error("Error fetching recently joined customers:", error);
    throw error;
  }
};
