import React from "react";
import { Link } from "react-router-dom";
import { AlertCircle, Home } from "lucide-react";

const NotFound = () => {
  return (
    <div style={{ textAlign: "center", padding: "80px 20px" }}>
      <div
        style={{
          width: "64px",
          height: "64px",
          borderRadius: "50%",
          background: "#fee2e2",
          color: "#ef4444",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        <AlertCircle size={32} />
      </div>
      <h1 style={{ fontSize: "36px", fontWeight: "800", color: "#0f172a" }}>404 - Page Not Found</h1>
      <p style={{ fontSize: "14px", color: "#64748b", margin: "12px 0 24px" }}>
        The page or resource you are looking for does not exist or has been moved.
      </p>
      <Link to="/dashboard" className="btn-primary-custom" style={{ display: "inline-flex" }}>
        <Home size={18} /> Back to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
