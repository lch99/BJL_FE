// src/components/POS/POSView.jsx
import React from 'react';
import { Search, List, Grid3x3, Package } from 'lucide-react';
import BrandCategoryView from './BrandCategoryView';
import ProductCard from './ProductCard';
import Cart from './Cart';

const POSView = ({
                     products,
                     filteredProducts,
                     cart,
                     addToCart,
                     updateQuantity,
                     removeFromCart,
                     clearCart,
                     subtotal,
                     discountValue,
                     total,
                     initiatePayment,
                     customerName,
                     setCustomerName,
                     customerPhone,
                     setCustomerPhone,
                     discount,
                     setDiscount,
                     discountType,
                     setDiscountType,
                     searchTerm,
                     setSearchTerm,
                     selectedCategory,
                     setSelectedCategory,
                     viewMode,
                     setViewMode,
                     loading,
                     error,
                     onReload
                 }) => {
    return (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 space-y-4">
                <div className="bg-white rounded-xl shadow-lg p-6 border border-amber-100">
                    <div className="flex flex-wrap gap-3 mb-4">
                        <div className="relative flex-1 min-w-[200px]">
                            <Search className="absolute left-3 top-3 w-5 h-5 text-amber-500" />
                            <input
                                type="text"
                                placeholder="Search by name, SKU, or brand..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border-2 border-amber-200 rounded-lg focus:outline-none focus:border-amber-500"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setViewMode('brands')}
                                className={`px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all ${viewMode === 'brands'
                                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                                    : 'bg-amber-50 hover:bg-amber-100 text-amber-700'
                                }`}
                            >
                                <List className="w-5 h-5" /> By Brand
                            </button>
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all ${viewMode === 'grid'
                                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                                    : 'bg-amber-50 hover:bg-amber-100 text-amber-700'
                                }`}
                            >
                                <Grid3x3 className="w-5 h-5" /> Grid View
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-2 mb-4">
                        {['All', 'Phones', 'Accessories'].map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedCategory === cat
                                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white'
                                    : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {loading && (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
                            <p className="mt-4 text-amber-600">Loading products...</p>
                        </div>
                    )}

                    {error && (
                        <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4 mb-4">
                            <p className="text-orange-800 font-medium">{error}</p>
                            <button
                                onClick={onReload}
                                className="mt-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                            >
                                Retry
                            </button>
                        </div>
                    )}

                    {!loading && !error && (
                        <div className="max-h-[600px] overflow-y-auto pr-2">
                            {viewMode === 'brands' ? (
                                <BrandCategoryView
                                    products={products}
                                    selectedCategory={selectedCategory}
                                    searchTerm={searchTerm}
                                    onAddToCart={addToCart}
                                />
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                                    {filteredProducts.length === 0 ? (
                                        <div className="col-span-full text-center py-12 text-amber-400">
                                            <Package className="w-16 h-16 mx-auto mb-3 opacity-40" />
                                            <p className="font-medium">No products found</p>
                                            <p className="text-sm">Try adjusting filters</p>
                                        </div>
                                    ) : (
                                        filteredProducts.map(product => (
                                            <ProductCard key={product.id} product={product} onAdd={addToCart} />
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <Cart
                cart={cart}
                customerName={customerName}
                setCustomerName={setCustomerName}
                customerPhone={customerPhone}
                setCustomerPhone={setCustomerPhone}
                discount={discount}
                setDiscount={setDiscount}
                discountType={discountType}
                setDiscountType={setDiscountType}
                updateQuantity={updateQuantity}
                removeFromCart={removeFromCart}
                clearCart={clearCart}
                calculateSubtotal={subtotal}
                calculateDiscount={discountValue}
                calculateTotal={total}
                initiatePayment={initiatePayment}
            />
        </div>
    );
};

export default POSView;
