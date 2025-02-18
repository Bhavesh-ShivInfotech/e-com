import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";
import { ClipLoader } from "react-spinners";
import Layout from "../../Layouts/index";
import API from "../../services/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
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
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const navigate = useNavigate();

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
    setShowDeleteModal(true);
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
      setShowDeleteModal(false);
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
            <Container fluid className="px-4 mb-4 category-container">
              <Row>
                <Col xl={12} md={12}>
                  <h1 className="mb-4">Category</h1>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <input
                      type="text"
                      className="form-control w-25"
                      placeholder="Search by name or description"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button
                      className="btn btn-primary"
                      onClick={() => navigate("/addcategory")}
                    >
                      Add Category
                    </button>
                  </div>

                  <div className="table-responsive">
                    <table className="table table-striped">
                      <thead>
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
                                    style={{ width: "80px", height: "80px" }}
                                  />
                                </td>
                                <td>
                                  <button
                                    className="btn btn-warning btn-sm mx-1"
                                    onClick={() =>
                                      navigate(`/editcategory/${id}`)
                                    }
                                  >
                                    <FaEdit />
                                  </button>
                                  <button
                                    className="btn btn-danger btn-sm mx-1"
                                    onClick={() => handleDeleteClick({ id })}
                                  >
                                    <FaTrashAlt />
                                  </button>
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

                  {/* Pagination */}
                  <div className="d-flex justify-content-between mt-3">
                    <button
                      className="btn btn-secondary"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                    >
                      Previous
                    </button>
                    <span>
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      className="btn btn-secondary"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(currentPage + 1)}
                    >
                      Next
                    </button>
                  </div>

                  {/* Rows per page */}
                  <div className="mt-3">
                    <label className="form-label">Rows per page:</label>
                    <select
                      className="form-select w-auto"
                      value={rowsPerPage}
                      onChange={(e) => {
                        setRowsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                    >
                      {[5, 10, 20, 40].map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                  </div>
                  <ToastContainer position="top-right" autoClose={3000} />
                </Col>
              </Row>
            </Container>
          </div>
        )}

        {showDeleteModal && (
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
        )}
      </Layout>
    </React.Fragment>
  );
};

export default Category;
