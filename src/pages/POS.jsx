// src/pages/POS.jsx
import React, { useState, useEffect } from 'react';
import { ShoppingCart, Package, BarChart3 } from 'lucide-react';

// Components
import Header from '../components/pos/Header';
import POSView from '../components/pos/PosView';
import InventoryView from '../components/pos/InventoryView';
import ReportsView from '../components/pos/ReportsView';
import PaymentModal from '../components/pos/PaymentModal';
import ReceiptModal from '../components/pos/ReceiptModal';

// Utilities
import {
    calculateSubtotal,
    calculateDiscount,
    calculateTotal,
    calculateProfit,
    getTodaySales,
    getTodayProfit,
    filterProducts
} from '../util/calculations';
import { fetchProducts, createSale, fetchTransactions } from '../util/posApi';

const POS = ({user, onLogout}) => {
    const [activeTab, setActiveTab] = useState('pos');
    const [viewMode, setViewMode] = useState('brands');

    const [products, setProducts] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [cart, setCart] = useState([]);
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [discount, setDiscount] = useState(0);
    const [discountType, setDiscountType] = useState('fixed');

    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showReceiptModal, setShowReceiptModal] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [receivedAmount, setReceivedAmount] = useState('');
    const [lastReceipt, setLastReceipt] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    useEffect(() => {
        loadProducts();
        loadTransactions();
    }, []);

    const loadProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchProducts();
            setProducts(data);
        } catch (error) {
            console.error('Error loading products:', error);
            setError('Failed to load products. Please try again.');
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const loadTransactions = async () => {
        try {
            const data = await fetchTransactions();
            setTransactions(data);
        } catch (error) {
            console.error('Error loading transactions:', error);
            setTransactions([]);
        }
    };

    const addToCart = (product) => {
        if (product.quantity === 0) return alert('Out of stock!');
        const existing = cart.find(item => item.id === product.id);
        if (existing) {
            if (existing.quantity < product.quantity) {
                setCart(cart.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                ));
            } else {
                alert('Stock limit reached!');
            }
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }
    };

    const updateQuantity = (id, newQty) => {
        const product = products.find(p => p.id === id);
        if (!product) return;
        if (newQty <= 0) removeFromCart(id);
        else if (newQty <= product.quantity) {
            setCart(cart.map(item =>
                item.id === id ? { ...item, quantity: newQty } : item
            ));
        } else alert(`Only ${product.quantity} items available!`);
    };

    const removeFromCart = (id) => setCart(cart.filter(item => item.id !== id));

    const clearCart = () => {
        setCart([]);
        setDiscount(0);
        setCustomerName('');
        setCustomerPhone('');
    };

    const getSubtotal = () => calculateSubtotal(cart);
    const getDiscount = () => calculateDiscount(cart, discount, discountType);
    const getTotal = () => calculateTotal(cart, discount, discountType);
    const getProfit = () => calculateProfit(cart, discount, discountType);
    const getDailySales = () => getTodaySales(transactions);
    const getDailyProfit = () => getTodayProfit(transactions);

    const initiatePayment = () => {
        if (cart.length === 0) return alert('Cart is empty!');
        setShowPaymentModal(true);
        setReceivedAmount(getTotal().toFixed(2));
    };

    const completeSale = async () => {
        const total = getTotal();
        const received = parseFloat(receivedAmount) || 0;
        if (received < total) return alert('Received amount is less than total!');

        const transaction = {
            id: `TXN-${Date.now()}`,
            date: new Date().toISOString(),
            customer: customerName || 'Walk-in Customer',
            phone: customerPhone || 'N/A',
            items: cart.map(i => ({
                id: i.id, name: i.name, price: i.sell_price, cost: i.purchase_price,
                quantity: i.quantity, sku: i.sku
            })),
            subtotal: getSubtotal(),
            discount: getDiscount(),
            total,
            profit: getProfit(),
            paymentMethod,
            receivedAmount: received,
            change: received - total
        };

        try {
            setLoading(true);
            await createSale(transaction);

            // Update stock
            setProducts(products.map(p => {
                const c = cart.find(ci => ci.id === p.id);
                return c ? { ...p, quantity: p.quantity - c.quantity } : p;
            }));

            setTransactions([transaction, ...transactions]);
            setLastReceipt(transaction);
            clearCart();
            setShowPaymentModal(false);
            setShowReceiptModal(true);
        } catch (err) {
            console.error('Error completing sale:', err);
            alert('Failed to complete sale.');
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = filterProducts(products, searchTerm, selectedCategory);

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 text-gray-800 font-inter">
            <Header todaySales={getDailySales()} todayProfit={getDailyProfit()} />

            <div className="container mx-auto px-4 py-6">
                <div className="flex gap-3 mb-6 flex-wrap">
                    {[
                        { id: 'pos', icon: ShoppingCart, label: 'Point of Sale' },
                        { id: 'inventory', icon: Package, label: 'Inventory' },
                        { id: 'reports', icon: BarChart3, label: 'Reports' }
                    ].map(tab => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${isActive
                                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg scale-105'
                                    : 'bg-white text-amber-800 hover:bg-amber-100 border border-amber-200'
                                }`}
                            >
                                <Icon className="w-5 h-5" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {activeTab === 'pos' && (
                    <POSView
                        products={products}
                        filteredProducts={filteredProducts}
                        cart={cart}
                        addToCart={addToCart}
                        updateQuantity={updateQuantity}
                        removeFromCart={removeFromCart}
                        clearCart={clearCart}
                        calculateSubtotal={getSubtotal}
                        calculateDiscount={getDiscount}
                        calculateTotal={getTotal}
                        initiatePayment={initiatePayment}
                        customerName={customerName}
                        setCustomerName={setCustomerName}
                        customerPhone={customerPhone}
                        setCustomerPhone={setCustomerPhone}
                        discount={discount}
                        setDiscount={setDiscount}
                        discountType={discountType}
                        setDiscountType={setDiscountType}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                        viewMode={viewMode}
                        setViewMode={setViewMode}
                        loading={loading}
                        error={error}
                        onReload={loadProducts}
                    />
                )}

                {activeTab === 'inventory' && (
                    <InventoryView products={products} setProducts={setProducts} onReload={loadProducts} />
                )}

                {activeTab === 'reports' && (
                    <ReportsView
                        transactions={transactions}
                        setLastReceipt={setLastReceipt}
                        setShowReceiptModal={setShowReceiptModal}
                    />
                )}
            </div>

            <PaymentModal
                show={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                total={getTotal()}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                receivedAmount={receivedAmount}
                setReceivedAmount={setReceivedAmount}
                onComplete={completeSale}
                loading={loading}
            />

            <ReceiptModal
                show={showReceiptModal}
                onClose={() => setShowReceiptModal(false)}
                receipt={lastReceipt}
            />
        </div>
    );
};

export default POS;
