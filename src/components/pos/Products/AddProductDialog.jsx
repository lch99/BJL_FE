import React, { useState, useEffect } from 'react';
import { Package, Plus, Smartphone, Headphones } from 'lucide-react';
import { fetchPhones, fetchAccessories } from '../../../util/posApi';
import AddProductDialog from './AddProductDialog';

const InventoryView = () => {
    const [activeTab, setActiveTab] = useState('Phones');
    const [phones, setPhones] = useState([]);
    const [accessories, setAccessories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);

    // Fetch both categories
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const [phoneData, accessoryData] = await Promise.all([
                    fetchPhones(),
                    fetchAccessories()
                ]);
                setPhones(phoneData);
                setAccessories(accessoryData);
            } catch (err) {
                console.error('Error loading inventory:', err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const handleProductAdded = async () => {
        // Reload data after adding new product
        const [phoneData, accessoryData] = await Promise.all([
            fetchPhones(),
            fetchAccessories()
        ]);
        setPhones(phoneData);
        setAccessories(accessoryData);
    };

    const activeProducts = activeTab === 'Phones' ? phones : accessories;
    const totalStockValue = activeProducts.reduce((sum, p) => sum + (p.price * (p.stock || 0)), 0);

    return (
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-orange-100">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                    <Package className="w-7 h-7 text-orange-500" />
                    <h2 className="text-2xl font-extrabold text-orange-700">Inventory</h2>
                </div>
                <button
                    onClick={() => setOpenDialog(true)}
                    className="px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-400 text-white rounded-lg font-semibold hover:opacity-90 transition-all flex items-center gap-2 shadow-md"
                >
                    <Plus className="w-5 h-5" />
                    Add {activeTab.slice(0, -1)}
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
                {['Phones', 'Accessories'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 border ${
                            activeTab === tab
                                ? 'bg-gradient-to-r from-orange-500 to-yellow-400 text-white border-transparent'
                                : 'bg-white text-orange-600 border-orange-200 hover:bg-orange-50'
                        }`}
                    >
                        {tab === 'Phones' ? (
                            <Smartphone className="w-5 h-5" />
                        ) : (
                            <Headphones className="w-5 h-5" />
                        )}
                        {tab}
                    </button>
                ))}
            </div>

            {/* Stats */}
            <div className="flex justify-between mb-4 text-sm text-gray-600">
                <p>Total Items: <span className="font-semibold text-orange-700">{activeProducts.length}</span></p>
                <p>Total Stock Value: <span className="font-semibold text-orange-700">RM {totalStockValue.toFixed(2)}</span></p>
            </div>

            {/* Table */}
            {loading ? (
                <div className="text-center text-gray-500 py-6">Loading...</div>
            ) : (
                <div className="overflow-x-auto border border-orange-100 rounded-xl">
                    <table className="w-full text-sm">
                        <thead className="bg-gradient-to-r from-orange-50 to-yellow-50 border-b border-orange-200">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-bold text-orange-700 uppercase">Image</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-orange-700 uppercase">Name / Model</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-orange-700 uppercase">SKU</th>
                            <th className="px-4 py-3 text-right text-xs font-bold text-orange-700 uppercase">Price</th>
                            <th className="px-4 py-3 text-right text-xs font-bold text-orange-700 uppercase">Stock</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-orange-100">
                        {activeProducts.map((p) => (
                            <tr key={p.id} className="hover:bg-orange-50 transition-colors">
                                <td className="px-4 py-3 text-2xl text-center">
                                    {activeTab === 'Phones' ? '📱' : '🎧'}
                                </td>
                                <td className="px-4 py-3 text-gray-800">
                                    {activeTab === 'Phones'
                                        ? p.model_info?.model_name || 'Unnamed Phone'
                                        : p.name || 'Unnamed Accessory'}
                                </td>
                                <td className="px-4 py-3 text-gray-600 font-mono text-xs">{p.sku}</td>
                                <td className="px-4 py-3 text-right font-semibold text-orange-700">
                                    RM{p.price?.toFixed(2)}
                                </td>
                                <td className="px-4 py-3 text-right">
                                    {p.stock > 0 ? (
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                p.stock < 10
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-green-100 text-green-800'
                                            }`}
                                        >
                                                {p.stock}
                                            </span>
                                    ) : (
                                        <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold">
                                                Out
                                            </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Add Product Dialog */}
            <AddProductDialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                category={activeTab}
                onProductAdded={handleProductAdded}
            />
        </div>
    );
};

export default InventoryView;
