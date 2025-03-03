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
        <option value={5}>5</option>
        <option value={15}>15</option>
        <option value={25}>25</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
      </select>
    </div>
  );
};

export default RowsPerPage;
