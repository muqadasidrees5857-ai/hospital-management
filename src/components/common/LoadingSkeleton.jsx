import React from "react";

export const SkeletonRow = ({ columns = 5 }) => {
  return (
    <tr>
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i}>
          <div className="skeleton-pulse" style={{ height: "20px", borderRadius: "4px" }} />
        </td>
      ))}
    </tr>
  );
};

export const SkeletonCard = () => {
  return (
    <div className="item-card" style={{ gap: "12px" }}>
      <div className="skeleton-pulse" style={{ height: "24px", width: "60%" }} />
      <div className="skeleton-pulse" style={{ height: "16px", width: "80%" }} />
      <div className="skeleton-pulse" style={{ height: "16px", width: "40%" }} />
      <div className="skeleton-pulse" style={{ height: "36px", marginTop: "12px" }} />
    </div>
  );
};

export const SkeletonTable = ({ rows = 5, cols = 5 }) => {
  return (
    <div className="table-card-container">
      <div style={{ padding: "16px 24px" }}>
        <div className="skeleton-pulse" style={{ height: "28px", width: "220px" }} />
      </div>
      <table className="custom-table">
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <SkeletonRow key={i} columns={cols} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SkeletonTable;
