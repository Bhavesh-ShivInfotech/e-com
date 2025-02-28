import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { Table } from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const BaseTable = ({
  columns,
  data,
  selectedCustomers,
  handleSelectAll,
  handleSelectCustomer,
  onSelectRow,
  onSelectAll,
  getStatusClass,
  isLoading,
  error,
  sortColumn,
  sortDirection,
}) => {
  const formatDate = (date) => {
    if (!date) return "N/A";
    return moment(date).format("MMMM D, YYYY");
  };

  const safeColumns = columns || [];
  const safeData = data || [];

  const getSortIndicator = (columnKey, direction) => {
    if (sortColumn === columnKey && sortDirection === direction) {
      return direction === "asc" ? "▲" : "▼";
    }
    return direction === "asc" ? "△" : "▽";
  };
  return (
    <div className="table-responsive ">
      <Table
        responsive
        className="align-middle table-nowrap  table-striped-columns"
      >
        <thead className="table-light">
          <tr>
            {safeColumns.map((col) => (
              <th
                key={col.key || col}
                scope="col"
                onClick={col.onClick}
                style={{
                  cursor: col.sortable ? "pointer" : "default",
                  position: "relative",
                }}
              >
                {col.title || col}
                {col.sortable && (
                  <span
                    style={{
                      position: "absolute",
                      right: "5px",
                      top: "50%",
                      transform: "translateY(-50%)",
                    }}
                  >
                    <span
                      onClick={() => col.onClick(col.key, "asc")}
                      style={{ cursor: "pointer", marginRight: "3px" }}
                    >
                      {getSortIndicator(col.key, "asc")}
                    </span>
                    <span
                      onClick={() => col.onClick(col.key, "desc")}
                      style={{ cursor: "pointer" }}
                    >
                      {getSortIndicator(col.key, "desc")}
                    </span>
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {error ? (
            <tr>
              <td
                colSpan={safeColumns.length}
                className="text-danger text-center"
              >
                {error}
              </td>
            </tr>
          ) : safeData.length > 0 ? (
            safeData.map((row) => (
              <tr key={row?.id}>
                {safeColumns.map((col) => (
                  <td key={col.key || col}>
                    {col.render ? (
                      col.render(row[col.key], row)
                    ) : col.key === "status" ? (
                      <span
                        className={
                          getStatusClass ? getStatusClass(row[col.key]) : ""
                        }
                      >
                        {row[col.key]}
                      </span>
                    ) : col === "Date of Birth" ? (
                      formatDate(row.dob)
                    ) : col === "Created At" ? (
                      formatDate(row.created_at)
                    ) : (
                      row[col.key || col.toLowerCase().replace(/\s/g, "_")] ||
                      "--"
                    )}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={safeColumns.length}
                className="text-muted text-center"
              >
                No data found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

BaseTable.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  selectedCustomers: PropTypes.array,
  selectedRows: PropTypes.array,
  handleSelectAll: PropTypes.func,
  handleSelectCustomer: PropTypes.func,
  onSelectRow: PropTypes.func,
  onSelectAll: PropTypes.func,
  getStatusClass: PropTypes.func,
  isLoading: PropTypes.bool,
  error: PropTypes.string,
  sortColumn: PropTypes.string,
  sortDirection: PropTypes.string,
  currentPage: PropTypes.number.isRequired,
};

BaseTable.defaultProps = {
  isLoading: false,
  error: null,
  selectedCustomers: [],
  selectedRows: [],
  sortColumn: null,
  sortDirection: "asc",
};

export default BaseTable;
