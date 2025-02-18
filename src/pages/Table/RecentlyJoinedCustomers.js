import React, { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Col, Container, Row } from "reactstrap";
import API from "../../services/api";
import BaseTable from "./BaseTable";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Table.css";

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
        setCustomers(response.data.data);
      } catch (err) {
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

  const columns = [
    "ID",
    "First Name",
    "Last Name",
    "Email ID",
    "Date of Birth",
    "Gender",
    "Phone Number",
    "Created At",
  ];

  const tableData = [
    {
      data: customers,
      columns: columns,
      selectedCustomers: selectedCustomers,
      handleSelectAll: handleSelectAll,
      handleSelectCustomer: handleSelectCustomer,
      error: error,
    },
  ];

  return (
    <React.Fragment>
      <div className="page-content Table">
        <Container fluid className="px-4">
          <Row>
            <Col xl={12} md={12}>
              {tableData.map((table, index) => (
                <Card key={index} className="shadow-lg bg-white rounded">
                  <CardHeader className="align-items-center d-flex">
                    <h5 className="card-title mb-0 fw-bold fs-4 flex-grow-1">
                      Recently Joined Customers
                    </h5>
                  </CardHeader>
                  <CardBody>
                    <BaseTable
                      columns={table.columns}
                      data={table.data}
                      selectedCustomers={table.selectedCustomers}
                      handleSelectAll={table.handleSelectAll}
                      handleSelectCustomer={table.handleSelectCustomer}
                      error={table.error}
                    />
                  </CardBody>
                </Card>
              ))}
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default RecentlyJoinedCustomers;
