import React from "react";
import { Link } from "react-router-dom";
import { Row, Col } from "reactstrap";

const Pagination = ({
  totalPages,
  currentPage,
  setCurrentPage,
  rowsPerPage,
  handleRowsPerPageChange,
}) => {
  if (totalPages <= 1) return null;

  const handleClick = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <React.Fragment>
      <Row className="align-items-center justify-content-between mb-4">
        {/* Left side: Rows per page */}
        <Col xs="auto">
          <div className="d-flex align-items-center">
            <label htmlFor="rowsPerPage" className="me-2 fw-bold">
              Rows per page:
            </label>
            <select
              id="rowsPerPage"
              className="form-select w-auto"
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </Col>

        {/* Right side: Pagination */}
        <Col xs="auto">
          <ul className="pagination pagination-separated mb-0">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <Link
                className="page-link"
                onClick={() => handleClick(currentPage - 1)}
              >
                Previous
              </Link>
            </li>

            <li className="page-item active">
              <span className="page-link">{currentPage}</span>
            </li>

            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <Link
                className="page-link"
                onClick={() => handleClick(currentPage + 1)}
              >
                Next
              </Link>
            </li>
          </ul>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default Pagination;
