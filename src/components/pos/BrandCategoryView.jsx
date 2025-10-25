import React from 'react';
import { Phone, Package } from 'lucide-react';
import ProductCard from './ProductCard';
import { getProductsByBrand, getAccessoriesBySubcategory } from '../../util/calculations';

const BrandCategoryView = ({ products, selectedCategory, searchTerm, onAddToCart }) => {
    const brandGroups = getProductsByBrand(products);
    const accessoryGroups = getAccessoriesBySubcategory(products);

    const filterBySearch = (productList) =>
        productList.filter(
            (p) =>
                p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
        );

    return (
        <div className="space-y-6">
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

            {/* 🎧 Accessories by Subcategory */}
            {(selectedCategory === 'All' || selectedCategory === 'Accessories') &&
                Object.keys(accessoryGroups).length > 0 && (
                    <div className="bg-white/90 rounded-2xl shadow-lg p-6 border border-amber-100 backdrop-blur-sm">
                        <h3 className="text-2xl font-bold mb-5 flex items-center gap-2 text-orange-600">
                            <Package className="w-6 h-6 text-amber-600" />
                            Accessories by Category
                        </h3>

                        <div className="space-y-8">
                            {Object.entries(accessoryGroups).map(([subcategory, subcatProducts]) => (
                                <div key={subcategory}>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-white px-4 py-2 rounded-xl font-semibold text-lg shadow-md">
                                            {subcategory}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {subcatProducts.length} items
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                                        {filterBySearch(subcatProducts).map((product) => (
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
        </div>
    );
};

export default BrandCategoryView;
