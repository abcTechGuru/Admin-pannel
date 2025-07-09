import axios from "axios";

export const api = axios.create({
  baseURL: "http://18.208.165.98/api", // Change if needed
  // baseURL: "http://localhost:5000/api", // Change if needed
});

export const fetchUsers = () => api.get("/users");
export const fetchUserById = (id) => api.get(`/users/${id}`);
export const deleteUser = (id) => api.delete(`/users/${id}`);
export const updateUserRole = (id, role) => api.patch(`/users/${id}`, { role });

export const fetchCampaigns = () => api.get("/campaigns");
export const fetchStats = () => api.get("/stats");
export const fetchBilling = () => api.get("/billing");
