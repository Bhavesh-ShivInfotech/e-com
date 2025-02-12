import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../Layouts/index";
import API from "../../services/api";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import "./Category.css";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await API.post(
          "/api/category/listOfCategory",
          {
            model: "Category",
            limit: 500,
            condition: {
              is_archived: false,
            },
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data && response.data.data) {
          setCategories(response.data.data);
        } else {
          throw new Error("Invalid data structure received.");
        }
      } catch (err) {
        console.error("Error fetching categories:", {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);
  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCategories.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredCategories.slice(indexOfFirstRow, indexOfLastRow);

  return (
    <Layout>
      <div className="category-container container">
        <div className="row">
          <div className="col-12">
            <h1 className="text-left mb-4">Category</h1>
          </div>

          <div className="col-12">
            <div className="d-flex justify-content-between mb-3">
              <button
                className="btn btn-primary"
                style={{ position: "absolute", top: "20px", right: "20px" }}
                onClick={() => navigate("/addcategory")}
              >
                Add Category
              </button>
              <input
                type="text"
                className="form-control w-25"
                placeholder="Search by name or description"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ marginTop: "40px" }}
              />
            </div>

            <div className="table-responsive">
              <table className="table">
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
                  {loading ? (
                    <tr>
                      <td colSpan="5">Loading...</td>
                    </tr>
                  ) : currentRows.length > 0 ? (
                    currentRows.map((category) => (
                      <tr key={category.id}>
                        <td>{category.id}</td>
                        <td>{category.name}</td>
                        <td>{category.description}</td>
                        <td>
                          <img
                            src={category.image}
                            alt={category.name}
                            className="img-fluid rounded"
                            style={{
                              maxWidth: "80px",
                              height: "80px",
                              objectFit: "cover",
                            }}
                          />
                        </td>
                        <td>
                          <button
                            className="btn btn-warning btn-sm mx-2"
                            onClick={() =>
                              navigate(`/editcategory/${category.id}`)
                            }
                          >
                            <FaEdit />
                          </button>
                          <button className="btn btn-danger btn-sm mx-2">
                            <FaTrashAlt />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5">No categories found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="d-flex justify-content-between mt-3">
              <button
                className="btn btn-secondary"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="btn btn-secondary"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>

            <div className="mt-3">
              <label htmlFor="rowsPerPage" className="form-label">
                Rows per page:
              </label>
              <select
                id="rowsPerPage"
                className="form-select"
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={40}>40</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Category;
