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
}) => {
  const formatDate = (date) => {
    if (!date) return "N/A";
    return moment(date).format("MMMM D, YYYY");
  };

  const safeColumns = columns || [];
  const safeData = data || [];

  return (
    <div className="table-responsive ">
      <Table
        responsive
        className="align-middle table-nowrap  table-striped-columns"
      >
        <thead className="table-light">
          <tr>
            {safeColumns.map((col) => (
              <th key={col.key || col} scope="col">
                {col.title || col}
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
                      "N/A"
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
};

BaseTable.defaultProps = {
  isLoading: false,
  error: null,
  selectedCustomers: [],
  selectedRows: [],
};

export default BaseTable;
