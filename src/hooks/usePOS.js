// src/hooks/usePOS.js
import { useState, useEffect } from "react";
import { fetchProducts, fetchTransactions, createSale } from "../util/posApi";
import { calculateSubtotal, calculateDiscount, calculateTotal, calculateProfit, getTodaySales, getTodayProfit, filterProducts } from "../util/calculations";

export const usePOS = (user) => {
    const [products, setProducts] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [cart, setCart] = useState([]);
    const [customerName, setCustomerName] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [discount, setDiscount] = useState(0);
    const [discountType, setDiscountType] = useState("fixed");
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [receivedAmount, setReceivedAmount] = useState("");
    const [lastReceipt, setLastReceipt] = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showReceiptModal, setShowReceiptModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [viewMode, setViewMode] = useState("brands");

    useEffect(() => { loadProducts(); loadTransactions(); }, []);

    const loadProducts = async () => {
        try { setLoading(true); setError(null); setProducts(await fetchProducts()); }
        catch (err) { console.error(err); setError("Failed to load products"); }
        finally { setLoading(false); }
    };

    const loadTransactions = async () => {
        try { setTransactions(await fetchTransactions()); }
        catch (err) { console.error(err); }
    };

    // Cart functions
    const addToCart = (product) => {
        const stock = product.quantity || product.stock;
        if (!stock) return alert("Out of stock!");
        const existing = cart.find(i => i.id === product.id);
        if (existing) {
            if (existing.quantity < stock) setCart(cart.map(i => i.id === product.id ? {...i, quantity: i.quantity+1} : i));
            else alert("Stock limit reached!");
        } else setCart([...cart, {...product, quantity:1}]);
    };

    const updateQuantity = (id, qty) => {
        const product = products.find(p => p.id === id);
        if (!product) return;
        const stock = product.quantity || product.stock;
        if (qty <= 0) removeFromCart(id);
        else if (qty <= stock) setCart(cart.map(i => i.id === id ? {...i, quantity: qty} : i));
        else alert(`Only ${stock} items available!`);
    };

    const removeFromCart = (id) => setCart(cart.filter(i => i.id !== id));
    const clearCart = () => { setCart([]); setDiscount(0); setCustomerName(""); setCustomerPhone(""); };

    // Calculations
    const subtotal = () => calculateSubtotal(cart);
    const discountValue = () => calculateDiscount(cart, discount, discountType);
    const total = () => calculateTotal(cart, discount, discountType);
    const profit = () => calculateProfit(cart, discount, discountType);

    // Payment & Sale
    const initiatePayment = () => {
        if (!cart.length) return alert("Cart is empty!");
        setShowPaymentModal(true);
        setReceivedAmount(total().toFixed(2));
    };

    const completeSale = async () => {
        const totalAmt = total();
        const received = parseFloat(receivedAmount) || 0;
        if (received < totalAmt) return alert("Received amount is less than total!");

        const items = cart.map(i => ({
            id: parseInt(String(i.id).replace(/\D/g,''),10),
            type: i.category === "Phones" ? "phone":"accessory",
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
            setProducts(products.map(p=>{
                const item = cart.find(c=>c.id===p.id);
                if(item){ const stock = p.quantity||p.stock; return {...p, stock: stock-item.quantity, quantity: stock-item.quantity}; }
                return p;
            }));
            setTransactions([newTxn,...transactions]);
            setLastReceipt(newTxn);
            clearCart();
            setShowPaymentModal(false);
            setShowReceiptModal(true);
        } catch(err){ console.error(err); alert("Failed to complete sale."); }
        finally{ setLoading(false); }
    };

    return {
        products, transactions, cart,
        customerName, setCustomerName,
        customerPhone, setCustomerPhone,
        discount, setDiscount,
        discountType, setDiscountType,
        paymentMethod, setPaymentMethod,
        receivedAmount, setReceivedAmount,
        lastReceipt,
        showPaymentModal, setShowPaymentModal,
        showReceiptModal, setShowReceiptModal,
        loading, error,
        searchTerm, setSearchTerm,
        selectedCategory, setSelectedCategory,
        viewMode, setViewMode,
        addToCart, updateQuantity, removeFromCart, clearCart,
        subtotal, discountValue, total, profit,
        initiatePayment, completeSale,
        loadProducts, loadTransactions,
        filteredProducts: filterProducts(products, searchTerm, selectedCategory),
    };
};
