import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add JWT token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle auth errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth APIs
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data)
};

// Product APIs
export const productAPI = {
    getAll: () => api.get('/products'),
    getById: (id) => api.get(`/products/${id}`),
    search: (query) => api.get(`/products/search?query=${query}`),
    getByCategory: (category) => api.get(`/products/category/${category}`)
};

// Order APIs
export const orderAPI = {
    create: (data) => api.post('/orders', data),
    getById: (id) => api.get(`/orders/${id}`),
    getByUserId: (userId) => api.get(`/orders/user/${userId}`),
    markAsPaid: (id, paymentId) => api.post(`/orders/${id}/pay?paymentId=${paymentId}`),
    markAsShipped: (id, trackingNumber) => api.post(`/orders/${id}/ship?trackingNumber=${trackingNumber}`)
};

// Inventory APIs
export const inventoryAPI = {
    getAll: () => api.get('/inventory'),
    getByProductId: (productId) => api.get(`/inventory/${productId}`)
};

export default api;
