import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function AddPatient() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "Male",
    phone: "",
    email: "",
    bloodGroup: "B+",
    disease: "",
    status: "Active",
    medicalNotes: "",
    address: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/patients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Patient added successfully!");
        navigate("/patients");
      } else {
        alert(data.message || "Patient could not be added.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to connect to backend server.");
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <div className="page-header">
        <div className="page-header-text">
          <h1>Add New Patient</h1>
          <p>Fill out patient credentials to create a new record in the registry.</p>
        </div>
        <Link to="/patients" className="btn-secondary-custom">
          ← Back to Patient List
        </Link>
      </div>

      <div
        style={{
          background: "#fff",
          border: "1px solid var(--border-color)",
          borderRadius: "var(--radius-lg)",
          padding: "32px",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <form onSubmit={handleSubmit}>
          <h3 style={{ fontSize: "16px", color: "var(--primary)", marginBottom: "16px" }}>
            👤 Personal Details
          </h3>

          <div className="form-grid" style={{ marginBottom: "24px" }}>
            <div className="form-group-full">
              <label className="form-label-custom">Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-control-custom"
                placeholder="Enter patient full name"
                required
              />
            </div>

            <div>
              <label className="form-label-custom">Age *</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="form-control-custom"
                placeholder="e.g. 35"
                required
              />
            </div>

            <div>
              <label className="form-label-custom">Gender *</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="form-control-custom"
                required
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="form-label-custom">Phone Number *</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="form-control-custom"
                placeholder="0300-1234567"
                required
              />
            </div>

            <div>
              <label className="form-label-custom">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-control-custom"
                placeholder="patient@email.com"
              />
            </div>
          </div>

          <h3 style={{ fontSize: "16px", color: "var(--primary)", marginBottom: "16px" }}>
            🩺 Medical Information
          </h3>

          <div className="form-grid" style={{ marginBottom: "24px" }}>
            <div>
              <label className="form-label-custom">Blood Group *</label>
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                className="form-control-custom"
                required
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            <div>
              <label className="form-label-custom">Disease / Condition *</label>
              <input
                type="text"
                name="disease"
                value={formData.disease}
                onChange={handleChange}
                className="form-control-custom"
                placeholder="e.g. Hypertension, Fever"
                required
              />
            </div>

            <div className="form-group-full">
              <label className="form-label-custom">Medical History Notes</label>
              <textarea
                name="medicalNotes"
                value={formData.medicalNotes}
                onChange={handleChange}
                className="form-control-custom"
                rows="3"
                placeholder="Enter any previous allergies, conditions or medications..."
              ></textarea>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
            <button
              type="button"
              className="btn-secondary-custom"
              onClick={() => navigate("/patients")}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary-custom">
              Save Patient Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddPatient;