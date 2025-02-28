import React, { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Col, Container, Row } from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import BaseTable from "./BaseTable";
import Pagination from "../../Components/Common/Pagination";
import PreviewCardHeader from "../../Components/Common/PreviewCardHeader";
import "./Table.css";
const ListOfOrder = ({ data }) => {
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedOrders(data.map((order) => order.order_id));
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

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const filteredCustomers = data.filter((customer) => customer.userName);
  const totalPages = Math.ceil(filteredCustomers.length / rowsPerPage);

  const sortedCategories = [...filteredCustomers].sort((a, b) => {
    if (sortColumn) {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }
    }
    return 0;
  });

  const currentRows = filteredCustomers.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalRows = sortedCategories.length;
  const startRow = (currentPage - 1) * rowsPerPage + 1;
  const endRow = Math.min(currentPage * rowsPerPage, totalRows);

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

  const formatCurrency = (value) => {
    return `₹${value}`;
  };
  const columns = [
    { key: "order_id", title: "Order ID" },
    { key: "userName", title: "First Name" },
    {
      key: "lastName",
      title: "Last Name",
    },
    { key: "email", title: "Email ID" },
    {
      key: "total_amount",
      title: "Total Amount",
      render: (value) => formatCurrency(value),
    },
    { key: "status", title: "Status" },
    { key: "discount", title: "Discount" },
    { key: "tax", title: "Tax", render: (value) => formatCurrency(value) },
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
                  />
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="text-muted">
                      Showing {startRow} to {endRow} of {totalRows} results
                    </div>
                    <div className="d-flex justify-content-sm-end">
                      <Pagination
                        totalPages={totalPages}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                      />
                    </div>
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
