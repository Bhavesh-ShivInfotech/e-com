import axios from "axios";

// Define the correct API URLs
const API_URLS = {
  productswith:
    "https://e-com-pharmacy-final.onrender.com/api/admin/dashBoard/countOfData?type=withPrescription",
  productswithout:
    "https://e-com-pharmacy-final.onrender.com/api/admin/dashBoard/countOfData?type=withoutPrescription",
  category:
    "https://e-com-pharmacy-final.onrender.com/api/admin/dashBoard/countOfCategories",
  customer:
    "https://e-com-pharmacy-final.onrender.com/api/admin/dashBoard/countOfCustomers",
};

// Use environment variable or state management for authentication token
const AUTH_TOKEN =
  process.env.REACT_APP_AUTH_TOKEN || "your-authentication-token-here";

// Function to fetch card data
export const fetchCardData = async () => {
  try {
    const responses = await Promise.all(
      Object.entries(API_URLS).map(async ([key, url]) => {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${AUTH_TOKEN}`,
          },
        });
        return { key, data: response.data.total || "N/A" };
      })
    );

    return responses.reduce((acc, { key, data }) => {
      acc[key] = data;
      return acc;
    }, {});
  } catch (err) {
    console.error("Error fetching card data:", err);
    return {};
  }
};

// Function to fetch graph data
export const fetchGraphData = async () => {
  try {
    const response = await axios.get(
      "https://e-com-pharmacy-final.onrender.com/api/admin/dashBoard/graphOfCustomer",
      {
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      }
    );

    const graphData = response.data.data || [];

    // Ensure exactly 12 months of data
    const finalGraphData = new Array(12).fill(0);
    graphData.forEach(({ month, count }) => {
      const index = month - 1; // Assuming API returns months as 1-12
      if (index >= 0 && index < 12) {
        finalGraphData[index] = count;
      }
    });

    return finalGraphData;
  } catch (err) {
    console.error("Error fetching graph data:", err);
    return new Array(12).fill(0);
  }
};
