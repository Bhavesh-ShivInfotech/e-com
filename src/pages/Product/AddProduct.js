import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Col, Container, Row, Form, Button } from "react-bootstrap";
import Layout from "../../Layouts/index";
import API from "../../services/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Product.css";

const ProductForm = ({ isEditMode = false }) => {
  const { id } = useParams(); // Get product ID for edit mode
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("General");
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState({
    is_prescription: true,
    vendor_id: 2,
    name: "",
    description: "",
    category_id: "",
    price: "",
    quantity: "",
    metaTagTitle: "",
    metaTagDescription: "",
    metaTagKeywords: "",
    composition: "",
    presentation: "",
    storage: "",
    indication: "",
    dose: "",
    selectedImage: null,
  });
  const [newImage, setNewImage] = useState(null); // For storing the uploaded image URL
  const [preview, setPreview] = useState(null); // For image preview

  // Fetch categories and product details (if in edit mode)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await API.post("/api/category/listOfCategory", {
          model: "Category",
          limit: 500,
          condition: { is_archived: false },
        });
        setCategories(response.data?.data || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchProductDetails = async () => {
      if (isEditMode && id) {
        try {
          const response = await API.get(`/api/product/getProduct/${id}`);
          const productData = response.data?.data;
          if (productData) {
            setProduct({
              ...productData,
              category_id: productData.category_id || "",
              selectedImage: productData.image || null,
            });
            setPreview(productData.image || null); // Set preview for existing image
          }
        } catch (error) {
          console.error("Error fetching product details:", error);
        }
      }
    };

    fetchCategories();
    if (isEditMode) fetchProductDetails();
  }, [id, isEditMode]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  // Handle image upload
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", file);
      try {
        const response = await API.post("/api/vendor/productImage", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (response?.data?.status === "success") {
          toast.success(
            response.data.message || "Image uploaded successfully!"
          );
          setNewImage(response?.data?.data?.[0]); // Set the uploaded image URL
          setPreview(URL.createObjectURL(file)); // Set the preview URL
        } else {
          toast.error(response?.data?.message || "Failed to upload image.");
        }
      } catch (error) {
        toast.error("Something went wrong! Please try again.");
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    Object.keys(product).forEach((key) => {
      if (product[key] !== null && product[key] !== undefined) {
        formData.append(key, product[key]);
      }
    });

    // Use the uploaded image URL if available
    if (newImage) {
      formData.append("selectedImage", newImage);
    }

    try {
      const endpoint = isEditMode
        ? `/api/product/editProduct/${id}`
        : "/api/product/addProduct";
      const method = isEditMode ? "put" : "post";

      const response = await API[method](endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response?.data?.status === "success") {
        toast.success(
          response.data.message ||
            (isEditMode
              ? "Product updated successfully!"
              : "Product added successfully!"),
          {
            position: "top-right",
            autoClose: 3000,
          }
        );
        navigate("/product");
      } else {
        toast.error(
          response?.data?.message ||
            (isEditMode
              ? "Failed to update product."
              : "Failed to add product."),
          {
            position: "top-right",
            autoClose: 3000,
          }
        );
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong! Please try again.",
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
          <Container fluid className="px-4 mb-4 product-container">
            <Row className="align-items-center mb-4">
              <Col>
                <h2 className="mb-0">
                  {isEditMode ? "Edit Product" : "Add Product"}
                </h2>
              </Col>
              <Col className="text-end">
                <Button variant="secondary" onClick={() => navigate(-1)}>
                  Back
                </Button>
              </Col>
            </Row>

            <Row>
              <Col xl={12} md={12}>
                <div className="tabs mb-4">
                  {["General", "Data", "Image"].map((tab) => (
                    <Button
                      key={tab}
                      variant="outline-primary"
                      className={`me-2 ${
                        activeTab === tab ? "active-tab" : ""
                      }`}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab}
                    </Button>
                  ))}
                </div>
                <Form onSubmit={handleSubmit} encType="multipart/form-data">
                  {activeTab === "General" && (
                    <div className="section p-4 border rounded">
                      <h4 className="mb-4">General Information</h4>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Product Name</Form.Label>
                            <Form.Control
                              type="text"
                              name="name"
                              value={product.name}
                              onChange={handleChange}
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Category</Form.Label>
                            <Form.Select
                              name="category_id"
                              value={product.category_id}
                              onChange={handleChange}
                              required
                            >
                              <option value="">Select Category</option>
                              {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                  {cat.name}
                                </option>
                              ))}
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={12}>
                          <Form.Group className="mb-3">
                            <Form.Label>Product Description</Form.Label>
                            <Form.Control
                              type="text"
                              name="description"
                              value={product.description}
                              onChange={handleChange}
                              required
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                              type="number"
                              name="price"
                              value={product.price}
                              onChange={handleChange}
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Quantity</Form.Label>
                            <Form.Control
                              type="number"
                              name="quantity"
                              value={product.quantity}
                              onChange={handleChange}
                              required
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={12}>
                          <Form.Group className="mb-3">
                            <Form.Label>Meta Tag Title</Form.Label>
                            <Form.Control
                              type="text"
                              name="metaTagTitle"
                              value={product.metaTagTitle}
                              onChange={handleChange}
                              required
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={12}>
                          <Form.Group className="mb-3">
                            <Form.Label>Meta Tag Description</Form.Label>
                            <Form.Control
                              type="text"
                              name="metaTagDescription"
                              value={product.metaTagDescription}
                              onChange={handleChange}
                              required
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={12}>
                          <Form.Group className="mb-3">
                            <Form.Label>Meta Tag Keywords</Form.Label>
                            <Form.Control
                              type="text"
                              name="metaTagKeywords"
                              value={product.metaTagKeywords}
                              onChange={handleChange}
                              required
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    </div>
                  )}

                  {activeTab === "Data" && (
                    <div className="section p-4 border rounded">
                      <h4 className="mb-4">Product Data</h4>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Composition</Form.Label>
                            <Form.Control
                              type="text"
                              name="composition"
                              value={product.composition}
                              onChange={handleChange}
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Presentation</Form.Label>
                            <Form.Control
                              type="text"
                              name="presentation"
                              value={product.presentation}
                              onChange={handleChange}
                              required
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Storage</Form.Label>
                            <Form.Control
                              type="text"
                              name="storage"
                              value={product.storage}
                              onChange={handleChange}
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Indication</Form.Label>
                            <Form.Control
                              type="text"
                              name="indication"
                              value={product.indication}
                              onChange={handleChange}
                              required
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Dose</Form.Label>
                            <Form.Control
                              type="text"
                              name="dose"
                              value={product.dose}
                              onChange={handleChange}
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Shelf Life</Form.Label>
                            <Form.Control
                              type="text"
                              name="shelfLife"
                              value={product.shelfLife}
                              onChange={handleChange}
                              disabled={isEditMode}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    </div>
                  )}

                  {activeTab === "Image" && (
                    <div className="section p-4 border rounded">
                      <h4 className="mb-4">Product Image</h4>
                      <Row>
                        <Col md={12}>
                          <Form.Group className="mb-3">
                            <Form.Label>Upload Image</Form.Label>
                            {product.selectedImage && !newImage && (
                              <div className="mb-2">
                                <img
                                  src={product.selectedImage}
                                  alt="product"
                                  className="img-thumbnail"
                                  style={{
                                    width: "150px",
                                    height: "150px",
                                    objectFit: "cover",
                                  }}
                                />
                              </div>
                            )}
                            <Form.Control
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              required={!isEditMode}
                            />
                            {preview && (
                              <img
                                src={preview}
                                alt="Preview"
                                className="preview-img mt-3"
                              />
                            )}
                          </Form.Group>
                        </Col>
                      </Row>
                      <Button
                        variant="primary"
                        type="submit"
                        className="mt-3"
                        disabled={loading}
                      >
                        {loading ? (
                          <Spinner size="sm" />
                        ) : isEditMode ? (
                          "Update Product"
                        ) : (
                          "Save Product"
                        )}
                      </Button>
                    </div>
                  )}
                </Form>
                <ToastContainer position="top-right" autoClose={3000} />
              </Col>
            </Row>
          </Container>
        </div>
      </Layout>
    </React.Fragment>
  );
};

export default ProductForm;
