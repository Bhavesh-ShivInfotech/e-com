import React from "react";

const BaseTable = ({
  columns,
  data,
  selectedCustomers,
  handleSelectAll,
  handleSelectCustomer,
  error,
}) => {
  const formatDate = (date) => {
    if (!date) return "N/A";
    const formattedDate = new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return formattedDate;
  };

  // Add checks for undefined or null props
  const safeColumns = columns || [];
  const safeData = data || [];

  return (
    <div className="table-responsive ">
      <table className="table align-middle table-nowrap table-striped-columns ">
        <thead className="table-light">
          <tr>
            {safeColumns.map((column) => (
              <th key={column} scope="col">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {error ? (
            <tr>
              <td
                colSpan={safeColumns.length + 1}
                className="text-danger text-center"
              >
                {error}
              </td>
            </tr>
          ) : safeData.length > 0 ? (
            safeData.map((row) => (
              <tr key={row.id}>
                {safeColumns.map((column) => (
                  <td key={column}>
                    {column === "Date of Birth"
                      ? formatDate(row.dob)
                      : column === "Created At"
                      ? formatDate(row.created_at)
                      : row[column.toLowerCase().replace(/\s/g, "_")] || "N/A"}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={safeColumns.length + 1}
                className="text-muted text-center"
              >
                No data found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BaseTable;
