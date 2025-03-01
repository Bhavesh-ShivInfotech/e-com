export const SALES_COLUMNS = (handleSort) => [
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
  { key: "tax", title: "Tax" },
  { key: "total", title: "Total" },
];

export const PURCHASE_COLUMNS = (handleSort) => [
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
  },
  { key: "total", title: "Total" },
];
