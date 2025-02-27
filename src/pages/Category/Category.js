import React, { useEffect, useState, useCallback } from "react";
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
import API, {
  deleteCategory,
  addCategory,
  editCategory,
} from "../../services/api";
import { toast, ToastContainer } from "react-toastify";
import Pagination from "../../Components/Common/Pagination";
import RowsPerPage from "../../Components/Common/RowsPerPage";
import SimpleReactValidator from "simple-react-validator";
import BaseTable from "../Table/BaseTable";
import { fetchCategories } from "../../services/api";
import CommonModal from "../../Components/Common/CommonModal";
import CommonDeleteModal from "../../Components/Common/CommonDeleteModal";
import Spinner from "../../Components/Common/Spinner";
import { ResponseStatusEnum } from "../../Components/constants/httpStatusCodes";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Category.css";
import "../../index.css";
import ImageError from "../../../src/assets/images/auth-one-bg.jpg";

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
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  useEffect(() => {
    document.title = "Category";
  }, []);

  const handleImageError = (event, defaultImageSrc) => {
    event.target.onerror = null;
    event.target.src = defaultImageSrc;
  };

  const [validator] = useState(
    new SimpleReactValidator({
      className: "error-message",
      messages: {
        required: "Field is required.",
        name: "Name is required.",
        description: "Description is required.",
        image: "Image is required.",
      },
    })
  );

  const tog_list = () => {
    setmodal_list(!modal_list);
    if (!modal_list) {
      setIsEditMode(false);
      setCategory({ id: "", name: "", description: "", image: null });
      setPreview(null);
      validator.hideMessages();
    }
  };

  const tog_delete = () => {
    setmodal_delete((prev) => {
      const newState = !prev;
      return newState;
    });
  };

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

  const handleCancelImage = () => {
    setCategory({ ...category, image: null });
    setPreview(null);
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
      const response = isEditMode
        ? await editCategory(category.id, formData)
        : await addCategory(formData);

      if (response?.status === ResponseStatusEnum.SUCCESS) {
        toast.success(response.message);
        setCategory({ id: "", name: "", description: "", image: null });
        setPreview(null);
        tog_list();
        navigate("/category");
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
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
      if (response?.status === ResponseStatusEnum.SUCCESS) {
        toast.success(response.message);
        setCategories((prevCategories) =>
          prevCategories.filter(({ id }) => id !== categoryToDelete.id)
        );
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setmodal_delete(false);
      setCategoryToDelete(null);
    }
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const filteredCategories = categories.filter(({ name, description }) =>
    [name, description].some((field) =>
      field.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const sortedCategories = [...filteredCategories].sort((a, b) => {
    if (sortColumn) {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedCategories.length / rowsPerPage);
  const currentRows = sortedCategories.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const columns = [
    {
      key: "id",
      title: "ID",
      sortable: true,
      onClick: () => handleSort("name"),
    },
    {
      key: "name",
      title: "Name",
      sortable: true,
      onClick: () => handleSort("name"),
    },
    {
      key: "description",
      title: "Description",
      sortable: true,
      onClick: () => handleSort("description"),
    },
    {
      key: "image",
      title: "Image",
      render: (image) => (
        <img
          src={image}
          alt="product"
          className="img-thumbnail"
          onError={(e) => handleImageError(e, ImageError)}
          style={{ width: "100px", height: "60px" }}
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
                      <Row className="g-4 ">
                        <Col className="col-sm-auto">
                          <div>
                            <h5 className="card-title mb-0 fs-3">Category</h5>
                          </div>
                        </Col>
                        <Col className="d-flex justify-content-sm-end">
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
                      </Row>
                    </CardHeader>
                    <CardBody>
                      <div className="listjs-table" id="customerList">
                        <Row className="g-4 mb-3">
                          <Col className="col-sm-auto">
                            <RowsPerPage
                              rowsPerPage={rowsPerPage}
                              handleRowsPerPageChange={handleRowsPerPageChange}
                            />
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
                          sortColumn={sortColumn}
                          sortDirection={sortDirection}
                        />
                        <div className="d-flex justify-content-sm-end">
                          <Pagination
                            totalPages={totalPages}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                          />
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </Container>
          </div>
        )}

        <CommonModal
          fade={true}
          isOpen={modal_list}
          toggle={tog_list}
          title={isEditMode ? "Edit Category" : "Add Category"}
          footerButtons={
            <>
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
            </>
          }
        >
          <Form className="tablelist-form" onSubmit={handleSubmit}>
            <div className="mb-3">
              <Label
                htmlFor="categoryName"
                className="form-label text-start w-100"
              >
                Category Name <span className="text-danger">*</span>
              </Label>
              <Input
                type="text"
                id="categoryName"
                className="form-control"
                placeholder="Enter Category Name"
                name="name"
                value={category.name}
                onChange={handleChange}
                onBlur={() => validator.showMessageFor("name")}
              />
              {validator.message("name", category.name, "required")}
            </div>

            <div className="mb-3">
              <Label
                htmlFor="categoryDescription"
                className="form-label text-start w-100"
              >
                Description <span className="text-danger">*</span>
              </Label>
              <Input
                type="textarea"
                id="categoryDescription"
                className="form-control"
                placeholder="Enter Description"
                name="description"
                value={category.description}
                onChange={handleChange}
                onBlur={() => validator.showMessageFor("description")}
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
                Category Image <span className="text-danger">*</span>
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
                  <div style={{ marginTop: "5px" }}>
                    <Button
                      color="danger"
                      size="sm"
                      onClick={handleCancelImage}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Form>
        </CommonModal>

        <CommonDeleteModal
          isOpen={modal_delete}
          toggle={tog_delete}
          message="Are you Sure You want to Remove this Record?"
          confirmDelete={confirmDelete}
        />
      </Layout>
    </React.Fragment>
  );
};

export default Category;
