const API_BASE_URL = "/api";

export const fetchApi = async (endpoint, options = {}) => {
  const token = localStorage.getItem("hospital_token");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

// API Services
export const authService = {
  login: (credentials) => fetchApi("/auth/login", { method: "POST", body: JSON.stringify(credentials) }),
  getMe: () => fetchApi("/auth/me"),
  changePassword: (passwords) => fetchApi("/auth/change-password", { method: "PUT", body: JSON.stringify(passwords) }),
};

export const patientService = {
  getAll: (query = "") => fetchApi(`/patients?${query}`),
  getById: (id) => fetchApi(`/patients/${id}`),
  create: (patient) => fetchApi("/patients", { method: "POST", body: JSON.stringify(patient) }),
  update: (id, patient) => fetchApi(`/patients/${id}`, { method: "PUT", body: JSON.stringify(patient) }),
  delete: (id) => fetchApi(`/patients/${id}`, { method: "DELETE" }),
};

export const doctorService = {
  getAll: (query = "") => fetchApi(`/doctors?${query}`),
  getById: (id) => fetchApi(`/doctors/${id}`),
  create: (doctor) => fetchApi("/doctors", { method: "POST", body: JSON.stringify(doctor) }),
  update: (id, doctor) => fetchApi(`/doctors/${id}`, { method: "PUT", body: JSON.stringify(doctor) }),
  delete: (id) => fetchApi(`/doctors/${id}`, { method: "DELETE" }),
};

export const departmentService = {
  getAll: () => fetchApi("/departments"),
  getById: (id) => fetchApi(`/departments/${id}`),
  create: (dept) => fetchApi("/departments", { method: "POST", body: JSON.stringify(dept) }),
  update: (id, dept) => fetchApi(`/departments/${id}`, { method: "PUT", body: JSON.stringify(dept) }),
  delete: (id) => fetchApi(`/departments/${id}`, { method: "DELETE" }),
};

export const appointmentService = {
  getAll: (query = "") => fetchApi(`/appointments?${query}`),
  getById: (id) => fetchApi(`/appointments/${id}`),
  create: (apt) => fetchApi("/appointments", { method: "POST", body: JSON.stringify(apt) }),
  update: (id, apt) => fetchApi(`/appointments/${id}`, { method: "PUT", body: JSON.stringify(apt) }),
  cancel: (id) => fetchApi(`/appointments/${id}/cancel`, { method: "PUT" }),
  delete: (id) => fetchApi(`/appointments/${id}`, { method: "DELETE" }),
};

export const prescriptionService = {
  getAll: (query = "") => fetchApi(`/prescriptions?${query}`),
  getById: (id) => fetchApi(`/prescriptions/${id}`),
  create: (rx) => fetchApi("/prescriptions", { method: "POST", body: JSON.stringify(rx) }),
  delete: (id) => fetchApi(`/prescriptions/${id}`, { method: "DELETE" }),
};

export const billingService = {
  getAll: (query = "") => fetchApi(`/billing?${query}`),
  getById: (id) => fetchApi(`/billing/${id}`),
  create: (inv) => fetchApi("/billing", { method: "POST", body: JSON.stringify(inv) }),
  update: (id, inv) => fetchApi(`/billing/${id}`, { method: "PUT", body: JSON.stringify(inv) }),
  delete: (id) => fetchApi(`/billing/${id}`, { method: "DELETE" }),
};

export const staffService = {
  getAll: (query = "") => fetchApi(`/staff?${query}`),
  create: (staff) => fetchApi("/staff", { method: "POST", body: JSON.stringify(staff) }),
  update: (id, staff) => fetchApi(`/staff/${id}`, { method: "PUT", body: JSON.stringify(staff) }),
  delete: (id) => fetchApi(`/staff/${id}`, { method: "DELETE" }),
};

export const reportService = {
  getDashboardStats: () => fetchApi("/reports/dashboard"),
};

export const settingsService = {
  getSettings: () => fetchApi("/settings"),
  updateSettings: (settings) => fetchApi("/settings", { method: "PUT", body: JSON.stringify(settings) }),
};
