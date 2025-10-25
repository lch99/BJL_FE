// src/components/POS/InventoryView.jsx
import React from 'react';
import { Package, DollarSign, AlertCircle, Plus } from 'lucide-react';

const InventoryView = ({ products, setProducts }) => {
    return (
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-orange-100">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-extrabold flex items-center gap-2 text-orange-700">
                    <Package className="w-7 h-7 text-orange-500" />
                    Inventory Management
                </h2>
                <button className="px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-400 text-white rounded-lg font-semibold hover:opacity-90 transition-all flex items-center gap-2 shadow-md">
                    <Plus className="w-5 h-5" />
                    Add Product
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white rounded-xl p-4 shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-orange-100 text-sm mb-1">Total Products</p>
                            <p className="text-3xl font-extrabold">{products.length}</p>
                        </div>
                        <Package className="w-10 h-10 opacity-40" />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-orange-400 to-yellow-500 text-white rounded-xl p-4 shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-orange-100 text-sm mb-1">Total Stock Value</p>
                            <p className="text-3xl font-extrabold">
                                ${products.reduce((sum, p) => sum + (p.price * p.stock), 0).toFixed(0)}
                            </p>
                        </div>
                        <DollarSign className="w-10 h-10 opacity-40" />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-amber-400 to-orange-600 text-white rounded-xl p-4 shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-amber-100 text-sm mb-1">Low Stock Items</p>
                            <p className="text-3xl font-extrabold">
                                {products.filter(p => p.stock < 10 && p.stock > 0).length}
                            </p>
                        </div>
                        <AlertCircle className="w-10 h-10 opacity-40" />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-red-500 to-orange-600 text-white rounded-xl p-4 shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-red-100 text-sm mb-1">Out of Stock</p>
                            <p className="text-3xl font-extrabold">
                                {products.filter(p => p.stock === 0).length}
                            </p>
                        </div>
                        <AlertCircle className="w-10 h-10 opacity-40" />
                    </div>
                </div>
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto border border-orange-100 rounded-xl">
                <table className="w-full text-sm">
                    <thead className="bg-gradient-to-r from-orange-50 to-yellow-50 border-b border-orange-200">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-bold text-orange-700 uppercase">Product</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-orange-700 uppercase">SKU</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-orange-700 uppercase">Category</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-orange-700 uppercase">Brand</th>
                        <th className="px-4 py-3 text-right text-xs font-bold text-orange-700 uppercase">Price</th>
                        <th className="px-4 py-3 text-right text-xs font-bold text-orange-700 uppercase">Stock</th>
                        <th className="px-4 py-3 text-center text-xs font-bold text-orange-700 uppercase">Status</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-orange-100">
                    {products.map(product => (
                        <tr key={product.id} className="hover:bg-orange-50 transition-colors">
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{product.image || '📦'}</span>
                                    <div>
                                        <div className="font-semibold text-gray-800">{product.name}</div>
                                        {product.brand && <div className="text-xs text-gray-500">{product.brand}</div>}
                                    </div>
                                </div>
                            </td>
                            <td className="px-4 py-3 font-mono text-xs text-gray-600">{product.sku}</td>
                            <td className="px-4 py-3">
                                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">
                                        {product.category}
                                    </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-800">{product.brand}</td>
                            <td className="px-4 py-3 text-right text-sm font-bold text-orange-700">${product.price}</td>
                            <td className="px-4 py-3 text-right">
                                    <span className={`font-bold ${product.stock < 10 ? 'text-red-600' : 'text-gray-900'}`}>
                                        {product.stock}
                                    </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                                            product.stock === 0
                                                ? 'bg-red-100 text-red-700'
                                                : product.stock < 10
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-green-100 text-green-800'
                                        }`}
                                    >
                                        {product.stock === 0
                                            ? '⚠️ Out'
                                            : product.stock < 10
                                                ? '⚡ Low'
                                                : '✓ Good'}
                                    </span>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InventoryView;
