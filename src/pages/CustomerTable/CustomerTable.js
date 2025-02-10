import React, { useEffect, useState } from "react";
import { fetchRecentlyJoinedCustomers } from "./CustomerApi";
import "bootstrap/dist/css/bootstrap.min.css";

const CustomersTable = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const data = await fetchRecentlyJoinedCustomers();
        setCustomers(data);
      } catch (err) {
        setError("Failed to fetch customer data.");
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, []);

  return (
    <div className="container mt-4">
      <div className="card shadow-lg bg-white rounded p-3">
        <h4 className="fw-bold text-dark mb-3">Recently Joined Customers</h4>
        {loading && <p className="text-center">Loading...</p>}

        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-primary">
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Phone Number</th>
                <th>Email ID</th>
                <th>Registration Date</th>
              </tr>
            </thead>
            <tbody>
              {error ? (
                <tr>
                  <td colSpan="5" className="text-danger text-center">
                    {error}
                  </td>
                </tr>
              ) : customers.length > 0 ? (
                customers.map((customer, index) => (
                  <tr key={index}>
                    <td>{customer.firstName}</td>
                    <td>{customer.lastName}</td>
                    <td>{customer.phoneNumber}</td>
                    <td>{customer.emailID}</td>
                    <td>
                      {new Date(customer.registrationDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-muted text-center">
                    No recent registrations found.
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
