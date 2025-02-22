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
import API, { deleteCategory } from "../../services/api";
import { toast, ToastContainer } from "react-toastify";
import Pagination from "../../Components/Common/Pagination";
import SimpleReactValidator from "simple-react-validator";
import BaseTable from "../Table/BaseTable";
import { fetchCategories } from "../../services/api";
import { ADD_CATEGORY, EDIT_CATEGORY } from "../../services/apiendpoints";
import CategoryModal from "./CategoryModal";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
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

  const tog_delete = () => {
    setmodal_delete((prev) => {
      console.log("Before toggle: model_delete =", prev);
      const newState = !prev;
      console.log("After toggle: modal_delete =", newState);
      return newState;
    });
  };

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetchCategories();
        setCategories(response.data || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
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
        ? `${EDIT_CATEGORY}/${category.id}`
        : ADD_CATEGORY;
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
      const response = await deleteCategory(categoryToDelete.id);
      if (response?.status === "success") {
        toast.success(response?.message || "Category deleted successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
        setCategories((prevCategories) =>
          prevCategories.filter(({ id }) => id !== categoryToDelete.id)
        );
      } else {
        toast.error(response?.message || "Failed to delete category.");
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
        <img src={image} alt="Category" className="img-thumbnail w-75 h-75" />
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

        <CategoryModal
          isOpen={modal_list}
          toggle={tog_list}
          isEditMode={isEditMode}
          category={category}
          setCategory={setCategory}
          preview={preview}
          setPreview={setPreview}
          validator={validator}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          handleImageChange={handleImageChange}
        />

        <Modal
          fade={true}
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
                className="w-100 h-100"
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
