import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { Card, CardBody, CardHeader, Col, Container, Row } from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import BaseTable from "./BaseTable2";
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
          <Row>
            <Col xl={12} md={12}>
              <Card className="shadow-lg bg-white rounded">
                <CardHeader className="align-items-center d-flex">
                  <h5 className="card-title mb-0 fw-bold fs-4 flex-grow-1">
                    List Of Orders
                  </h5>
                </CardHeader>
                <CardBody>
                  <BaseTable
                    columns={columns}
                    data={currentRows}
                    selectedRows={selectedOrders}
                    onSelectRow={handleSelectOrder}
                    onSelectAll={handleSelectAll}
                    isLoading={loading}
                    error={error}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
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
