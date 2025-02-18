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
              <td colSpan={columns.length} className="text-danger text-center">
                {error}
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
              <td colSpan={columns.length} className="text-muted text-center">
                No data available
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
  selectedRows: PropTypes.array.isRequired,
  onSelectRow: PropTypes.func.isRequired,
  onSelectAll: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  error: PropTypes.string,
  rowsPerPage: PropTypes.number.isRequired,
  onRowsPerPageChange: PropTypes.func.isRequired,
};

BaseTable.defaultProps = {
  isLoading: false,
  error: null,
};

export default BaseTable;
