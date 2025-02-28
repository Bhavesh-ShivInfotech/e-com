import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Spinner,
} from "react-bootstrap";
import Layout from "../../Layouts";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Report1.css";
import { fetchsales, fetchpurchase } from "../../services/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BaseTable from "../Table/BaseTable";
import Pagination from "../../Components/Common/Pagination";

const Report = () => {
  const [reportType, setReportType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("");
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (reportType) {
      fetchReportData();
    }
  }, [reportType]);

  const fetchReportData = async () => {
    setLoading(true);
    setError("");
    try {
      const response =
        reportType === "Sales" ? await fetchsales() : await fetchpurchase();
      setReportData(response?.data?.product || response?.data || []);
      toast.success(response.message);
    } catch (error) {
      setError(error.message || "An error occurred");
      toast.error(error.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchReportData();
  };

  const currentItems = reportData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const columns =
    reportType === "Sales"
      ? [
          { key: "noOfOrder", title: "Order" },
          { key: "noOfProduct", title: "Product" },
          { key: "tax", title: "Tax" },
          { key: "total", title: "Total" },
        ]
      : [
          { key: "name", title: "Name" },
          { key: "quantity", title: "Quantity" },
          { key: "price", title: "Price" },
          { key: "total", title: "Total" },
        ];

  return (
    <Layout>
      <div className="page-content">
        <Container fluid className="px-4 mb-4 addproduct-container">
          <Row className="align-items-center addproduct-title">
            <Col>
              <h2>Report</h2>
            </Col>
            <Col className="text-end">
              <Button variant="secondary">Back</Button>
            </Col>
          </Row>
          <Row>
            <Col xl={12} md={12}>
              <Card>
                <Card.Header>
                  <Form.Group controlId="reportType">
                    <Form.Label>Select Report Type</Form.Label>
                    <Form.Select
                      value={reportType}
                      onChange={(e) => setReportType(e.target.value)}
                    >
                      <option value="">Select a report type</option>
                      <option value="Sales">Sales Report</option>
                      <option value="Purchase">Purchase Report</option>
                    </Form.Select>
                  </Form.Group>
                </Card.Header>
              </Card>

              {reportType && (
                <Card className="mt-3">
                  <Card.Body>
                    <Form onSubmit={handleSubmit}>
                      <Row className="align-items-center">
                        <Col>
                          <h3 className="mb-3">Filter:</h3>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={reportType === "Sales" ? 6 : 4}>
                          <Form.Group controlId="startDate">
                            <Form.Label>Start Date</Form.Label>
                            <Form.Control
                              type="date"
                              value={startDate}
                              onChange={(e) => setStartDate(e.target.value)}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={reportType === "Sales" ? 6 : 4}>
                          <Form.Group controlId="endDate">
                            <Form.Label>End Date</Form.Label>
                            <Form.Control
                              type="date"
                              value={endDate}
                              onChange={(e) => setEndDate(e.target.value)}
                            />
                          </Form.Group>
                        </Col>
                        {reportType === "purchase" && (
                          <Col md={4}>
                            <Form.Group>
                              <Form.Label>Status</Form.Label>
                              <Form.Select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                              >
                                <option value="">Select a status</option>
                                <option value="true">True</option>
                                <option value="false">False</option>
                              </Form.Select>
                            </Form.Group>
                          </Col>
                        )}
                      </Row>
                      <Button
                        variant="primary"
                        type="submit"
                        className="mt-3 mb-3"
                        disabled={loading}
                      >
                        {loading ? (
                          <Spinner size="sm" animation="border" />
                        ) : (
                          "Generate Report"
                        )}
                      </Button>
                    </Form>

                    {error && <p className="text-danger mt-3">{error}</p>}

                    {loading ? (
                      <div className="text-center mt-3">
                        <Spinner animation="border" />
                      </div>
                    ) : reportData.length > 0 ? (
                      <>
                        <BaseTable
                          data={currentItems}
                          columns={columns}
                          reportType={reportType}
                        />
                        <Pagination
                          totalItems={reportData.length}
                          itemsPerPage={itemsPerPage}
                          currentPage={currentPage}
                          setCurrentPage={setCurrentPage}
                        />
                      </>
                    ) : (
                      <p className="text-muted mt-3">No data available.</p>
                    )}
                  </Card.Body>
                </Card>
              )}
            </Col>
          </Row>
        </Container>
      </div>
    </Layout>
  );
};

export default Report;
