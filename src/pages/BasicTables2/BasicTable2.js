import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { Card, CardBody, CardHeader, Col, Container, Row } from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./BasicTable2.css";
const ListOfOrder = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrders, setSelectedOrders] = useState([]);
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

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedOrders(customers.map((order) => order.order_id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOrder = (orderId) => {
    setSelectedOrders((prevSelected) =>
      prevSelected.includes(orderId)
        ? prevSelected.filter((id) => id !== orderId)
        : [...prevSelected, orderId]
    );
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const filteredCustomers = customers.filter((customer) => customer.userName);

  const totalPages = Math.ceil(filteredCustomers.length / rowsPerPage);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredCustomers.slice(indexOfFirstRow, indexOfLastRow);

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
    <React.Fragment>
      <div className="page-content Table2">
        <Container fluid className="px-4">
          <Row>
            <Col xl={12} md={12}>
              <Card className="shadow-lg bg-white rounded">
                <CardHeader className="align-items-center d-flex">
                  <h5 className="card-title mb-0 fw-bold fs-4 flex-grow-1">
                    List Of Orders
                  </h5>
                </CardHeader>
                <CardBody>
                  <div className="table-responsive">
                    <table className="table align-middle table-nowrap table-striped-columns table-hover mb-0">
                      <thead className="table-light">
                        <tr>
                          <th scope="col">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id="selectAll"
                                onChange={handleSelectAll}
                                checked={
                                  selectedOrders.length === customers.length
                                }
                              />
                              <label
                                className="form-check-label"
                                htmlFor="selectAll"
                              ></label>
                            </div>
                          </th>
                          <th scope="col">Order ID</th>
                          <th scope="col">First Name</th>
                          <th scope="col">Last Name</th>
                          <th scope="col">Email ID</th>
                          <th scope="col">Total Amount</th>
                          <th scope="col">Status</th>
                          <th scope="col">Discount</th>
                          <th scope="col">Tax</th>
                        </tr>
                      </thead>
                      <tbody>
                        {error ? (
                          <tr>
                            <td colSpan="9" className="text-danger text-center">
                              {error}
                            </td>
                          </tr>
                        ) : currentRows.length > 0 ? (
                          currentRows.map((customer) => (
                            <tr key={customer.order_id}>
                              <td>
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={selectedOrders.includes(
                                      customer.order_id
                                    )}
                                    onChange={() =>
                                      handleSelectOrder(customer.order_id)
                                    }
                                  />
                                </div>
                              </td>
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
                            <td colSpan="9" className="text-muted text-center">
                              No customers found.
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
                      className="form-select w-auto"
                      value={rowsPerPage}
                      onChange={handleRowsPerPageChange}
                    >
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ListOfOrder;
