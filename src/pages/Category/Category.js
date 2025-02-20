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
import SimpleReactValidator from "simple-react-validator";
import BaseTable from "../Table/BaseTable";
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
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [modal_list, setmodal_list] = useState(false);
  const [modal_delete, setmodal_delete] = useState(false);
  const [category, setCategory] = useState({
    id: "",
    name: "",
    description: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const navigate = useNavigate();

  const [validator] = useState(
    new SimpleReactValidator({
      className: "error-message",
    })
  );

  const tog_list = () => {
    setmodal_list(!modal_list);
    if (!modal_list) {
      setIsEditMode(false);
      setCategory({ id: "", name: "", description: "", image: null });
      setPreview(null);
    }
  };

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
    validator.showMessageFor(name);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCategory({ ...category, image: file });
      setPreview(URL.createObjectURL(file));
      validator.showMessageFor("image");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validator.allValid()) {
      validator.showMessages();
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("name", category.name);
    formData.append("description", category.description);
    formData.append("image", category.image);

    try {
      const endpoint = isEditMode
        ? `/api/category/editCategory/${category.id}`
        : "/api/category/addCategory";
      const method = isEditMode ? "put" : "post";

      const response = await API[method](endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response?.data?.status === "success") {
        toast.success(
          response.data.message ||
            `Category ${isEditMode ? "updated" : "added"} successfully!`,
          {
            position: "top-right",
            autoClose: 3000,
          }
        );

        setCategory({ id: "", name: "", description: "", image: null });
        setPreview(null);
        tog_list();
        navigate("/category");
      } else {
        toast.error(
          response.data.message ||
            `Failed to ${isEditMode ? "update" : "add"} category.`,
          {
            position: "top-right",
            autoClose: 3000,
          }
        );
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          `Failed to ${isEditMode ? "update" : "add"} category.`,
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (category) => {
    setCategory({
      id: category.id,
      name: category.name,
      description: category.description,
      image: category.image,
    });
    setPreview(category.image);
    setIsEditMode(true);
    setmodal_list(true);
  };

  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setmodal_delete(true);
  };

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

  const columns = [
    { key: "id", title: "ID" },
    { key: "name", title: "Name" },
    { key: "description", title: "Description" },
    {
      key: "image",
      title: "Image",
      render: (image) => (
        <img
          src={image}
          alt="Category"
          className="img-thumbnail"
          style={{ width: "80px", height: "80px" }}
        />
      ),
    },
    {
      key: "actions",
      title: "Action",
      render: (_, row) => (
        <div className="d-flex gap-2">
          <button
            className="btn btn-sm btn-success edit-item-btn"
            onClick={() => handleEditClick(row)}
          >
            Edit
          </button>
          <button
            className="btn btn-sm btn-danger remove-item-btn"
            onClick={() => handleDeleteClick(row)}
          >
            Remove
          </button>
        </div>
      ),
    },
  ];

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
                      <h5 className="card-title mb-0 fs-3">Category</h5>
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
                        {/* 
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
                                              onClick={() =>
                                                handleEditClick({
                                                  id,
                                                  name,
                                                  description,
                                                  image,
                                                })
                                              }
                                            >
                                              Edit
                                            </button>
                                          </div>
                                          <div className="remove">
                                            <button
                                              className="btn btn-sm btn-danger remove-item-btn"
                                              onClick={() =>
                                                handleDeleteClick({
                                                  id,
                                                  name,
                                                  description,
                                                  image,
                                                })
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
                        </div> */}

                        <BaseTable
                          columns={columns}
                          data={currentRows}
                          isLoading={loading}
                        />

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
            <h5 className="modal-title m-0">
              {isEditMode ? "Edit Category" : "Add Category"}
            </h5>
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
                />
                {validator.message("name", category.name, "required")}
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
                />
                {validator.message(
                  "description",
                  category.description,
                  "required"
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
                  className="mb-2"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {validator.message("image", category.image, "required")}
                {preview && (
                  <div className="img-preview">
                    <img src={preview} alt="Preview" className="preview-img" />
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
                {isEditMode ? "Update Category" : "Add Category"}
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
