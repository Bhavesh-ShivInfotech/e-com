import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import Layout from "../../Layouts";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Report1.css";
import { fetchsales, fetchpurchase } from "../../services/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BaseTable from "../Table/BaseTable";
import Pagination from "../../Components/Common/Pagination";
import RowsPerPage from "../../Components/Common/RowsPerPage";
import { ResponseStatusEnum } from "../../Components/constants/httpStatusCodes";
import Spinner from "../../Components/Common/Spinner";
import { SALES_COLUMNS, PURCHASE_COLUMNS } from "./ReportConstants";
const REPORT_MODULE = {
  REPORT_TITLE: "Report",
  REPORT_PURCHASE: "Purchase",
  REPORT_SALES: "Sales",
  STATUS_TRUE: "true",
  ORDER_ASC: "asc",
  ORDER_DESC: "desc",
  STRING_VALUE: "string",
  CONTROL_ID: "reportType",
  START_DATE: "startDate",
  END_DATE: "endDate",
  GENERATE_REPORT: "Generate Report",
  TRUE: "true",
  FALSE: "false",
  MESSAGE: "End date cannot be a future date.",
  DATE: "date",
};
const Report = () => {
  document.title = REPORT_MODULE.REPORT_TITLE;
  const [reportType, setReportType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("");
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState(REPORT_MODULE.ORDER_ASC);
  useEffect(() => {
    if (reportType) {
      fetchReportData();
    }
  }, [reportType]);

  const fetchReportData = async () => {
    setLoading(true);
    setError("");
    try {
      const payload = {};
      if (startDate) {
        payload.startDate = startDate;
      }
      if (endDate) {
        payload.endDate = endDate;
      }
      if (reportType === REPORT_MODULE.REPORT_PURCHASE && status !== "") {
        payload.status = status === REPORT_MODULE.STATUS_TRUE;
      }
      const response =
        reportType === REPORT_MODULE.REPORT_SALES
          ? await fetchsales(payload)
          : await fetchpurchase(payload);

      if (response?.status === ResponseStatusEnum.SUCCESS) {
        setReportData(response.data.product || response.data || []);
        toast.success(response.message);
      } else {
        setReportData([]);
        toast.error(response.message);
      }
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    fetchReportData();
  };

  const validateEndDate = (date) => {
    const today = new Date().toISOString().split("T")[0];
    return date <= today;
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(
        sortDirection === REPORT_MODULE.ORDER_ASC
          ? REPORT_MODULE.ORDER_DESC
          : REPORT_MODULE.ORDER_ASC
      );
    } else {
      setSortColumn(column);
      setSortDirection(REPORT_MODULE.ORDER_ASC);
    }
  };

  const sortedReportData = [...reportData].sort((a, b) => {
    if (sortColumn) {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (
        typeof aValue === REPORT_MODULE.STRING_VALUE &&
        typeof bValue === REPORT_MODULE.STRING_VALUE
      ) {
        return sortDirection === REPORT_MODULE.ORDER_ASC
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        return sortDirection === REPORT_MODULE.ORDER_ASC
          ? aValue - bValue
          : bValue - aValue;
      }
    }
    return 0;
  });

  const totalRows = reportData.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const currentItems = sortedReportData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const formatCurrency = (value) => {
    return `₹${value}`;
  };

  const columns =
    reportType === REPORT_MODULE.REPORT_SALES
      ? SALES_COLUMNS(handleSort, formatCurrency)
      : PURCHASE_COLUMNS(handleSort, formatCurrency);

  return (
    <Layout>
      {loading && <Spinner />}
      <div className="page-content">
        <Container fluid className="px-4 mb-4 addproduct-container">
          <Row className="align-items-center addreport-title">
            <Col>
              <h2>Report</h2>
            </Col>
          </Row>
          <Row>
            <Col xl={12} md={12}>
              <Card>
                <Card.Header>
                  <Form.Group controlId={REPORT_MODULE.CONTROL_ID}>
                    <Form.Label>Select Report Type</Form.Label>
                    <Form.Select
                      value={reportType}
                      onChange={(e) => setReportType(e.target.value)}
                    >
                      <option value="">Select a report type</option>
                      <option value={REPORT_MODULE.REPORT_SALES}>
                        Sales Report
                      </option>
                      <option value={REPORT_MODULE.REPORT_PURCHASE}>
                        Purchase Report
                      </option>
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
                        <Col
                          md={reportType === REPORT_MODULE.REPORT_SALES ? 6 : 4}
                        >
                          <Form.Group controlId={REPORT_MODULE.START_DATE}>
                            <Form.Label>Start Date</Form.Label>
                            <Form.Control
                              type={REPORT_MODULE.DATE}
                              value={startDate}
                              onChange={(e) => setStartDate(e.target.value)}
                              max={new Date().toISOString().split("T")[0]}
                            />
                          </Form.Group>
                        </Col>
                        <Col
                          md={reportType === REPORT_MODULE.REPORT_SALES ? 6 : 4}
                        >
                          <Form.Group controlId={REPORT_MODULE.END_DATE}>
                            <Form.Label>End Date</Form.Label>
                            <Form.Control
                              type={REPORT_MODULE.DATE}
                              value={endDate}
                              onChange={(e) => {
                                if (validateEndDate(e.target.value)) {
                                  setEndDate(e.target.value);
                                } else {
                                  toast.error(REPORT_MODULE.MESSAGE);
                                }
                              }}
                              max={new Date().toISOString().split("T")[0]}
                            />
                          </Form.Group>
                        </Col>
                        {reportType === REPORT_MODULE.REPORT_PURCHASE && (
                          <Col md={4}>
                            <Form.Group>
                              <Form.Label>Status</Form.Label>
                              <Form.Select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                              >
                                <option value="">Select a status</option>
                                <option value={REPORT_MODULE.TRUE}>True</option>
                                <option value={REPORT_MODULE.FALSE}>
                                  False
                                </option>
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
                          REPORT_MODULE.GENERATE_REPORT
                        )}
                      </Button>
                    </Form>

                    {error && <p className="text-danger mt-3">{error}</p>}

                    {reportData.length > 0 ? (
                      <>
                        <Row className="g-4 mb-3">
                          <Col className="col-sm-auto">
                            <RowsPerPage
                              rowsPerPage={rowsPerPage}
                              handleRowsPerPageChange={handleRowsPerPageChange}
                            />
                          </Col>
                        </Row>
                        <BaseTable
                          data={currentItems}
                          columns={columns}
                          reportType={reportType}
                          sortColumn={sortColumn}
                          sortDirection={sortDirection}
                        />
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="text-muted">
                            Showing {(currentPage - 1) * rowsPerPage + 1} to{" "}
                            {Math.min(currentPage * rowsPerPage, totalRows)} of{" "}
                            {totalRows} results
                          </div>
                          <div className="d-flex justify-content-sm-end">
                            <Pagination
                              totalPages={totalPages}
                              currentPage={currentPage}
                              setCurrentPage={setCurrentPage}
                            />
                          </div>
                        </div>
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
