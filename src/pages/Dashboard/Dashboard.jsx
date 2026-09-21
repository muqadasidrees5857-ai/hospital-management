import React, { useState, useEffect } from "react";
import {
  Users,
  UserCheck,
  Calendar,
  DollarSign,
  Building2,
  Clock,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import StatCard from "../../components/common/StatCard";
import Badge from "../../components/common/Badge";
import SkeletonTable from "../../components/common/LoadingSkeleton";
import { reportService } from "../../services/api";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const result = await reportService.getDashboardStats();
        setData(result);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <SkeletonTable rows={4} cols={4} />;
  }

  const summary = data?.summary || {};

  return (
    <div>
      {/* STATS ROW */}
      <div className="stats-grid">
        <StatCard
          title="Total Patients"
          value={summary.totalPatients || 0}
          subtext="+12% from last month"
          icon={Users}
          colorClass="stat-icon-blue"
        />
        <StatCard
          title="Active Doctors"
          value={summary.totalDoctors || 0}
          subtext={`${summary.totalDepartments || 0} Departments`}
          icon={UserCheck}
          colorClass="stat-icon-teal"
        />
        <StatCard
          title="Today's Appointments"
          value={summary.todaysAppointments || 0}
          subtext={`${summary.pendingAppointments || 0} Pending`}
          icon={Calendar}
          colorClass="stat-icon-amber"
        />
        <StatCard
          title="Total Revenue"
          value={`$${(summary.totalRevenue || 0).toLocaleString()}`}
          subtext={`+$${(summary.pendingRevenue || 0).toLocaleString()} Pending`}
          icon={DollarSign}
          colorClass="stat-icon-green"
        />
      </div>

      {/* CHARTS ROW */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
          gap: "24px",
          marginBottom: "32px",
        }}
      >
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "16px",
            padding: "24px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <div>
              <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a" }}>Monthly Revenue Overview</h3>
              <p style={{ fontSize: "12px", color: "#64748b" }}>Financial growth trends & consultations</p>
            </div>
            <TrendingUp size={20} style={{ color: "#0d9488" }} />
          </div>
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.monthlyRevenue || []}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#0d9488" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "16px",
            padding: "24px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <div>
              <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a" }}>Department Doctors Allocation</h3>
              <p style={{ fontSize: "12px", color: "#64748b" }}>Specialist staff per department</p>
            </div>
            <Building2 size={20} style={{ color: "#0284c7" }} />
          </div>
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.departmentDistribution || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip />
                <Bar dataKey="doctors" fill="#0284c7" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* TABLES ROW */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
          gap: "24px",
        }}
      >
        {/* RECENT PATIENTS */}
        <div className="table-card-container">
          <div
            style={{
              padding: "20px 24px",
              display: "flex",
              justifyConstraint: "space-between",
              alignItems: "center",
              borderBottom: "1px solid #e2e8f0",
            }}
          >
            <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a" }}>Recent Patients</h3>
            <Link to="/patients" className="btn-secondary-custom" style={{ padding: "6px 12px", fontSize: "12px", marginLeft: "auto" }}>
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Age/Gender</th>
                <th>Blood</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {(data?.recentPatients || []).map((p) => (
                <tr key={p._id}>
                  <td>
                    <div className="person-cell">
                      <div className="avatar-circle">{p.name.charAt(0)}</div>
                      <div className="person-info">
                        <h4>{p.name}</h4>
                        <p>{p.patientId}</p>
                      </div>
                    </div>
                  </td>
                  <td>{p.age} Yrs / {p.gender}</td>
                  <td><span className="badge-pill badge-blue">{p.bloodGroup}</span></td>
                  <td><Badge status={p.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* UPCOMING APPOINTMENTS */}
        <div className="table-card-container">
          <div
            style={{
              padding: "20px 24px",
              display: "flex",
              alignItems: "center",
              borderBottom: "1px solid #e2e8f0",
            }}
          >
            <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a" }}>Upcoming Schedule</h3>
            <Link to="/appointments" className="btn-secondary-custom" style={{ padding: "6px 12px", fontSize: "12px", marginLeft: "auto" }}>
              Manage <ArrowRight size={14} />
            </Link>
          </div>
          <div style={{ padding: "16px 24px" }}>
            {(data?.upcomingAppointments || []).map((apt) => (
              <div
                key={apt._id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 0",
                  borderBottom: "1px dashed #e2e8f0",
                }}
              >
                <div>
                  <h4 style={{ fontSize: "14px", fontWeight: "600", color: "#0f172a" }}>
                    {apt.patient?.name || "Patient"}
                  </h4>
                  <p style={{ fontSize: "12px", color: "#64748b" }}>
                    With {apt.doctor?.name || "Doctor"} • {apt.reason}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", fontWeight: "600", color: "#0d9488" }}>
                    <Clock size={14} /> {apt.timeSlot}
                  </div>
                  <span style={{ fontSize: "11px", color: "#94a3b8" }}>{apt.appointmentDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
