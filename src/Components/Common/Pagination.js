import React from "react";
import { Link } from "react-router-dom";
import "./Pagination1.css";
const Pagination = ({ totalPages, currentPage, setCurrentPage }) => {
  if (totalPages <= 1) return null;

  const handleClick = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 3;
    let startPage, endPage;

    if (currentPage <= 2) {
      startPage = 1;
      endPage = Math.min(3, totalPages);
    } else if (currentPage >= totalPages - 1) {
      startPage = Math.max(totalPages - 2, 1);
      endPage = totalPages;
    } else {
      startPage = currentPage - 1;
      endPage = currentPage + 1;
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <li
          key={i}
          className={`page-item ${currentPage === i ? "active" : ""}`}
        >
          <Link className="page-link" onClick={() => handleClick(i)}>
            {i}
          </Link>
        </li>
      );
    }

    if (startPage > 1) {
      pages.unshift(
        <li key="start-ellipsis" className="page-item disabled">
          <span className="page-link">...</span>
        </li>
      );
      pages.unshift(
        <li
          key={1}
          className={`page-item ${currentPage === 1 ? "active" : ""}`}
        >
          <Link className="page-link" onClick={() => handleClick(1)}>
            1
          </Link>
        </li>
      );
    }

    if (endPage < totalPages) {
      pages.push(
        <li key="end-ellipsis" className="page-item disabled">
          <span className="page-link">...</span>
        </li>
      );
      pages.push(
        <li
          key={totalPages}
          className={`page-item ${currentPage === totalPages ? "active" : ""}`}
        >
          <Link className="page-link" onClick={() => handleClick(totalPages)}>
            {totalPages}
          </Link>
        </li>
      );
    }

    return pages;
  };

  return (
    <ul className="pagination pagination-separated mb-0">
      <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
        <span
          className={`page-link ${currentPage === 1 ? "disabled-link" : ""}`}
          onClick={() => {
            if (currentPage !== 1) handleClick(currentPage - 1);
          }}
        >
          Previous
        </span>
      </li>

      {renderPageNumbers()}

      <li
        className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
      >
        <span
          className={`page-link ${
            currentPage === totalPages ? "disabled-link" : ""
          }`}
          onClick={() => {
            if (currentPage !== totalPages) handleClick(currentPage + 1);
          }}
        >
          Next
        </span>
      </li>
    </ul>
  );
};

export default Pagination;
