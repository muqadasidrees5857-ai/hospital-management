import React, { useState, useEffect } from "react";
import { Settings as SettingsIcon, Building, Lock, Save } from "lucide-react";
import { settingsService, authService } from "../../services/api";
import { useToast } from "../../context/ToastContext";

const Settings = () => {
  const [hospitalInfo, setHospitalInfo] = useState({
    hospitalName: "",
    tagline: "",
    contactEmail: "",
    contactPhone: "",
    address: "",
    currency: "$",
    taxRate: 5,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [changingPass, setChangingPass] = useState(false);

  const { showSuccess, showError } = useToast();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await settingsService.getSettings();
        setHospitalInfo(data);
      } catch (err) {
        showError("Failed to fetch settings");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSaveHospitalInfo = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await settingsService.updateSettings(hospitalInfo);
      showSuccess("Hospital information updated!");
    } catch (err) {
      showError(err.message || "Failed to update hospital settings");
    } finally {
      setSavingSettings(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showError("New passwords do not match");
      return;
    }
    setChangingPass(true);
    try {
      await authService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      showSuccess("Password changed successfully!");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      showError(err.message || "Failed to change password");
    } finally {
      setChangingPass(false);
    }
  };

  if (loading) return <div>Loading settings...</div>;

  return (
    <div style={{ maxWidth: "800px" }}>
      <div className="page-header">
        <div className="page-header-text">
          <h1>System Settings</h1>
          <p>Configure hospital branding, tax rates, and account security</p>
        </div>
      </div>

      {/* HOSPITAL INFORMATION CARD */}
      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "16px",
          padding: "28px",
          marginBottom: "32px",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
          <Building size={20} style={{ color: "#0d9488" }} />
          <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#0f172a" }}>Hospital Branding & Info</h3>
        </div>

        <form onSubmit={handleSaveHospitalInfo}>
          <div className="form-grid">
            <div className="form-group-full">
              <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569" }}>HOSPITAL NAME</label>
              <input
                type="text"
                required
                value={hospitalInfo.hospitalName}
                onChange={(e) => setHospitalInfo({ ...hospitalInfo, hospitalName: e.target.value })}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", marginTop: "4px" }}
              />
            </div>
            <div className="form-group-full">
              <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569" }}>TAGLINE / SUBTITLE</label>
              <input
                type="text"
                value={hospitalInfo.tagline}
                onChange={(e) => setHospitalInfo({ ...hospitalInfo, tagline: e.target.value })}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", marginTop: "4px" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569" }}>CONTACT EMAIL</label>
              <input
                type="email"
                required
                value={hospitalInfo.contactEmail}
                onChange={(e) => setHospitalInfo({ ...hospitalInfo, contactEmail: e.target.value })}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", marginTop: "4px" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569" }}>PHONE</label>
              <input
                type="text"
                required
                value={hospitalInfo.contactPhone}
                onChange={(e) => setHospitalInfo({ ...hospitalInfo, contactPhone: e.target.value })}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", marginTop: "4px" }}
              />
            </div>
            <div className="form-group-full">
              <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569" }}>ADDRESS</label>
              <input
                type="text"
                value={hospitalInfo.address}
                onChange={(e) => setHospitalInfo({ ...hospitalInfo, address: e.target.value })}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", marginTop: "4px" }}
              />
            </div>
          </div>

          <div style={{ marginTop: "24px", display: "flex", justifyContent: "flex-end" }}>
            <button type="submit" disabled={savingSettings} className="btn-primary-custom">
              <Save size={16} /> {savingSettings ? "Saving..." : "Save Hospital Details"}
            </button>
          </div>
        </form>
      </div>

      {/* PASSWORD CHANGE CARD */}
      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "16px",
          padding: "28px",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
          <Lock size={20} style={{ color: "#0284c7" }} />
          <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#0f172a" }}>Change Administrator Password</h3>
        </div>

        <form onSubmit={handleChangePassword}>
          <div className="form-grid">
            <div className="form-group-full">
              <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569" }}>CURRENT PASSWORD</label>
              <input
                type="password"
                required
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                placeholder="••••••••"
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", marginTop: "4px" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569" }}>NEW PASSWORD</label>
              <input
                type="password"
                required
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                placeholder="••••••••"
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", marginTop: "4px" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "700", color: "#475569" }}>CONFIRM NEW PASSWORD</label>
              <input
                type="password"
                required
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                placeholder="••••••••"
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", marginTop: "4px" }}
              />
            </div>
          </div>

          <div style={{ marginTop: "24px", display: "flex", justifyContent: "flex-end" }}>
            <button type="submit" disabled={changingPass} className="btn-secondary-custom">
              {changingPass ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
