import React from "react";
import { Table, Button } from "reactstrap";

const BaseTable = ({ columns, data, actions }) => {
  return (
    <div className="table-responsive table-card mt-3 mb-1">
      <Table>
        <thead className="table-light">
          <tr>
            {columns.map((col) => (
              <th key={col.field}>{col.label}</th>
            ))}
            {actions.length > 0 && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, index) => (
              <tr key={index}>
                {columns.map((col) => (
                  <td key={col.field}>{row[col.field]}</td>
                ))}
                {actions.length > 0 && (
                  <td>
                    {actions.map((action, idx) => (
                      <Button
                        key={idx}
                        color={action.type}
                        size="sm"
                        className="me-2"
                        onClick={() => action.onClick(row)}
                      >
                        {action.label}
                      </Button>
                    ))}
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + 1} className="text-center">
                No data available.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default BaseTable;
