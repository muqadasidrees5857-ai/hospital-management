import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Activity, Lock, Mail, ArrowRight, CheckCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

const Login = () => {
  const [email, setEmail] = useState("admin@hospital.com");
  const [password, setPassword] = useState("admin123");
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(email, password);
      showSuccess("Successfully logged in! Welcome back.");
      navigate("/dashboard");
    } catch (err) {
      showError(err.message || "Login failed. Please check credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  const fillQuickLogin = (userEmail, userPass) => {
    setEmail(userEmail);
    setPassword(userPass);
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "440px",
        background: "#ffffff",
        borderRadius: "24px",
        padding: "36px 32px",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "28px" }}>
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "16px",
            background: "linear-gradient(135deg, #0f766e 0%, #065f46 100%)",
            color: "#fff",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "16px",
            boxShadow: "0 10px 20px -5px rgba(15, 118, 110, 0.4)",
          }}
        >
          <Activity size={32} />
        </div>
        <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a" }}>ApexCare Portal</h2>
        <p style={{ fontSize: "13px", color: "#64748b", marginTop: "4px" }}>
          Sign in to access Hospital SaaS System
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "18px" }}>
          <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#475569", marginBottom: "6px" }}>
            EMAIL ADDRESS
          </label>
          <div style={{ position: "relative" }}>
            <Mail size={18} style={{ position: "absolute", left: "14px", top: "14px", color: "#94a3b8" }} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="name@hospital.com"
              style={{
                width: "100%",
                padding: "12px 14px 12px 42px",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                fontSize: "14px",
                outline: "none",
              }}
            />
          </div>
        </div>

        <div style={{ marginBottom: "24px" }}>
          <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#475569", marginBottom: "6px" }}>
            PASSWORD
          </label>
          <div style={{ position: "relative" }}>
            <Lock size={18} style={{ position: "absolute", left: "14px", top: "14px", color: "#94a3b8" }} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              style={{
                width: "100%",
                padding: "12px 14px 12px 42px",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                fontSize: "14px",
                outline: "none",
              }}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="btn-primary-custom"
          style={{ width: "100%", justifyContent: "center", padding: "14px" }}
        >
          {submitting ? "Signing in..." : "Sign In to System"}
          {!submitting && <ArrowRight size={18} />}
        </button>
      </form>

      <div
        style={{
          marginTop: "28px",
          paddingTop: "20px",
          borderTop: "1px solid #f1f5f9",
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", marginBottom: "12px" }}>
          QUICK DEMO ACCESSIBILITY:
        </p>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            type="button"
            className="btn-secondary-custom"
            style={{ flex: 1, fontSize: "12px", padding: "8px", justifyContent: "center" }}
            onClick={() => fillQuickLogin("admin@hospital.com", "admin123")}
          >
            <CheckCircle size={14} style={{ color: "#0d9488" }} /> Admin Demo
          </button>
          <button
            type="button"
            className="btn-secondary-custom"
            style={{ flex: 1, fontSize: "12px", padding: "8px", justifyContent: "center" }}
            onClick={() => fillQuickLogin("staff@hospital.com", "staff123")}
          >
            <CheckCircle size={14} style={{ color: "#0284c7" }} /> Staff Demo
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
