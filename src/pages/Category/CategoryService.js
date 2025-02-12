// import API from "../../services/api";

// const getCategories = async () => {
//   try {
//     const response = await API.post("/api/category/listOfCategory");
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching categories:", error);
//     throw error;
//   }
// };

// const addCategory = async (categoryData) => {
//   try {
//     const response = await API.post("/categories", categoryData);
//     return response.data;
//   } catch (error) {
//     console.error("Error adding category:", error);
//     throw error;
//   }
// };

// const deleteCategory = async (categoryId) => {
//   try {
//     const response = await API.delete(`/categories/${categoryId}`);
//     return response.data;
//   } catch (error) {
//     console.error("Error deleting category:", error);
//     throw error;
//   }
// };

// const updateCategory = async (categoryId, categoryData) => {
//   try {
//     const response = await API.put(`/categories/${categoryId}`, categoryData);
//     return response.data;
//   } catch (error) {
//     console.error("Error updating category:", error);
//     throw error;
//   }
// };

// export default {
//   getCategories,
//   addCategory,
//   deleteCategory,
//   updateCategory,
// };
