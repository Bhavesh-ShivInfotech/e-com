import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../Layouts/index";
import API from "../../services/api";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Spinner } from "reactstrap";
import "./Category.css";

const EditCategory = () => {
  const { id, name, description, image } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState({
    name: name || "",
    description: description || "",
    image: image || "",
  });

  const [newImage, setNewImage] = useState(null);

  const handleChange = (e) => {
    setCategory({ ...category, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImage(file);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("name", category.name);
    formData.append("description", category.description);

    if (newImage) {
      formData.append("image", newImage);
    } else {
      formData.append("image", category.image);
    }

    try {
      const response = await API.put(
        `/api/category/editCategory/${id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data.success) {
        toast.success(
          response.data.message || "Category updated successfully!",
          {
            position: "top-right",
            autoClose: 3000,
          }
        );
        navigate("/category");
      } else {
        toast.error(response.data.message || "Failed to update category.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (err) {
      toast.error("Error updating category. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
      console.error(
        "Error updating category:",
        err.response?.data || err.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container editcategory-container">
        <h2>Edit Category</h2>
        <form onSubmit={handleUpdate} encType="multipart/form-data">
          <div className="mb-3 mt-4">
            <label className="form-label">Category Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={category.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              type="text"
              className="form-control"
              name="description"
              value={category.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="form-label">Category Image</label>
            {category.image && !newImage && (
              <div className="mb-2">
                <img
                  src={category.image}
                  alt="Category"
                  className="img-thumbnail"
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                  }}
                />
              </div>
            )}
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          <button type="submit" className="btn btn-success" disabled={loading}>
            {loading ? <Spinner size="sm" /> : "Update Category"}
          </button>
          <button
            type="button"
            className="btn btn-secondary ms-2"
            onClick={() => navigate("/category")}
          >
            Cancel
          </button>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </Layout>
  );
};

export default EditCategory;
