import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

const formatApiError = (error) => {
  const validationDetails = error?.response?.data?.details;
  if (Array.isArray(validationDetails) && validationDetails.length > 0) {
    return validationDetails
      .map((detail) => `${detail.field}: ${detail.message}`)
      .join(", ");
  }

  const serverMessage = error?.response?.data?.message;
  if (serverMessage) {
    return serverMessage;
  }

  if (error?.code === "ECONNABORTED") {
    return "Request timed out. Please retry.";
  }

  if (error?.message === "Network Error") {
    return "Cannot reach server. Check backend URL and network.";
  }

  return "Something went wrong. Please try again.";
};

export const getProducts = async (params) => {
  const response = await apiClient.get("/products", { params });
  return response.data;
};

export const createProduct = async (payload) => {
  const response = await apiClient.post("/products", payload);
  return response.data;
};

export const updateProduct = async (productId, payload) => {
  const response = await apiClient.put(`/products/${productId}`, payload);
  return response.data;
};

export const deleteProduct = async (productId) => {
  const response = await apiClient.delete(`/products/${productId}`);
  return response.data;
};

export { formatApiError };
