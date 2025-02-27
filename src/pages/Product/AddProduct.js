import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import {
  Col,
  Container,
  Row,
  Form,
  Button,
  Card,
  Tabs,
  Tab,
  Spinner,
} from "react-bootstrap";
import Dropzone from "react-dropzone";
import Layout from "../../Layouts/index";
import { toast } from "react-toastify";
import {
  fetchCategories,
  viewProduct,
  addProduct,
  editProduct,
  editImage,
} from "../../services/api";
import "react-toastify/dist/ReactToastify.css";
import { ResponseStatusEnum } from "../../Components/constants/httpStatusCodes";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Product.css";
import SimpleReactValidator from "simple-react-validator";

const AddProduct = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("general");
  const [categories, setCategories] = useState([]);
  const { id } = useParams();
  const isEditMode = !!id;
  const [imageLoading, setImageLoading] = useState(false);
  const [product, setProduct] = useState({
    is_prescription: true,
    vendor_id: 2,
    name: "",
    description: "",
    category_id: undefined,
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
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [newImage, setNewImage] = useState(null);
  const validator = useRef(
    new SimpleReactValidator({
      className: "error-message",
      autoForceUpdate: this,
    })
  );

  const getValidationMessage = (fieldName, value, rules) => {
    return validator.current.message(fieldName, value, rules);
  };

  useEffect(() => {
    if (isEditMode) {
      const fetchProductData = async () => {
        try {
          const response = await viewProduct(id);
          if (response?.status === ResponseStatusEnum.SUCCESS) {
            const productData = response.data[0];
            setProduct({
              is_prescription: true,
              vendor_id: productData.vendor_id,
              name: productData.name,
              description: productData.description,
              category_id:
                productData.category_id === null
                  ? undefined
                  : Number(productData.category_id),
              price: productData.price,
              quantity: productData.quantity,
              metaTagTitle: productData.metaTagTitle,
              metaTagDescription: productData.metaTagDescription,
              metaTagKeywords: productData.metaTagKeywords,
              composition: productData.composition,
              presentation: productData.presentation,
              storage: productData.storage,
              indication: productData.indication,
              dose: productData.dose,
              selectedImage: productData.image || null,
            });
            if (productData.image) {
              setSelectedFiles([
                {
                  preview: productData.image,
                  name: "product-image",
                  formattedSize: "N/A",
                },
              ]);
            }
          } else {
            toast.error("Failed to fetch product data.");
          }
        } catch (error) {
          toast.error("Error fetching product data.");
        }
      };
      fetchProductData();
    } else {
      setProduct({
        is_prescription: true,
        vendor_id: 2,
        name: "",
        description: "",
        category_id: undefined,
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
        selectedImage: "",
      });
    }
  }, [id, isEditMode]);
  const loadCategories = useCallback(async () => {
    try {
      const response = await fetchCategories();
      setCategories(response.data || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
    validator.current.showMessageFor(name);
  };

  const handleAcceptedFiles = (acceptedFiles) => {
    const updatedFiles = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      })
    );
    setSelectedFiles([...selectedFiles, ...updatedFiles]);
    setProduct({ ...product, selectedImage: acceptedFiles[0] });
  };

  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validator.current.allValid()) {
      validator.current.showMessages();
      return;
    }
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
      formData.append("SelectedImage", product.selectedImage);
    }

    try {
      let response;
      if (isEditMode) {
        response = await editProduct(id, formData);
        if (response?.status === ResponseStatusEnum.SUCCESS) {
          toast.success(response.message);

          if (selectedFiles.length > 0) {
            const imageFormData = new FormData();
            imageFormData.append("image", selectedFiles[0]);
            const imageResponse = await editImage(imageFormData);
            if (imageResponse?.status === ResponseStatusEnum.SUCCESS) {
              toast.success(response.message);
              setNewImage(response?.data?.data?.[0]);
            } else {
              toast.error(response.message);
            }
          }
        } else {
          toast.error(response.message);
        }
      } else {
        if (selectedFiles.length > 0) {
          formData.append("image", selectedFiles[0]);
        }
        response = await addProduct(formData);
        if (response?.status === ResponseStatusEnum.SUCCESS) {
          toast.success(response.message);
        } else {
          toast.error(response.message);
        }
      }
      navigate("/product");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <React.Fragment>
      <Layout>
        <div className="page-content ">
          <Container fluid className="px-4 mb-4 addproduct-container">
            <Row className="align-items-center addproduct-title">
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
                <Card className="mt-xxl-n5">
                  <Card.Header>
                    <Tabs
                      activeKey={activeTab}
                      onSelect={(k) => setActiveTab(k)}
                      className="nav-tabs-custom rounded card-header-tabs border-bottom-0"
                    >
                      <Tab eventKey="general" title="General Information" />
                      <Tab eventKey="data" title="Product Data" />
                      <Tab eventKey="image" title="Product Image" />
                    </Tabs>
                  </Card.Header>
                  <Form onSubmit={handleSubmit} encType="multipart/form-data">
                    {activeTab === "general" && (
                      <div className="section p-4 border rounded">
                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Product Name</Form.Label>
                              <Form.Control
                                type="text"
                                name="name"
                                value={product.name}
                                onChange={handleChange}
                                onBlur={() =>
                                  validator.current.showMessageFor("name")
                                }
                                required
                              />
                              {getValidationMessage(
                                "name",
                                product.name,
                                "required|min:3|max:50"
                              )}
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Category</Form.Label>
                              <Form.Select
                                name="category_id"
                                value={product.category_id}
                                onChange={handleChange}
                                onBlur={() =>
                                  validator.current.showMessageFor(
                                    "category_id"
                                  )
                                }
                                required
                              >
                                <option value="">Select Category</option>
                                {categories.map((cat) => (
                                  <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                  </option>
                                ))}
                              </Form.Select>
                              {getValidationMessage(
                                "category_id",
                                product.category_id,
                                "required"
                              )}
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
                                onBlur={() =>
                                  validator.current.showMessageFor(
                                    "description"
                                  )
                                }
                                required
                              />
                              {getValidationMessage(
                                "description",
                                product.description,
                                "required"
                              )}
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
                                onBlur={() =>
                                  validator.current.showMessageFor("price")
                                }
                                required
                              />
                              {getValidationMessage(
                                "price",
                                product.price,
                                "required"
                              )}
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
                                onBlur={() =>
                                  validator.current.showMessageFor("quantity")
                                }
                                required
                              />
                              {getValidationMessage(
                                "quantity",
                                product.quantity,
                                "required"
                              )}
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
                                onBlur={() =>
                                  validator.current.showMessageFor(
                                    "metaTagTitle"
                                  )
                                }
                                required
                              />
                              {getValidationMessage(
                                "metaTagTitle",
                                product.metaTagTitle,
                                "required"
                              )}
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
                                onBlur={() =>
                                  validator.current.showMessageFor(
                                    "metaTagDescription"
                                  )
                                }
                                required
                              />
                              {getValidationMessage(
                                "metaTagDescription",
                                product.metaTagDescription,
                                "required"
                              )}
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
                                onBlur={() =>
                                  validator.current.showMessageFor(
                                    "metaTagKeywords"
                                  )
                                }
                                required
                              />
                              {getValidationMessage(
                                "metaTagKeywords",
                                product.metaTagKeywords,
                                "required"
                              )}
                            </Form.Group>
                          </Col>
                        </Row>
                      </div>
                    )}

                    {activeTab === "data" && (
                      <div className="section p-4 border rounded">
                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Composition</Form.Label>
                              <Form.Control
                                type="text"
                                name="composition"
                                value={product.composition}
                                onChange={handleChange}
                                onBlur={() =>
                                  validator.current.showMessageFor(
                                    "composition"
                                  )
                                }
                                required
                              />
                              {getValidationMessage(
                                "composition",
                                product.composition,
                                "required"
                              )}
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
                                onBlur={() =>
                                  validator.current.showMessageFor(
                                    "presentation"
                                  )
                                }
                                required
                              />
                              {getValidationMessage(
                                "presentation",
                                product.presentation,
                                "required"
                              )}
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
                                onBlur={() =>
                                  validator.current.showMessageFor("storage")
                                }
                                required
                              />
                              {getValidationMessage(
                                "storage",
                                product.storage,
                                "required"
                              )}
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
                                onBlur={() =>
                                  validator.current.showMessageFor("indication")
                                }
                                required
                              />
                              {getValidationMessage(
                                "indication",
                                product.indication,
                                "required"
                              )}
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
                                onBlur={() =>
                                  validator.current.showMessageFor("dose")
                                }
                                required
                              />
                              {getValidationMessage(
                                "dose",
                                product.dose,
                                "required"
                              )}
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
                                onBlur={() =>
                                  validator.current.showMessageFor("shelfLife")
                                }
                                required
                              />
                              {getValidationMessage(
                                "shelfLife",
                                product.shelfLife,
                                "required"
                              )}
                            </Form.Group>
                          </Col>
                        </Row>
                      </div>
                    )}

                    {activeTab === "image" && (
                      <div className="section p-4 border rounded">
                        <h5 className="fs-15 mb-1">Product Gallery</h5>
                        <p className="text-muted">
                          Add Product Gallery Images.
                        </p>
                        <Dropzone
                          onDrop={(acceptedFiles) => {
                            handleAcceptedFiles(acceptedFiles);
                          }}
                          accept="image/*"
                          multiple={false}
                        >
                          {({ getRootProps, getInputProps }) => (
                            <div
                              {...getRootProps()}
                              className="dropzone dz-clickable "
                              style={{
                                border: "2px dashed #ccc",
                                padding: "20px",
                                textAlign: "center",
                                cursor: "pointer",
                              }}
                            >
                              <input {...getInputProps()} />
                              <div className="dz-message needsclick">
                                <div className="mb-2">
                                  <i className="display-4 text-muted ri-upload-cloud-2-fill" />
                                </div>
                                <h5>Drop files here or click to upload.</h5>
                              </div>
                            </div>
                          )}
                        </Dropzone>
                        <div className="list-unstyled mb-0" id="file-previews">
                          {selectedFiles.map((f, i) => (
                            <Card
                              className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                              key={i + "-file"}
                            >
                              <div className="p-2">
                                <Row className="align-items-center">
                                  <Col className="col-auto">
                                    <img
                                      data-dz-thumbnail=""
                                      height="80"
                                      className="avatar-sm rounded bg-light"
                                      alt={f.name}
                                      src={f.preview}
                                    />
                                  </Col>
                                  <Col>
                                    <Link
                                      to="#"
                                      className="text-muted font-weight-bold"
                                    >
                                      {f.name}
                                    </Link>
                                    <p className="mb-0">
                                      <strong>{f.formattedSize}</strong>
                                    </p>
                                  </Col>
                                  <Col className="col-auto">
                                    <Button
                                      variant="danger"
                                      size="sm"
                                      onClick={() => {
                                        const updatedFiles =
                                          selectedFiles.filter(
                                            (file, index) => index !== i
                                          );
                                        setSelectedFiles(updatedFiles);
                                      }}
                                    >
                                      Delete
                                    </Button>
                                  </Col>
                                </Row>
                              </div>
                            </Card>
                          ))}
                        </div>
                        <Button
                          type="submit"
                          className="btn btn-success w-sm mt-3 "
                          disabled={loading || imageLoading}
                        >
                          {loading || imageLoading ? (
                            <Spinner size="sm" />
                          ) : isEditMode ? (
                            "Update Product"
                          ) : (
                            "Add Product"
                          )}
                        </Button>
                      </div>
                    )}
                  </Form>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </Layout>
    </React.Fragment>
  );
};

export default AddProduct;
