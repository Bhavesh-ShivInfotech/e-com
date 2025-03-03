export const SALES_COLUMNS = (handleSort, formatCurrency) => [
  {
    key: "noOfOrder",
    title: "Order",
    sortable: true,
    onClick: () => handleSort("noOfOrder"),
  },
  {
    key: "noOfProduct",
    title: "Product",
    sortable: true,
    onClick: () => handleSort("noOfProduct"),
  },
  { key: "tax", title: "Tax", render: (value) => formatCurrency(value) },
  { key: "total", title: "Total", render: (value) => formatCurrency(value) },
];

export const PURCHASE_COLUMNS = (handleSort, formatCurrency) => [
  {
    key: "name",
    title: "Name",
    sortable: true,
    onClick: () => handleSort("name"),
  },
  {
    key: "quantity",
    title: "Quantity",
    sortable: true,
    onClick: () => handleSort("quantity"),
  },
  {
    key: "price",
    title: "Price",
    sortable: true,
    onClick: () => handleSort("price"),
    render: (value) => formatCurrency(value),
  },
  { key: "total", title: "Total", render: (value) => formatCurrency(value) },
];
