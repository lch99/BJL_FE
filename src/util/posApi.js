// src/utils/api.js

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

// Products API
export const fetchProducts = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/items`);
        if (!response.ok) throw new Error('Failed to fetch products');
        return await response.json();
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

export const updateProduct = async (productId, productData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/items/${productId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData)
        });
        if (!response.ok) throw new Error('Failed to update product');
        return await response.json();
    } catch (error) {
        console.error('Error updating product:', error);
        throw error;
    }
};

export const createProduct = async (productData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/items`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData)
        });
        if (!response.ok) throw new Error('Failed to create product');
        return await response.json();
    } catch (error) {
        console.error('Error creating product:', error);
        throw error;
    }
};

// Sales API
export const createSale = async (saleData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/pos/sales`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(saleData)
        });
        if (!response.ok) throw new Error('Failed to create sale');
        return await response.json();
    } catch (error) {
        console.error('Error creating sale:', error);
        throw error;
    }
};

// Transactions API
export const fetchTransactions = async (filter = 'all') => {
    try {
        const response = await fetch(`${API_BASE_URL}/pos/sales?filter=${filter}`);
        if (!response.ok) throw new Error('Failed to fetch transactions');
        return await response.json();
    } catch (error) {
        console.error('Error fetching transactions:', error);
        throw error;
    }
};

export const fetchTransactionById = async (transactionId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/pos/sales/${transactionId}`);
        if (!response.ok) throw new Error('Failed to fetch transaction');
        return await response.json();
    } catch (error) {
        console.error('Error fetching transaction:', error);
        throw error;
    }
};