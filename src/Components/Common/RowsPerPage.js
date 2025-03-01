import React from "react";

const RowsPerPage = ({ rowsPerPage, handleRowsPerPageChange }) => {
  return (
    <div className="d-flex align-items-center">
      <label htmlFor="rowsPerPage" className="me-2 fw-bold">
        Items per page:
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
  );
};

export default RowsPerPage;
