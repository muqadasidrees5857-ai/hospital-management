import React, { useState, useEffect } from "react";
import { BarChart3, TrendingUp, Users, DollarSign, Activity } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import StatCard from "../../components/common/StatCard";
import SkeletonTable from "../../components/common/LoadingSkeleton";
import { reportService } from "../../services/api";

const COLORS = ["#0d9488", "#0284c7", "#d97706", "#9333ea", "#e11d48"];

const Reports = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const result = await reportService.getDashboardStats();
        setData(result);
      } catch (err) {
        console.error("Reports fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) return <SkeletonTable rows={4} cols={4} />;

  const summary = data?.summary || {};

  const patientDemographics = [
    { name: "Male", value: 55 },
    { name: "Female", value: 42 },
    { name: "Other", value: 3 },
  ];

  return (
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <h1>Analytics & Reports</h1>
          <p>Financial revenue performance, patient demographics, and department metrics</p>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard
          title="Gross Revenue"
          value={`$${(summary.totalRevenue || 0).toLocaleString()}`}
          subtext="Total collected payments"
          icon={DollarSign}
          colorClass="stat-icon-green"
        />
        <StatCard
          title="Patient Growth"
          value={summary.totalPatients || 0}
          subtext="Active patient base"
          icon={Users}
          colorClass="stat-icon-blue"
        />
        <StatCard
          title="Appointments Completed"
          value={summary.completedAppointments || 0}
          subtext={`${summary.pendingAppointments || 0} Scheduled`}
          icon={Activity}
          colorClass="stat-icon-teal"
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
          gap: "24px",
          marginBottom: "32px",
        }}
      >
        {/* REVENUE GROWTH GRAPH */}
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "16px",
            padding: "24px",
          }}
        >
          <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", marginBottom: "16px" }}>
            Monthly Revenue Growth ($)
          </h3>
          <div style={{ width: "100%", height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.monthlyRevenue || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#0d9488" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PATIENT GENDER DEMOGRAPHICS */}
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "16px",
            padding: "24px",
          }}
        >
          <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", marginBottom: "16px" }}>
            Patient Gender Distribution
          </h3>
          <div style={{ width: "100%", height: 280, display: "flex", justifyContent: "center" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={patientDemographics} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value" label>
                  {patientDemographics.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
