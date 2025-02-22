import React from "react";
import { ClipLoader } from "react-spinners";

const Spinner = () => {
  return (
    <div className="spinner-container">
      <ClipLoader color="#007bff" size={50} />
    </div>
  );
};

export default Spinner;
