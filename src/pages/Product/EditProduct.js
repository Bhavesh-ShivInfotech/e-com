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

const EditProduct = () => {
  const {
    id,
    is_prescription,
    vendor_id,
    name,
    description,
    category_id,
    price,
    quantity,
    metaTagTitle,
    metaTagDescription,
    metaTagKeywords,
    composition,
    presentation,
    storage,
    indication,
    dose,
    selectedImage,
  } = useParams();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("General");
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState({
    is_prescription: is_prescription || true,
    vendor_id: vendor_id || 2,
    name: name || "",
    description: description || "",
    category_id: category_id ? Number(category_id) : undefined,
    price: price || "",
    quantity: quantity || "",
    metaTagTitle: metaTagTitle || "",
    metaTagDescription: metaTagDescription || "",
    metaTagKeywords: metaTagKeywords || "",
    composition: composition || "",
    presentation: presentation || "",
    storage: storage || "",
    indication: indication || "",
    dose: dose || "",
    selectedImage: selectedImage || "",
  });
  const [newImage, setNewImage] = useState(null);
  const [preview, setPreview] = useState(null);

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

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

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
          setNewImage(response?.data?.data?.[0]);
          setPreview(URL.createObjectURL(file));
        } else {
          toast.error(response?.data?.message || "Failed to upload image.");
        }
      } catch (error) {
        toast.error("Something went wrong! Please try again.");
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("is_prescription", product.is_prescription);
    formData.append("vendor_id", product.vendor_id);
    formData.append("name", product.name);
    formData.append("description", product.description);
    formData.append("category_id", Number(product.category_id));
    formData.append("price", product.price);
    formData.append("quantity", product.quantity);
    formData.append("metaTagTitle", product.metaTagTitle);
    formData.append("metaTagDescription", product.metaTagDescription);
    formData.append("metaTagKeywords", product.metaTagKeywords);
    formData.append("composition", product.composition);
    formData.append("presentation", product.presentation);
    formData.append("storage", product.storage);
    formData.append("indication", product.indication);
    formData.append("dose", product.dose);

    if (newImage) {
      formData.append("selectedImage", newImage);
    } else {
      formData.append("selectedImage", product.selectedImage);
    }

    try {
      const response = await API.put(
        `api/product/editProduct/${id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response?.data?.status === "success") {
        toast.success(
          response.data.message || "Product updated successfully!",
          {
            position: "top-right",
            autoClose: 3000,
          }
        );
        navigate("/product");
      } else {
        toast.error(response?.data?.message || "Failed to update product.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Error updating product. Please try again.",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
      console.error(
        "Error Updating product:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <React.Fragment>
      <Layout>
        <div className="page-content ">
          <Container fluid className="px-4 mb-4 editproduct-container">
            <Row className="align-items-center mb-4">
              <Col>
                <h2 className="mb-0">Edit Product</h2>
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
                <Form onSubmit={handleUpdate} encType="multipart/form-data">
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
                              onChange={(e) =>
                                setProduct({
                                  ...product,
                                  category_id: Number(e.target.value),
                                })
                              }
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
                              disabled
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
                        {loading ? <Spinner size="sm" /> : "Update Product"}
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

export default EditProduct;
