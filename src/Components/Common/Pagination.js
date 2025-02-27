import React from "react";
import { Link } from "react-router-dom";

const Pagination = ({ totalPages, currentPage, setCurrentPage }) => {
  if (totalPages <= 1) return null;

  const handleClick = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
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
        className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
      >
        <Link
          className="page-link"
          onClick={() => handleClick(currentPage + 1)}
        >
          Next
        </Link>
      </li>
    </ul>
  );
};

export default Pagination;
