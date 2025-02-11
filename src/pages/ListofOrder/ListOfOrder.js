import React, { useEffect, useState } from "react";
import API from "../../services/api";
import "bootstrap/dist/css/bootstrap.min.css";

const ListOfOrder = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const apiEndpoint4 = "/api/admin/dashBoard/listOfOrder";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get(apiEndpoint4);
        setCustomers(response.data.data);
      } catch (err) {
        console.error(
          "Error fetching data:",
          err.response?.data || err.message
        );
        setError(
          err.response?.data?.message ||
            "Failed to load data. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle rows per page change
  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCustomers.length / rowsPerPage);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredCustomers.slice(indexOfFirstRow, indexOfLastRow);

  // Function to determine status pill class based on status value
  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-danger text-white";
      case "success":
        return "bg-info text-white";
      case "rejected":
      case "approve":
      case "confirmed":
      case "failed":
        return "bg-warning text-dark";
      default:
        return "bg-secondary text-white";
    }
  };

  return (
    <div className="container mt-4 mb-5">
      <div className="card shadow-lg bg-white rounded p-3 mb-5">
        <h4 className="fw-bold text-dark mb-3">List Of Orders</h4>

        {/* Search Field with Icon */}
        <div className="mb-3 d-flex justify-content-end position-relative">
          <input
            type="text"
            className="form-control w-50 pl-5"
            placeholder="Search by Name or Email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <i
            className="fa fa-search position-absolute"
            style={{ top: "50%", left: "15px", transform: "translateY(-50%)" }}
          ></i>
        </div>

        {loading && <p className="text-center">Loading...</p>}

        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-primary">
              <tr>
                <th>Order ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email ID</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Discount</th>
                <th>Tax</th>
              </tr>
            </thead>
            <tbody>
              {error ? (
                <tr>
                  <td colSpan="8" className="text-danger text-center">
                    {error}
                  </td>
                </tr>
              ) : currentRows.length > 0 ? (
                currentRows.map((customer, index) => (
                  <tr key={index}>
                    <td>{customer.order_id}</td>
                    <td>{customer.userName || "N/A"}</td>
                    <td>{customer.lastName || "N/A"}</td>
                    <td>{customer.email || "N/A"}</td>
                    <td>{customer.total_amount}</td>
                    <td>
                      <span
                        className={`badge rounded-pill ${getStatusClass(
                          customer.status
                        )}`}
                      >
                        {customer.status}
                      </span>
                    </td>
                    <td>{customer.discount}</td>
                    <td>{customer.tax || "N/A"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-muted text-center">
                    No customers match your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
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

        {/* Rows per page selector */}
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
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ListOfOrder;
