import React, { useEffect, useState } from "react";
import Layout from "../../Layouts/index";
import CategoryService from "./CategoryService";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaEdit, FaTrashAlt } from "react-icons/fa"; // Importing icons
import "./Category.css";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await CategoryService.getCategories();
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories", error);

        // Mock data for testing
        setCategories([
          {
            id: 1,
            name: "Category 1",
            description: "Description 1",
            image: "image1.jpg",
          },
          {
            id: 2,
            name: "Category 2",
            description: "Description 2",
            image: "image2.jpg",
          },
          {
            id: 3,
            name: "Category 3",
            description: "Description 3",
            image: "image3.jpg",
          },
        ]);
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

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

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
                className="btn btn-primary position-absolute"
                style={{ top: "20px", right: "20px" }}
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
                            width="50"
                            height="50"
                          />
                        </td>
                        <td>
                          {/* Buttons with icons and spacing */}
                          <button className="btn btn-warning btn-sm mx-2">
                            <FaEdit /> {/* Edit Icon */}
                          </button>
                          <button className="btn btn-danger btn-sm mx-2">
                            <FaTrashAlt /> {/* Delete Icon */}
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
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="btn btn-secondary"
                onClick={() => handlePageChange(currentPage + 1)}
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
                onChange={handleRowsPerPageChange}
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
