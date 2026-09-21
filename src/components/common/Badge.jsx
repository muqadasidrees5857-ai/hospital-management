import React from "react";

const Badge = ({ status, variant }) => {
  let colorClass = "badge-gray";

  const lower = (status || "").toLowerCase();

  if (variant) {
    colorClass = `badge-${variant}`;
  } else if (
    ["active", "paid", "completed", "available", "admitted"].includes(lower)
  ) {
    colorClass = "badge-green";
  } else if (
    ["scheduled", "pending", "outpatient", "on leave"].includes(lower)
  ) {
    colorClass = "badge-amber";
  } else if (["cancelled", "discharged", "overdue", "busy", "resigned"].includes(lower)) {
    colorClass = "badge-red";
  } else if (["in-progress"].includes(lower)) {
    colorClass = "badge-blue";
  }

  return <span className={`badge-pill ${colorClass}`}>{status}</span>;
};

export default Badge;
