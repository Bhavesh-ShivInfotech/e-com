import React from "react";
import { FaUserEdit, FaTrashAlt } from "react-icons/fa"; // Correct icons

const CategoryCard = ({ category }) => {
  return (
    <div className="col-md-4 mb-4">
      <div className="card shadow-lg">
        <img
          src={category.imageUrl || "https://via.placeholder.com/150"}
          alt={category.name}
          className="card-img-top"
        />
        <div className="card-body">
          <h5 className="card-title">{category.name}</h5>
          <p className="card-text">{category.description}</p>
          {/* Action buttons with proper spacing */}
          <div className="action d-flex justify-content-center">
            <button className="btn btn-warning btn-sm mx-4">
              <FaUserEdit />
            </button>
            <button className="btn btn-danger btn-sm mx-1">
              <FaTrashAlt />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
