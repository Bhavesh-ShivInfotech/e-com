import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";
import Layout from "../../Layouts/index";
import API from "../../services/api";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Spinner } from "reactstrap";
import "./Category.css";

const AddCategory = () => {
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState({
    name: "",
    description: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory({ ...category, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCategory({ ...category, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!category.name || !category.description || !category.image) {
      toast.error("All fields are required!", {
        position: "top-right",
        autoClose: 3000,
      });
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("name", category.name);
    formData.append("description", category.description);
    formData.append("image", category.image);

    try {
      const response = await API.post("/api/category/addCategory", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response?.data?.status === "success") {
        toast.success(response.data.message || "Category added successfully!", {
          position: "top-right",
          autoClose: 3000,
        });

        setCategory({
          name: "",
          description: "",
          image: null,
        });
        navigate("/category");
      } else {
        toast.error(
          response.data.message || "Failed to add category. Please try again.",
          {
            position: "top-right",
            autoClose: 3000,
          }
        );
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to add category. Please try again.",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <React.Fragment>
      <Layout>
        <div className="page-content ">
          <Container fluid className="px-4 mb-4 addcategory-container">
            <Row>
              <Col xl={12} md={12}>
                <h2>Add Category</h2>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                  <div className="mb-3">
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
                      className="form-control"
                      name="description"
                      value={category.description}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Category Image</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={handleImageChange}
                      required
                    />
                    {preview && (
                      <div className="image-preview">
                        <img
                          src={preview}
                          alt="Preview"
                          className="preview-img"
                        />
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    color="success"
                    disabled={loading}
                  >
                    {loading ? <Spinner size="sm" /> : "Add Category"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary ms-3"
                    onClick={() => navigate("/category")}
                  >
                    Cancel
                  </button>
                </form>
                <ToastContainer position="top-right" autoClose={3000} />
              </Col>
            </Row>
          </Container>
        </div>
      </Layout>
    </React.Fragment>
  );
};

export default AddCategory;
