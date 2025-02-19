import React, { useEffect, useState } from "react";
import { Card, CardBody, Col, Container, Row, Table } from "reactstrap";
import API from "../../services/api";
import BaseTable from "./BaseTable";
import PreviewCardHeader from "../../Components/Common/PreviewCardHeader";
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
      <div className="page-content Table" style={{ paddingBottom: "0" }}>
        <Container fluid className="px-4">
          <Row className="justify-content-center">
            <Col xl={12} md={12}>
              {tableData.map((table, index) => (
                <Card key={index}>
                  <PreviewCardHeader title="Recently Joined Customers" />
                  <CardBody>
                    <Table
                      className="table-nowrap align-middle mb-0"
                      responsive
                    >
                      <BaseTable
                        columns={table.columns}
                        data={table.data}
                        selectedCustomers={table.selectedCustomers}
                        handleSelectAll={table.handleSelectAll}
                        handleSelectCustomer={table.handleSelectCustomer}
                        error={table.error}
                      />
                    </Table>
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
