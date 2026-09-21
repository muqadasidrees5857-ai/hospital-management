import React from "react";
import { Link } from "react-router-dom";
import { ShieldAlert, Home } from "lucide-react";

const Unauthorized = () => {
  return (
    <div style={{ textAlign: "center", padding: "80px 20px" }}>
      <div
        style={{
          width: "64px",
          height: "64px",
          borderRadius: "50%",
          background: "#fef3c7",
          color: "#d97706",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        <ShieldAlert size={32} />
      </div>
      <h1 style={{ fontSize: "36px", fontWeight: "800", color: "#0f172a" }}>403 - Access Restricted</h1>
      <p style={{ fontSize: "14px", color: "#64748b", margin: "12px 0 24px" }}>
        Your account role does not have permission to view or manage this administrative section.
      </p>
      <Link to="/dashboard" className="btn-primary-custom" style={{ display: "inline-flex" }}>
        <Home size={18} /> Return to Main Dashboard
      </Link>
    </div>
  );
};

export default Unauthorized;
