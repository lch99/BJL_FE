import React from 'react';
import { Phone, Package, Wrench } from 'lucide-react';
import ProductCard from './ProductCard';
import { getProductsByBrand, getAccessoriesBySubcategory } from '../../util/calculations';

const BrandCategoryView = ({ products = [], repairs = [], selectedCategory, searchTerm = '', onAddToCart }) => {
    // 🔹 Group Phones by Brand (from model_info)
    const phones = products.filter(p => p.model_info); // only phones have model_info
    const accessories = products.filter(p => !p.model_info && p.category === 'Accessories');
    const brandGroups = getProductsByBrand(phones);
    const accessoryGroups = getAccessoriesBySubcategory(accessories);

    // 🔍 Search filter (includes brand, model_name, sku)
    const filterBySearch = (list) =>
        list.filter((item) => {
            const brand = item.model_info?.brand || item.brand || '';
            const model = item.model_info?.model_name || item.model_name || '';
            const name = item.name || '';
            const sku = item.sku || '';
            return [brand, model, name, sku].some((field) =>
                field.toLowerCase().includes(searchTerm.toLowerCase())
            );
        });

    // 🟢 Status color for repair section
    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-800',
        in_progress: 'bg-blue-100 text-blue-800',
        completed: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800',
    };

    return (
        <div className="space-y-8">
            {/* 📱 Phones by Brand */}
            {(selectedCategory === 'All' || selectedCategory === 'Phones') &&
                Object.keys(brandGroups).length > 0 && (
                    <div className="bg-white/90 rounded-2xl shadow-lg p-6 border border-amber-100 backdrop-blur-sm">
                        <h3 className="text-2xl font-bold mb-5 flex items-center gap-2 text-orange-600">
                            <Phone className="w-6 h-6 text-orange-500" />
                            Phones by Brand
                        </h3>

                        <div className="space-y-8">
                            {Object.entries(brandGroups).map(([brand, brandProducts]) => (
                                <div key={brand}>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 text-white px-4 py-2 rounded-xl font-semibold text-lg shadow-md">
                                            {brand}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {brandProducts.length} models
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                        {filterBySearch(brandProducts).map((product) => (
                                            <ProductCard
                                                key={product.id}
                                                product={product}
                                                onAdd={onAddToCart}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            {/* 🎧 Accessories by Type */}
            {(selectedCategory === 'All' || selectedCategory === 'Accessories') &&
                Object.keys(accessoryGroups).length > 0 && (
                    <div className="bg-white/90 rounded-2xl shadow-lg p-6 border border-amber-100 backdrop-blur-sm">
                        <h3 className="text-2xl font-bold mb-5 flex items-center gap-2 text-orange-600">
                            <Package className="w-6 h-6 text-amber-600" />
                            Accessories by Type
                        </h3>

                        <div className="space-y-8">
                            {Object.entries(accessoryGroups).map(([type, items]) => (
                                <div key={type}>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-white px-4 py-2 rounded-xl font-semibold text-lg shadow-md">
                                            {type}
                                        </div>
                                        <div className="text-sm text-gray-500">{items.length} items</div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                                        {filterBySearch(items).map((product) => (
                                            <ProductCard
                                                key={product.id}
                                                product={product}
                                                onAdd={onAddToCart}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            {/* 🧰 Repairs Section */}
            {(selectedCategory === 'All' || selectedCategory === 'Repairs') && repairs.length > 0 && (
                <div className="bg-white/90 rounded-2xl shadow-lg p-6 border border-amber-100 backdrop-blur-sm">
                    <h3 className="text-2xl font-bold mb-5 flex items-center gap-2 text-orange-600">
                        <Wrench className="w-6 h-6 text-orange-500" />
                        Repairs Status
                    </h3>

                    <div className="overflow-x-auto rounded-xl border border-orange-100">
                        <table className="w-full text-sm">
                            <thead className="bg-gradient-to-r from-orange-50 to-yellow-50 border-b border-orange-200">
                            <tr>
                                <th className="px-4 py-3 text-left font-bold text-orange-700 uppercase text-xs">
                                    Customer
                                </th>
                                <th className="px-4 py-3 text-left font-bold text-orange-700 uppercase text-xs">
                                    Device
                                </th>
                                <th className="px-4 py-3 text-left font-bold text-orange-700 uppercase text-xs">
                                    Issue
                                </th>
                                <th className="px-4 py-3 text-right font-bold text-orange-700 uppercase text-xs">
                                    Cost
                                </th>
                                <th className="px-4 py-3 text-center font-bold text-orange-700 uppercase text-xs">
                                    Status
                                </th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-orange-100">
                            {filterBySearch(repairs).map((r) => (
                                <tr key={r.id} className="hover:bg-orange-50 transition-colors">
                                    <td className="px-4 py-3 font-medium text-gray-800">
                                        {r.customer_name}
                                    </td>
                                    <td className="px-4 py-3 text-gray-700">
                                        {r.device || '-'}
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">
                                        {r.issue || '-'}
                                    </td>
                                    <td className="px-4 py-3 text-right text-gray-800 font-semibold">
                                        RM {parseFloat(r.cost || 0).toFixed(2)}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                    statusColors[r.status] || 'bg-gray-100 text-gray-700'
                                                }`}
                                            >
                                                {r.status?.replace('_', ' ') || 'Pending'}
                                            </span>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BrandCategoryView;
