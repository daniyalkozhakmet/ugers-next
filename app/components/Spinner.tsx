import React from "react";

export const Spinner = () => {
  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{ marginTop: "-200px" }}
    >
      <div>
        <div
          className="spinner-border"
          role="status"
          style={{
            height: "150px",
            width: "150px",
          }}
        >
          <span className="sr-only"></span>
        </div>
      </div>
    </div>
  );
};

export default Spinner;
