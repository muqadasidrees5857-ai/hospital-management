import React from "react";

const StatCard = ({ title, value, subtext, icon: Icon, colorClass = "stat-icon-teal" }) => {
  return (
    <div className="stat-card">
      <div className={`stat-icon-wrapper ${colorClass}`}>
        {Icon && <Icon size={24} />}
      </div>
      <div className="stat-details">
        <p>{title}</p>
        <h3>{value}</h3>
        {subtext && <span className="sub-text">{subtext}</span>}
      </div>
    </div>
  );
};

export default StatCard;
