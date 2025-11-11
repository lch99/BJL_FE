// src/components/POS/InventoryView.jsx
import React, { useState, useEffect } from 'react';
import { Package, DollarSign, AlertCircle, Plus, Wrench } from 'lucide-react';
import { fetchPhones, fetchAccessories } from '../../util/posApi';

const DEFAULT_PHONE_IMAGE = '📱';
const DEFAULT_ACCESSORY_IMAGE = '📦';

const InventoryView = () => {
    const [phones, setPhones] = useState([]);
    const [accessories, setAccessories] = useState([]);
    const [activeTab, setActiveTab] = useState('phones');
    const [showAddDialog, setShowAddDialog] = useState(false);

    // New product form
    const [newProduct, setNewProduct] = useState({
        category: 'Phones',
        model_name: '',
        brand: '',
        name: '',
        price: '',
        cost: '',
        quantity: ''
    });

    // Load phones & accessories
    useEffect(() => {
        const loadData = async () => {
            try {
                const [phonesData, accessoriesData] = await Promise.all([
                    fetchPhones(),
                    fetchAccessories()
                ]);
                setPhones(phonesData);
                setAccessories(accessoriesData);
            } catch (error) {
                console.error('Failed to fetch inventory:', error);
            }
        };
        loadData();
    }, []);

    // Common stats
    const getStats = (items) => {
        const totalValue = items.reduce((sum, p) => sum + (p.price * (p.stock || 0)), 0);
        const lowStock = items.filter(p => p.stock < 10 && p.stock > 0).length;
        const outOfStock = items.filter(p => p.stock === 0).length;
        return { total: items.length, totalValue, lowStock, outOfStock };
    };

    const stats = activeTab === 'phones' ? getStats(phones) : getStats(accessories);

    const displayedItems = activeTab === 'phones' ? phones : accessories;

    const handleAddProduct = (e) => {
        e.preventDefault();
        const product = {
            ...newProduct,
            id: `${newProduct.category}-${Date.now()}`,
            category: newProduct.category,
            image: newProduct.category === 'Phones' ? DEFAULT_PHONE_IMAGE : DEFAULT_ACCESSORY_IMAGE,
            stock: parseInt(newProduct.quantity || 0),
            price: parseFloat(newProduct.price || 0),
            cost: parseFloat(newProduct.cost || 0),
        };
        if (newProduct.category === 'Phones') setPhones([product, ...phones]);
        else setAccessories([product, ...accessories]);
        setShowAddDialog(false);
        setNewProduct({
            category: 'Phones',
            model_name: '',
            brand: '',
            name: '',
            price: '',
            cost: '',
            quantity: ''
        });
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-orange-100">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-extrabold flex items-center gap-2 text-orange-700">
                    <Package className="w-7 h-7 text-orange-500" />
                    Inventory Management
                </h2>
                <button
                    onClick={() => setShowAddDialog(true)}
                    className="px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-400 text-white rounded-lg font-semibold hover:opacity-90 transition-all flex items-center gap-2 shadow-md"
                >
                    <Plus className="w-5 h-5" />
                    Add Product
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-4">
                {['phones', 'accessories'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-lg font-medium ${
                            activeTab === tab
                                ? 'bg-orange-500 text-white'
                                : 'bg-gray-100 text-gray-700'
                        }`}
                    >
                        {tab === 'phones' ? 'Phones' : 'Accessories'}
                    </button>
                ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white rounded-xl p-4 shadow-md">
                    <p className="text-sm">Total Products</p>
                    <p className="text-3xl font-extrabold">{stats.total}</p>
                </div>
                <div className="bg-gradient-to-br from-orange-400 to-yellow-500 text-white rounded-xl p-4 shadow-md">
                    <p className="text-sm">Total Stock Value</p>
                    <p className="text-3xl font-extrabold">RM{stats.totalValue.toFixed(0)}</p>
                </div>
                <div className="bg-gradient-to-br from-amber-400 to-orange-600 text-white rounded-xl p-4 shadow-md">
                    <p className="text-sm">Low Stock</p>
                    <p className="text-3xl font-extrabold">{stats.lowStock}</p>
                </div>
                <div className="bg-gradient-to-br from-red-500 to-orange-600 text-white rounded-xl p-4 shadow-md">
                    <p className="text-sm">Out of Stock</p>
                    <p className="text-3xl font-extrabold">{stats.outOfStock}</p>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border border-orange-100 rounded-xl">
                <table className="w-full text-sm">
                    <thead className="bg-gradient-to-r from-orange-50 to-yellow-50 border-b border-orange-200">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-bold text-orange-700 uppercase">Product</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-orange-700 uppercase">SKU / ID</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-orange-700 uppercase">Brand / Type</th>
                        <th className="px-4 py-3 text-right text-xs font-bold text-orange-700 uppercase">Price</th>
                        <th className="px-4 py-3 text-right text-xs font-bold text-orange-700 uppercase">Stock</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-orange-100">
                    {displayedItems.map(p => (
                        <tr key={p.id} className="hover:bg-orange-50 transition-colors">
                            <td className="px-4 py-3 flex items-center gap-2">
                                <span className="text-2xl">{p.image}</span>
                                <span>{p.category === 'Phones' ? p.model_info?.model_name || p.name : p.name}</span>
                            </td>
                            <td className="px-4 py-3 font-mono">{p.sku || p.id}</td>
                            <td className="px-4 py-3">{p.brand || p.model_info?.brand || '-'}</td>
                            <td className="px-4 py-3 text-right font-bold">RM{p.price?.toFixed(2)}</td>
                            <td className="px-4 py-3 text-right font-bold">{p.stock}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Add Product Dialog */}
            {showAddDialog && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6">
                        <h3 className="text-2xl font-bold mb-4 text-orange-700">Add Product</h3>
                        <form onSubmit={handleAddProduct} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select
                                    value={newProduct.category}
                                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                                    className="w-full border-2 rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
                                >
                                    <option value="Phones">Phones</option>
                                    <option value="Accessories">Accessories</option>
                                </select>
                            </div>

                            {newProduct.category === 'Phones' ? (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Model Name</label>
                                        <input
                                            type="text"
                                            value={newProduct.model_name}
                                            onChange={(e) => setNewProduct({ ...newProduct, model_name: e.target.value })}
                                            className="w-full border-2 rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                                        <input
                                            type="text"
                                            value={newProduct.brand}
                                            onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                                            className="w-full border-2 rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
                                        />
                                    </div>
                                </>
                            ) : (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Accessory Name</label>
                                    <input
                                        type="text"
                                        value={newProduct.name}
                                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                        className="w-full border-2 rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
                                        required
                                    />
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={newProduct.price}
                                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                                        className="w-full border-2 rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Cost</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={newProduct.cost}
                                        onChange={(e) => setNewProduct({ ...newProduct, cost: e.target.value })}
                                        className="w-full border-2 rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                                    <input
                                        type="number"
                                        value={newProduct.quantity}
                                        onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
                                        className="w-full border-2 rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAddDialog(false)}
                                    className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-400 text-white rounded-lg font-bold hover:opacity-90"
                                >
                                    Add Product
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventoryView;
