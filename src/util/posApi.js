const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const apiClient = async (endpoint, options = {}) => {
    try {
        const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
        const token = localStorage.getItem('token');
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API ${response.status}: ${errorText || response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`[API ERROR] ${endpoint}:`, error);
        throw error;
    }
};

// ==================== AUTH ====================
export const login = async (username, password) => {
    const data = await apiClient('/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
    });
    return data;
};

// ==================== PHONES ====================
export const fetchPhones = async () => {
    const data = await apiClient('/phones');
    if (!Array.isArray(data)) {
        console.error('Expected array but got:', data);
        return [];
    }
    return data.map(p => ({
        ...p,
        id: `phone-${p.id}`,
        category: 'Phones',
        image: '📱',
        price: parseFloat(p.sell_price),
        cost: parseFloat(p.purchase_price),
        stock: p.quantity,
    }));
};
export const createPhone = d => apiClient('/phones', { method: 'POST', body: JSON.stringify(d) });
export const updatePhone = (id, d) => apiClient(`/phones/${id}`, { method: 'PUT', body: JSON.stringify(d) });
export const deletePhone = id => apiClient(`/phones/${id}`, { method: 'DELETE' });

// ==================== ACCESSORIES ====================
export const fetchAccessories = async () => {
    const data = await apiClient('/accessories');
    return data.map(a => ({
        ...a,
        id: `accessory-${a.id}`,
        category: 'Accessories',
        subcategory: a.type,
        image: '📦',
        price: parseFloat(a.sell_price),
        cost: parseFloat(a.purchase_price),
        stock: a.quantity,
    }));
};
export const createAccessory = d => apiClient('/accessories', { method: 'POST', body: JSON.stringify(d) });
export const updateAccessory = (id, d) => apiClient(`/accessories/${id}`, { method: 'PUT', body: JSON.stringify(d) });
export const deleteAccessory = id => apiClient(`/accessories/${id}`, { method: 'DELETE' });

// ==================== PRODUCTS (Combined) ====================
export const fetchProducts = async () => {
    const [phones, accessories] = await Promise.all([fetchPhones(), fetchAccessories()]);
    return [...phones, ...accessories];
};

// ==================== REPAIRS ====================
export const fetchRepairs = async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status && filters.status !== 'all') params.append('status', filters.status);
    if (filters.start_date) params.append('start_date', filters.start_date);
    if (filters.end_date) params.append('end_date', filters.end_date);
    const query = params.toString() ? `?${params.toString()}` : '';

    const data = await apiClient(`/repairs${query}`);

    if (!Array.isArray(data)) {
        console.error('Expected array but got:', data);
        return [];
    }

    // Map or normalize data if needed
    return data.map(r => ({
        ...r,
        id: `repair-${r.id}`, // optional, if you want unique id prefix
        repair_cost: parseFloat(r.repair_cost || 0),
    }));
};

export const createRepair = d => apiClient('/repairs', { method: 'POST', body: JSON.stringify(d) });
export const updateRepair = (id, d) => apiClient(`/repairs/${id}`, { method: 'PUT', body: JSON.stringify(d) });
export const deleteRepair = id => apiClient(`/repairs/${id}`, { method: 'DELETE' });

// ==================== SALES ====================
export const createSale = d => apiClient('/sales', { method: 'POST', body: JSON.stringify(d) });
export const fetchTransactions = async (startDate = null, endDate = null) => {
    let url = '/sales';
    if (startDate && endDate) url += `?startDate=${startDate}&endDate=${endDate}`;
    return apiClient(url);
};
export const fetchSaleById = id => apiClient(`/sales/${id}`);

export const refreshInventory = async () => {
    const [phones, accessories] = await Promise.all([
        fetchPhones(),
        fetchAccessories(),
    ]);
    return { phones, accessories };
};

// ==================== WORKERS ====================
export const fetchWorkers = () => apiClient('/workers');
export const createWorker = d => apiClient('/workers', { method: 'POST', body: JSON.stringify(d) });
export const updateWorker = (id, d) => apiClient(`/workers/${id}`, { method: 'PUT', body: JSON.stringify(d) });
export const deleteWorker = id => apiClient(`/workers/${id}`, { method: 'DELETE' });

// ==================== USERS ====================
export const fetchUsers = () => apiClient('/users');
export const createUser = d => apiClient('/users', { method: 'POST', body: JSON.stringify(d) });
export const updateUser = (id, d) => apiClient(`/users/${id}`, { method: 'PUT', body: JSON.stringify(d) });
export const deleteUser = id => apiClient(`/users/${id}`, { method: 'DELETE' });

// ==================== ROLES ====================
export const fetchRoles = () => apiClient('/roles');
export const createRole = d => apiClient('/roles', { method: 'POST', body: JSON.stringify(d) });
export const updateRole = (id, d) => apiClient(`/roles/${id}`, { method: 'PUT', body: JSON.stringify(d) });
export const deleteRole = id => apiClient(`/roles/${id}`, { method: 'DELETE' });

// ==================== SUPPLIERS ====================
export const fetchSuppliers = () => apiClient('/suppliers');
export const createSupplier = (d) => apiClient('/suppliers', { method: 'POST', body: JSON.stringify(d) });
export const updateSupplier = (id, d) => apiClient(`/suppliers/${id}`, { method: 'PUT', body: JSON.stringify(d) });
export const deleteSupplier = (id) => apiClient(`/suppliers/${id}`, { method: 'DELETE' });

// ==================== PURCHASES ====================
export const fetchPurchases = () => apiClient('/purchases');
export const fetchPurchaseById = (id) => apiClient(`/purchases/${id}`);
export const createPurchase = (d) =>
    apiClient('/purchases', { method: 'POST', body: JSON.stringify(d) });
export const updatePurchase = (id, d) =>
    apiClient(`/purchases/${id}`, { method: 'PUT', body: JSON.stringify(d) });
export const voidPurchase = (id) => apiClient(`/purchases/${id}/void`, { method: 'PUT' });
