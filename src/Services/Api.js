import axios from "axios";

const API_BASE_URL = "https://localhost:7064/api"

export const productService = {
    // Get products with filters
    getProducts: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        const response = await axios.get(`${API_BASE_URL}/products?${queryString}`);
        return response.data;
    },

    // Get single product
    getProduct: async (id) => {
        const response = await axios.get(`${API_BASE_URL}/products/${id}`);
        return response.data;
    },

    // Get categories
    getCategories: async () => {
        const response = await axios.get(`${API_BASE_URL}/products/categories`);
        return response.data;
    },

    // Get brands
    getBrands: async () => {
        const response = await axios.get(`${API_BASE_URL}/products/brands`);
        return response.data;
    }
};

export const authService = {
    login: async (credentials) => {
        const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
        return response.data;
    },

    register: async (userData) => {
        const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
        return response.data;
    },

    getProfile: async () => {
        const response = await axios.get(`${API_BASE_URL}/auth/profile`);
        return response.data;
    }
};