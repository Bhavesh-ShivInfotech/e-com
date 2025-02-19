import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Col,
  Container,
  Row,
  Card,
  CardHeader,
  CardBody,
  Form,
  Label,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  FormFeedback,
} from "reactstrap";
import { ClipLoader } from "react-spinners";
import Layout from "../../Layouts/index";
import API from "../../services/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Pagination from "../../Components/Common/Pagination";
import "./Category.css";
import "../../index.css";

const Spinner = () => {
  return (
    <div className="spinner-container ">
      <ClipLoader color="#007bff" size={50} />
    </div>
  );
};

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  // const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [modal_list, setmodal_list] = useState(false);
  const [modal_delete, setmodal_delete] = useState(false);
  const [category, setCategory] = useState({
    name: "",
    description: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const tog_list = () => setmodal_list(!modal_list);
  const tog_delete = () => setmodal_delete(!modal_delete);

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

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory({ ...category, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCategory({ ...category, image: file });
      setPreview(URL.createObjectURL(file));
      if (errors.image) {
        setErrors({ ...errors, image: "" });
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!category.name) newErrors.name = "Category Name is required.";
    if (!category.description)
      newErrors.description = "Description is required.";
    if (!category.image) newErrors.image = "Category Image is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

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
        setPreview(null);
        tog_list();
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

  const filteredCategories = categories.filter(({ name, description }) =>
    [name, description].some((field) =>
      field.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredCategories.length / rowsPerPage);
  const currentRows = filteredCategories.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setmodal_delete(true);
    console.log("Delete button clicked, modal state:", modal_delete); // Debugging
  // };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;

    try {
      const response = await API.put(
        `/api/category/deleteCategory/${categoryToDelete.id}`,
        {
          is_archived: true,
        }
      );
      if (response?.data?.status === "success") {
        toast.success(
          response?.data?.message || "Category deleted successfully!",
          {
            position: "top-right",
            autoClose: 3000,
          }
        );
        setCategories(
          categories.filter(({ id }) => id !== categoryToDelete.id)
        );
      } else {
        toast.error(response?.data?.message || "Failed to delete category.");
      }
    } catch (error) {
      toast.error(error.response?.data || error.message);
    } finally {
      setmodal_delete(false);
      setCategoryToDelete(null);
    }
  };
  return (
    <React.Fragment>
      <Layout>
        {loading ? (
          <Spinner />
        ) : (
          <div className="page-content ">
            <Container fluid className="px-4 mb-4">
              <Row>
                <Col xl={12} md={12} lg={12}>
                  <Card>
                    <CardHeader>
                      <h4 className="card-title mb-0">Category</h4>
                    </CardHeader>
                    <CardBody>
                      <div className="listjs-table" id="customerList">
                        <Row className="g-4 mb-3">
                          <Col className="col-sm-auto">
                            <div>
                              <Button
                                color="success"
                                className="add-btn me-1"
                                onClick={tog_list}
                                id="create-btn"
                              >
                                <i className="ri-add-line align-bottom me-1"></i>{" "}
                                Add
                              </Button>
                            </div>
                          </Col>
                          <Col className="col-sm">
                            <div className="d-flex justify-content-sm-end">
                              <div className="search-box ms-2">
                                <input
                                  type="text"
                                  className="form-control search"
                                  placeholder="Search..."
                                  value={searchTerm}
                                  onChange={(e) =>
                                    setSearchTerm(e.target.value)
                                  }
                                />
                                <i className="ri-search-line search-icon"></i>
                              </div>
                            </div>
                          </Col>
                        </Row>

                        <div className="table-responsive table-card mt-3 mb-1">
                          <table
                            className="table align-middle table-nowrap"
                            id="customerTable"
                          >
                            <thead className="table-light">
                              <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Image</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {currentRows.length > 0 ? (
                                currentRows.map(
                                  ({ id, name, description, image }) => (
                                    <tr key={id}>
                                      <td>{id}</td>
                                      <td>{name}</td>
                                      <td>{description}</td>
                                      <td>
                                        <img
                                          src={image}
                                          alt={name}
                                          className="img-thumbnail"
                                          style={{
                                            width: "80px",
                                            height: "80px",
                                          }}
                                        />
                                      </td>
                                      <td>
                                        <div className="d-flex gap-2">
                                          <div className="edit">
                                            <button
                                              className="btn btn-sm btn-success edit-item-btn"
                                              data-bs-toggle="modal"
                                              data-bs-target="#showModal"
                                              // onClick={() =>
                                              //   navigate(`/editcategory/${id}`)
                                              // }
                                            >
                                              Edit
                                            </button>
                                          </div>
                                          <div className="remove">
                                            <button
                                              className="btn btn-sm btn-danger remove-item-btn"
                                              onClick={() =>
                                                handleDeleteClick({ id })
                                              }
                                            >
                                              Remove
                                            </button>
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                  )
                                )
                              ) : (
                                <tr>
                                  <td colSpan="5">No categories found.</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>

                        <Pagination
                          totalPages={totalPages}
                          currentPage={currentPage}
                          setCurrentPage={setCurrentPage}
                          rowsPerPage={rowsPerPage}
                          handleRowsPerPageChange={handleRowsPerPageChange}
                        />
                        <ToastContainer position="top-right" autoClose={3000} />
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </Container>
          </div>
        )}

        {/* {showDeleteModal && (
          <div className="modal-overlay">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirm Delete</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowDeleteModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <p>Are you sure you want to delete this category?</p>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Cancel
                  </button>
                  <button className="btn btn-danger" onClick={confirmDelete}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )} */}

        <Modal
          isOpen={modal_list}
          toggle={tog_list}
          centered
          contentClassName="border-0"
          style={{ maxWidth: "500px" }}
        >
          <ModalHeader
            className="bg-light p-3 border-0"
            style={{ paddingBottom: "0.5rem" }}
            toggle={tog_list}
          >
            <h5 className="modal-title m-0">Add Category</h5>
          </ModalHeader>
          <ModalBody
            className="p-3"
            style={{ paddingTop: "0.5rem", paddingBottom: "0.5rem" }}
          >
            <Form className="tablelist-form" onSubmit={handleSubmit}>
              <div className="mb-3">
                <Label
                  htmlFor="categoryName"
                  className="form-label text-start w-100"
                >
                  Category Name
                </Label>
                <Input
                  type="text"
                  id="categoryName"
                  className="form-control"
                  placeholder="Enter Category Name"
                  name="name"
                  value={category.name}
                  onChange={handleChange}
                  invalid={!!errors.name}
                />
                {errors.name && (
                  <FormFeedback className="d-block text-start" type="invalid">
                    {errors.name}
                  </FormFeedback>
                )}
              </div>

              <div className="mb-3">
                <Label
                  htmlFor="categoryDescription"
                  className="form-label text-start w-100"
                >
                  Description
                </Label>
                <Input
                  type="textarea"
                  id="categoryDescription"
                  className="form-control"
                  placeholder="Enter Description"
                  name="description"
                  value={category.description}
                  onChange={handleChange}
                  invalid={!!errors.description}
                />
                {errors.description && (
                  <FormFeedback className="d-block text-start" type="invalid">
                    {errors.description}
                  </FormFeedback>
                )}
              </div>

              <div className="mb-3">
                <Label
                  htmlFor="categoryImage"
                  className="form-label text-start w-100"
                >
                  Category Image
                </Label>
                <Input
                  type="file"
                  id="categoryImage"
                  className="form-control"
                  accept="image/*"
                  onChange={handleImageChange}
                  invalid={!!errors.image}
                />
                {errors.image && (
                  <FormFeedback className="d-block text-start" type="invalid">
                    {errors.image}
                  </FormFeedback>
                )}
                {preview && (
                  <div className="mt-2 text-center">
                    <img
                      src={preview}
                      alt="Preview"
                      className="img-thumbnail"
                      style={{ width: "100px", height: "100px" }}
                    />
                  </div>
                )}
              </div>
            </Form>
          </ModalBody>
          <ModalFooter
            className="border-0 p-3"
            style={{ paddingTop: "0.5rem" }}
          >
            <div className="hstack gap-2 justify-content-end">
              <button
                type="button"
                className="btn btn-light"
                onClick={tog_list}
              >
                Close
              </button>
              <button
                type="submit"
                className="btn btn-success"
                onClick={handleSubmit}
              >
                Add Category
              </button>
            </div>
          </ModalFooter>
        </Modal>

        <Modal
          isOpen={modal_delete}
          toggle={tog_delete}
          className="modal fade zoomIn"
          id="deleteRecordModal"
          centered
        >
          <div className="modal-header">
            <Button
              type="button"
              onClick={tog_delete}
              className="btn-close"
              aria-label="Close"
            >
              {" "}
            </Button>
          </div>
          <ModalBody>
            <div className="mt-2 text-center">
              <lord-icon
                src="https://cdn.lordicon.com/gsqxdxog.json"
                trigger="loop"
                colors="primary:#f7b84b,secondary:#f06548"
                style={{ width: "100px", height: "100px" }}
              ></lord-icon>
              <div className="mt-4 pt-2 fs-15 mx-4 mx-sm-5">
                <h4>Are you Sure ?</h4>
                <p className="text-muted mx-4 mb-0">
                  Are you Sure You want to Remove this Record ?
                </p>
              </div>
            </div>
            <div className="d-flex gap-2 justify-content-center mt-4 mb-2">
              <button
                type="button"
                className="btn w-sm btn-light"
                onClick={tog_delete}
              >
                Close
              </button>
              <button
                type="button"
                className="btn w-sm btn-danger"
                id="delete-record"
                onClick={confirmDelete}
              >
                Yes, Delete It!
              </button>
            </div>
          </ModalBody>
        </Modal>
      </Layout>
    </React.Fragment>
  );
};

export default Category;
