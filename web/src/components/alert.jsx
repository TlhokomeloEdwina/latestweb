/**
 * Component to display alerts
 */

import React from "react";

const Alert = ({ type, message, onClick }) => {
  return (
    <div
      className={`p-4 mb-4 cursor-pointer rounded shadow ${
        type === "Basic Alert"
          ? "bg-blue-100 text-blue-700"
          : "bg-red-100 text-red-700"
      }`}
      onClick={onClick}
    >
      {message}
    </div>
  );
};

export default Alert;
