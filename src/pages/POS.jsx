// src/pages/POS.jsx
import React, { useState, useEffect } from "react";
import {
    ShoppingCart,
    Package,
    BarChart3,
    Wrench,
    Truck,
    ClipboardList,
} from "lucide-react";

// Components
import Header from "../components/pos/Header";
import POSView from "../components/pos/PosView";
import InventoryView from "../components/pos/InventoryView";
import ReportsView from "../components/pos/ReportsView";
import RepairsView from "../components/pos/RepairsView";
import PaymentModal from "../components/pos/PaymentModal";
import ReceiptModal from "../components/pos/ReceiptModal";

// Newly added modules
import Supplier from "../components/pos/Supplier/SupplierView";
import Purchase from "../components/pos/Purchase/PurchaseView";

// Utilities
import {
    calculateSubtotal,
    calculateDiscount,
    calculateTotal,
    calculateProfit,
    getTodaySales,
    getTodayProfit,
    filterProducts,
} from "../util/calculations";
import { fetchProducts, createSale, fetchTransactions } from "../util/posApi";

const POS = ({ user, onLogout }) => {
    const [showUserManagement, setShowUserManagement] = useState(false);
    const [activeTab, setActiveTab] = useState("pos");
    const [products, setProducts] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [cart, setCart] = useState([]);

    // Customer + Discount
    const [customerName, setCustomerName] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [discount, setDiscount] = useState(0);
    const [discountType, setDiscountType] = useState("fixed");

    // Modals
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showReceiptModal, setShowReceiptModal] = useState(false);

    // Payment
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [receivedAmount, setReceivedAmount] = useState("");
    const [lastReceipt, setLastReceipt] = useState(null);

    // Misc
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [viewMode, setViewMode] = useState("brands");

    // ===== Fetch data =====
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
        } catch (err) {
            console.error("Error loading products:", err);
            setError("Failed to load products. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const dailySales = getTodaySales(transactions);
    const dailyProfit = getTodayProfit(transactions);

    const loadTransactions = async () => {
        try {
            const data = await fetchTransactions();
            setTransactions(data);
        } catch (err) {
            console.error("Error loading transactions:", err);
        }
    };

    // ===== Cart logic =====
    const addToCart = (product) => {
        const stock = product.quantity || product.stock;
        if (stock === 0) return alert("Out of stock!");

        const existing = cart.find((i) => i.id === product.id);
        if (existing) {
            if (existing.quantity < stock) {
                setCart(
                    cart.map((i) =>
                        i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
                    )
                );
            } else alert("Stock limit reached!");
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }
    };

    const updateQuantity = (id, qty) => {
        const product = products.find((p) => p.id === id);
        if (!product) return;
        const stock = product.quantity || product.stock;
        if (qty <= 0) removeFromCart(id);
        else if (qty <= stock)
            setCart(cart.map((i) => (i.id === id ? { ...i, quantity: qty } : i)));
        else alert(`Only ${stock} items available!`);
    };

    const removeFromCart = (id) => setCart(cart.filter((i) => i.id !== id));
    const clearCart = () => {
        setCart([]);
        setDiscount(0);
        setCustomerName("");
        setCustomerPhone("");
    };

    // ===== Calculations =====
    const subtotal = () => calculateSubtotal(cart);
    const discountValue = () => calculateDiscount(cart, discount, discountType);
    const total = () => calculateTotal(cart, discount, discountType);
    const profit = () => calculateProfit(cart, discount, discountType);

    // ===== Sale logic =====
    const initiatePayment = () => {
        if (cart.length === 0) return alert("Cart is empty!");
        setShowPaymentModal(true);
        setReceivedAmount(total().toFixed(2));
    };

    const completeSale = async () => {
        const totalAmt = total();
        const received = parseFloat(receivedAmount) || 0;
        if (received < totalAmt) return alert("Received amount is less than total!");

        const items = cart.map((i) => ({
            id: parseInt(String(i.id).replace(/\D/g, ""), 10),
            type: i.category === "Phones" ? "phone" : "accessory",
            quantity: i.quantity,
            price: parseFloat(i.sell_price || i.price),
        }));

        const saleData = {
            worker_id: user?.id || null,
            items,
            total_amount: totalAmt,
            payment_method: paymentMethod,
            paid_amount: received,
        };

        try {
            setLoading(true);
            const result = await createSale(saleData);
            const newTxn = {
                id: result.id || `TXN-${Date.now()}`,
                date: new Date().toISOString(),
                customer: customerName || "Walk-in Customer",
                phone: customerPhone || "N/A",
                items: cart,
                subtotal: subtotal(),
                discount: discountValue(),
                total: totalAmt,
                profit: profit(),
                paymentMethod,
                receivedAmount: received,
                change: received - totalAmt,
            };
            // Update stock
            setProducts(
                products.map((p) => {
                    const item = cart.find((c) => c.id === p.id);
                    if (item) {
                        const stock = p.quantity || p.stock;
                        return { ...p, stock: stock - item.quantity, quantity: stock - item.quantity };
                    }
                    return p;
                })
            );

            setTransactions([newTxn, ...transactions]);
            setLastReceipt(newTxn);
            clearCart();
            setShowPaymentModal(false);
            setShowReceiptModal(true);
        } catch (err) {
            console.error("❌ Error completing sale:", err);
            alert("Failed to complete sale. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = filterProducts(products, searchTerm, selectedCategory);

    // ===== Daily Summary =====
    const todaySales = getTodaySales(transactions);
    const todayProfit = getTodayProfit(transactions);

    // ===== Render =====
    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 text-gray-800">
            <Header
                user={user}
                todaySales={dailySales}
                todayProfit={dailyProfit}
                onLogout={onLogout}
                onUserManage={() => setShowUserManagement(true)}
            />

            <div className="container mx-auto px-4 py-6">
                {/* Tabs */}
                <div className="flex gap-3 mb-6 flex-wrap">
                    {[
                        { id: "pos", icon: ShoppingCart, label: "Point of Sale" },
                        { id: "inventory", icon: Package, label: "Inventory" },
                        { id: "repairs", icon: Wrench, label: "Repairs" },
                        { id: "supplier", icon: Truck, label: "Suppliers" },
                        { id: "purchase", icon: ClipboardList, label: "Purchases" },
                        { id: "reports", icon: BarChart3, label: "Reports" },
                    ].map((tab) => {
                        const Icon = tab.icon;
                        const active = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                                    active
                                        ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg scale-105"
                                        : "bg-white text-amber-800 hover:bg-amber-100 border border-amber-200"
                                }`}
                            >
                                <Icon className="w-5 h-5" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Tab Views */}
                {activeTab === "pos" && (
                    <POSView
                        products={products}
                        filteredProducts={filteredProducts}
                        cart={cart}
                        addToCart={addToCart}
                        updateQuantity={updateQuantity}
                        removeFromCart={removeFromCart}
                        clearCart={clearCart}
                        calculateSubtotal={subtotal}
                        calculateDiscount={discountValue}
                        calculateTotal={total}
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

                {activeTab === "inventory" && (
                    <InventoryView products={products} setProducts={setProducts} onReload={loadProducts} />
                )}

                {activeTab === "repairs" && <RepairsView />}

                {activeTab === "supplier" && <Supplier />}

                {activeTab === "purchase" && <Purchase />}

                {activeTab === "reports" && (
                    <ReportsView
                        transactions={transactions}
                        setLastReceipt={setLastReceipt}
                        setShowReceiptModal={setShowReceiptModal}
                    />
                )}
            </div>

            {/* Modals */}
            <PaymentModal
                show={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                total={total()}
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
