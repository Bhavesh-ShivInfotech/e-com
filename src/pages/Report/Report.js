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
import Layout from "../../Layouts/index";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Report1.css";

const Report = () => {
  const [reportType, setReportType] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (reportType && startDate && endDate) {
      fetchData();
    }
  }, [reportType, startDate, endDate]);

  const fetchData = async () => {
    setLoading(true);
    setError("");

    try {
      let url =
        reportType === "Sales"
          ? "/api/admin/salesReport"
          : "/api/report/productPurchasedReport";

      const response = await fetch(url, {
        method: "POST",
        headers: {},
        body: JSON.stringify({ startDate, endDate }),
      });

      if (!response.ok) throw new Error("Failed to fetch data");

      const data = await response.json();
      setReportData(data);
    } catch (error) {
      setError("Error fetching data. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <React.Fragment>
      <Layout>
        <div className="page-content">
          <Container fluid className="px-4 mb-4 addproduct-container">
            <Row className="align-items-center addproduct-title">
              <Col>
                <h2 className="mb-0">Report</h2>
              </Col>
              <Col className="text-end">
                <Button variant="secondary">Back</Button>
              </Col>
            </Row>

            <Row>
              <Col xl={12} md={12}>
                <Card>
                  <Card.Body>
                    <Form.Group controlId="reportType">
                      <Form.Label>Select Report Type</Form.Label>
                      <Form.Select
                        value={reportType || ""}
                        onChange={(e) => setReportType(e.target.value)}
                      >
                        <option value="">Select a report type</option>
                        <option value="Sales">Sales Report</option>
                        <option value="Purchase">Purchase Report</option>
                      </Form.Select>
                    </Form.Group>
                  </Card.Body>
                </Card>
                {reportType && (
                  <Card className="mt-3">
                    <Card.Body>
                      <Form>
                        <Row>
                          <Col md={6}>
                            <Form.Group controlId="startDate">
                              <Form.Label>Start Date</Form.Label>
                              <Form.Control
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                required
                              />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group controlId="endDate">
                              <Form.Label>End Date</Form.Label>
                              <Form.Control
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                required
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                      </Form>

                      {error && <p className="text-danger mt-3">{error}</p>}

                      {loading ? (
                        <div className="text-center mt-3">
                          <Spinner animation="border" />
                        </div>
                      ) : reportData.length > 0 ? (
                        <div className="mt-3">
                          <h3>
                            {reportType === "Sales"
                              ? "Sales Report"
                              : "Purchase Report"}
                          </h3>
                          <table className="table table-bordered">
                            <thead>
                              <tr>
                                {reportType === "Sales" ? (
                                  <>
                                    <th>Order</th>
                                    <th>Product</th>
                                    <th>Total</th>
                                  </>
                                ) : (
                                  <>
                                    <th>Name</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                    <th>Total</th>
                                  </>
                                )}
                              </tr>
                            </thead>
                            <tbody>
                              {reportData.map((row, index) => (
                                <tr key={index}>
                                  {reportType === "Sales" ? (
                                    <>
                                      <td>{row.order}</td>
                                      <td>{row.product}</td>
                                      <td>{row.total}</td>
                                    </>
                                  ) : (
                                    <>
                                      <td>{row.name}</td>
                                      <td>{row.quantity}</td>
                                      <td>{row.price}</td>
                                      <td>{row.total}</td>
                                    </>
                                  )}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
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
    </React.Fragment>
  );
};

export default Report;
