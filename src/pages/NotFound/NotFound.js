import React from "react";
import { Link } from "react-router-dom";
import "./NotFound1.css";

const NotFound = () => {
  return (
    <div className="notfound-container">
      <h1 className="notfound-heading">404 - Page Not Found</h1>
      <p className="notfound-text">
        Oops! The Page you're looking for doesn't exist.
      </p>
      <Link to="/login" className="notfound-link">
        Go Back Login
      </Link>
    </div>
  );
};

export default NotFound;
