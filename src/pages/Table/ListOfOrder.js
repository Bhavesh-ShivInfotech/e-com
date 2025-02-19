import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { Card, CardBody, CardHeader, Col, Container, Row } from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import BaseTable from "./BaseTable2";
import Pagination from "../../Components/Common/Pagination";
import PreviewCardHeader from "../../Components/Common/PreviewCardHeader";
import "./Table.css";
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

  const currentRows = filteredCustomers.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "badge bg-danger";
      case "success":
      case "confirmed":
        return "badge bg-success";
      case "rejected":
      case "approve":
      case "failed":
        return "badge bg-warning";
      default:
        return "badge bg-secondary";
    }
  };

  const columns = [
    { key: "order_id", title: "Order ID" },
    { key: "userName", title: "First Name" },
    { key: "lastName", title: "Last Name" },
    { key: "email", title: "Email ID" },
    { key: "total_amount", title: "Total Amount" },
    { key: "status", title: "Status" },
    { key: "discount", title: "Discount" },
    { key: "tax", title: "Tax" },
  ];

  return (
    <React.Fragment>
      <div className="page-content Table">
        <Container fluid className="px-4">
          <Row className="justify-content-center">
            <Col xl={12} md={12}>
              <Card>
                <PreviewCardHeader title="List Of Orders" />
                <CardBody>
                  <BaseTable
                    columns={columns}
                    data={currentRows}
                    selectedRows={selectedOrders}
                    onSelectRow={handleSelectOrder}
                    onSelectAll={handleSelectAll}
                    getStatusClass={getStatusClass}
                    isLoading={loading}
                    error={error}
                  />
                  <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    rowsPerPage={rowsPerPage}
                    handleRowsPerPageChange={handleRowsPerPageChange}
                  />
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
