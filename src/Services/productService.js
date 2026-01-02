// productService.js
const API_BASE_URL = 'https://localhost:7064';

export const productService = {
    async getProducts(filters) {
        const queryParams = new URLSearchParams();
        
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                queryParams.append(key, value);
            }
        });
        
        const response = await fetch(`${API_BASE_URL}/api/products?${queryParams}`);
        if (!response.ok) throw new Error('Failed to fetch products');
        return await response.json();
    },

    async getCategories() {
        const response = await fetch(`${API_BASE_URL}/api/products/categories`);
        if (!response.ok) throw new Error('Failed to fetch categories');
        return await response.json();
    },

    async getBrands() {
        const response = await fetch(`${API_BASE_URL}/api/products/brands`);
        if (!response.ok) throw new Error('Failed to fetch brands');
        return await response.json();
    },

     async getProfile() {
        const response = await fetch(`${API_BASE_URL}/api/Auth/profile`);
        if (!response.ok) throw new Error('Failed to fetch brands');
        return await response.json();
    }

};

export default productService;