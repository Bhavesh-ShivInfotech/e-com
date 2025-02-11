import React, { useEffect, useState } from "react";
import API from "../../services/api";
import "bootstrap/dist/css/bootstrap.min.css";

const CustomersTable = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const apiEndpoint3 = "/api/admin/dashBoard/recentlyRegistration";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get(apiEndpoint3);
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

  // Filter customers based on the search term
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <div className="card shadow-lg bg-white rounded p-3">
        <h4 className="fw-bold text-dark mb-3">Recently Joined Customers</h4>

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
                <th>ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email ID</th>
                <th>Date of Birth</th>
                <th>Gender</th>
                <th>Phone Number</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {error ? (
                <tr>
                  <td colSpan="8" className="text-danger text-center">
                    {error}
                  </td>
                </tr>
              ) : filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer, index) => (
                  <tr key={index}>
                    <td>{customer.id}</td>
                    <td>{customer.first_name}</td>
                    <td>{customer.last_name}</td>
                    <td>{customer.email_id}</td>
                    <td>{new Date(customer.dob).toLocaleDateString()}</td>
                    <td>{customer.gender}</td>
                    <td>{customer.phone_no}</td>
                    <td>
                      {new Date(customer.created_at).toLocaleDateString()}
                    </td>
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
      </div>
    </div>
  );
};

export default CustomersTable;
