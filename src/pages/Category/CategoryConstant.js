import ImageError from "../../assets/images/auth-one-bg.jpg";
import "./Category.css";
export const CATEGORY_COLUMNS = (
  handleSort,
  handleEditClick,
  handleDeleteClick
) => [
  {
    key: "id",
    title: "ID",
    sortable: true,
    onClick: () => handleSort("id"),
  },
  {
    key: "name",
    title: "Name",
    sortable: true,
    onClick: () => handleSort("name"),
  },
  {
    key: "description",
    title: "Description",
    sortable: true,
    onClick: () => handleSort("description"),
  },
  {
    key: "image",
    title: "Image",
    render: (image) => (
      <img
        src={image || ImageError}
        alt="product"
        className="img-thumbnail onerror-img"
        onError={(e) => (e.target.src = ImageError)}
      />
    ),
  },
  {
    key: "actions",
    title: "Action",
    render: (_, row) => (
      <div className="d-flex gap-2">
        <button
          className="btn btn-sm btn-success edit-item-btn"
          onClick={() => handleEditClick(row)}
        >
          Edit
        </button>
        <button
          className="btn btn-sm btn-danger remove-item-btn"
          onClick={() => handleDeleteClick(row)}
        >
          Remove
        </button>
      </div>
    ),
  },
];
