import React from "react";
import PropTypes from "prop-types";
import { Table } from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const BaseTable = ({
  columns,
  data,
  selectedRows,
  onSelectRow,
  onSelectAll,
  isLoading,
  error,
  rowsPerPage,
  onRowsPerPageChange,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <div className="table-responsive">
      <Table
        hover
        responsive
        className="align-middle table-nowrap table-striped-columns"
      >
        <thead className="table-light">
          <tr>
            {columns.map((col) => (
              <th scope="col" key={col.key}>
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {error ? (
            <tr>
              <td
                colSpan={columns.length + 1}
                className="text-danger text-center"
              >
                {error}
              </td>
            </tr>
          ) : isLoading ? (
            <tr>
              <td colSpan={columns.length + 1} className="text-center">
                Loading...
              </td>
            </tr>
          ) : data.length > 0 ? (
            data.map((row) => (
              <tr key={row.id}>
                {columns.map((col) => (
                  <td key={col.key}>{row[col.key]}</td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length + 1}
                className="text-muted text-center"
              >
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Pagination Controls */}
      <div className="d-flex justify-content-between mt-3">
        <button
          className="btn btn-secondary"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="btn btn-secondary"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {/* Rows per page selector */}
      <div className="mt-3">
        <label htmlFor="rowsPerPage" className="form-label">
          Rows per page:
        </label>
        <select
          id="rowsPerPage"
          className="form-select w-auto"
          value={rowsPerPage}
          onChange={onRowsPerPageChange}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>
    </div>
  );
};

BaseTable.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  selectedRows: PropTypes.array.isRequired,
  onSelectRow: PropTypes.func.isRequired,
  onSelectAll: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  error: PropTypes.string,
  rowsPerPage: PropTypes.number.isRequired,
  onRowsPerPageChange: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

BaseTable.defaultProps = {
  isLoading: false,
  error: null,
};

export default BaseTable;
