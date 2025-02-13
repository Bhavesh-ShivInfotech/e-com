import React, { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Col, Container, Row } from "reactstrap";
import API from "../../services/api";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./BasicTable1.css";

const RecentlyJoinedCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCustomers, setSelectedCustomers] = useState([]);

  const apiEndpoint = "/api/admin/dashBoard/recentlyRegistration";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get(apiEndpoint);
        console.log("API response: ", response.data.data);
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
      setSelectedCustomers(customers.map((customer) => customer.id));
    } else {
      setSelectedCustomers([]);
    }
  };

  const handleSelectCustomer = (customerId) => {
    setSelectedCustomers((prevSelected) =>
      prevSelected.includes(customerId)
        ? prevSelected.filter((id) => id !== customerId)
        : [...prevSelected, customerId]
    );
  };
  return (
    <React.Fragment>
      <div className="page-content Table">
        <Container fluid className="px-4">
          <Row>
            <Col xl={12} md={12}>
              <Card className="shadow-lg bg-white rounded">
                <CardHeader className="align-items-center d-flex">
                  <h5 className="card-title mb-0 fw-bold fs-4 flex-grow-1">
                    Recently Joined Customers
                  </h5>
                </CardHeader>
                <CardBody>
                  {loading ? (
                    <p className="text-center">Loading...</p>
                  ) : (
                    <div className="table-responsive table-card">
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
                                    selectedCustomers.length ===
                                    customers.length
                                  }
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="selectAll"
                                ></label>
                              </div>
                            </th>
                            <th scope="col">ID</th>
                            <th scope="col">First Name</th>
                            <th scope="col">Last Name</th>
                            <th scope="col">Email ID</th>
                            <th scope="col">Date of Birth</th>
                            <th scope="col">Gender</th>
                            <th scope="col">Phone Number</th>
                            <th scope="col">Created At</th>
                          </tr>
                        </thead>
                        <tbody>
                          {error ? (
                            <tr>
                              <td
                                colSpan="9"
                                className="text-danger text-center"
                              >
                                {error}
                              </td>
                            </tr>
                          ) : customers.length > 0 ? (
                            customers.map((customer) => (
                              <tr key={customer.id}>
                                <td>
                                  <div className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      checked={selectedCustomers.includes(
                                        customer.id
                                      )}
                                      onChange={() =>
                                        handleSelectCustomer(customer.id)
                                      }
                                    />
                                  </div>
                                </td>
                                <td>{customer.id}</td>
                                <td>{customer.first_name}</td>
                                <td>{customer.last_name}</td>
                                <td>{customer.email_id}</td>
                                <td>
                                  {new Date(customer.dob).toLocaleDateString()}
                                </td>
                                <td>{customer.gender}</td>
                                <td>{customer.phone_no}</td>
                                <td>
                                  {new Date(
                                    customer.created_at
                                  ).toLocaleDateString()}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan="9"
                                className="text-muted text-center"
                              >
                                No customers found.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default RecentlyJoinedCustomers;
