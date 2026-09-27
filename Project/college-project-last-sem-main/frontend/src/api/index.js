import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    const url = err.config?.url ?? '';
    const isAuthRequest = url.includes('/auth/login') || url.includes('/auth/register');

    if (status === 401 && !isAuthRequest) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(err);
  },
);

// Auth
export const authAPI = {
  login: (data) => api.post("/auth/login", data),
  register: (data) => api.post("/auth/register", data),
  sendRegistrationOtp: (data) => api.post("/auth/register/send-otp", data),
  verifyRegistrationOtp: (data) => api.post("/auth/register/verify", data),
};

// Medicines
export const medicineAPI = {
  getAll: (params) => api.get("/medicines", { params }),
  getById: (id) => api.get(`/medicines/${id}`),
  search: (name) => api.get(`/medicines/search?name=${name}`),
  create: (data) => api.post("/admin/medicines", data),
  createWithImage: (formData) => api.post("/admin/medicines/upload", formData),
  update: (id, d) => api.put(`/admin/medicines/${id}`, d),
  updateWithImage: (id, formData) => api.post(`/admin/medicines/${id}/upload`, formData),
  delete: (id) => api.delete(`/admin/medicines/${id}`),
};

// Orders
export const orderAPI = {
  place: (data) => api.post("/orders", data),
  getMyOrders: () => api.get("/orders/my-orders"),
  getById: (id) => api.get(`/orders/${id}`),
  cancel: (id) => api.put(`/orders/${id}/cancel`),
  adminGetAll: () => api.get("/admin/orders"),
  adminUpdate: (id, st) => api.put(`/admin/orders/${id}/status?status=${st}`),
};

// Users (Customers)
export const customerAPI = {
  getProfile: () => api.get("/customer/profile"),
  updateProfile: (data) => api.put("/customer/profile", data),
  adminGetAll: () => api.get("/admin/customers"),
  adminCreate: (data) => api.post("/admin/customers", data),
  adminUpdate: (id, data) => api.put(`/admin/customers/${id}`, data),
  adminDelete: (id) => api.delete(`/admin/customers/${id}`),
};

// Chatbot
export const chatAPI = {
  sendMessage: (message) => api.post("/chat", { message }),
  getHistory: () => api.get('/chat/history'),
  adminGetAll: () => api.get('/admin/chat')
};

// Payments
export const paymentAPI = {
  getMyPayments: () => api.get('/payments/my-payments'),
  generateQr: (data) => api.post('/payments/qr', data),
  adminGetAll: () => api.get('/admin/payments'),
  adminUpdateStatus: (id, status) => api.put(`/admin/payments/${id}/status?status=${status}`)
};

// Profile
export const profileAPI = {
  get: () => api.get("/profile"),
  update: (data) => api.put("/profile", data),
};

// Admin
export const adminAPI = {
  getDashboard: () => api.get("/admin/dashboard"),
  getAdmins: () => api.get("/admin/admins"),
  createAdmin: (data) => api.post("/admin/admins", data),
  updateAdmin: (id, data) => api.put(`/admin/admins/${id}`, data),
  deleteAdmin: (id) => api.delete(`/admin/admins/${id}`),
};

export default api;

