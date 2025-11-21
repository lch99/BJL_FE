import React, { useState, useEffect } from "react";
import Header from "../components/common/Header";
import ProductTabs from "../components/pos/ProductTabs";
import ProductGrid from "../components/pos/ProductGrid";
import Cart from "../components/pos/Cart";
import { useToast } from "../components/common/FeedbackToast";
import { fetchPhones, fetchAccessories } from "../util/posApi";

const POS = ({ user, pos }) => {
    const [activeTab, setActiveTab] = useState("phones");
    const [phones, setPhones] = useState([]);
    const [accessories, setAccessories] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [cart, setCart] = useState([]);
    const { showToast } = useToast();

    // Load products
    const loadProducts = async () => {
        try {
            const [p, a] = await Promise.all([fetchPhones(), fetchAccessories()]);
            setPhones(p || []);
            setAccessories(a || []);
        } catch (err) {
            console.error("Failed to load products:", err);
            showToast({ type: "error", message: "Failed to load products" });
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    const products = activeTab === "phones" ? phones : accessories;

    const normalizeProductToCartItem = (p, category) => {
        if (category === "phones") {
            const model = p.model_info || {};
            const name = `${model.model_name || "Phone"}${p.color ? ` (${p.color})` : ""}`.trim();
            return {
                itemId: model.id,
                sourceId: p.id,
                category: "Phones",
                brand: model.brand || "Unknown",
                name,
                price: Number(p.sell_price || p.price || 0),
                cost: Number(p.purchase_price || p.cost || 0) || 0,
                stock: p.quantity ?? 0,
                raw: p,
                quantity: 1,
            };
        }
        return {
            itemId: p.id,
            sourceId: p.id,
            category: "Accessories",
            brand: p.brand || "Unknown",
            name: p.name || p.sku || "Accessory",
            price: Number(p.sell_price || p.price || 0),
            cost: Number(p.purchase_price || p.cost || 0) || 0,
            stock: p.quantity ?? p.stock ?? 0,
            raw: p,
            quantity: 1,
        };
    };

    const addToCart = (rawProduct) => {
        const category = activeTab === "phones" ? "phones" : "accessories";
        const normalized = normalizeProductToCartItem(rawProduct, category);

        setCart((prev) => {
            const existing = prev.find(
                (i) => i.itemId === normalized.itemId && i.category === normalized.category
            );
            if (existing) {
                return prev.map((i) =>
                    i.itemId === normalized.itemId ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [...prev, normalized];
        });
    };

    const updateQuantity = (itemId, qty) => {
        setCart((prev) =>
            prev
                .map((c) => (c.itemId === itemId ? { ...c, quantity: Math.max(0, qty) } : c))
                .filter((c) => c.quantity > 0)
        );
    };

    const removeFromCart = (itemId) =>
        setCart((prev) => prev.filter((c) => c.itemId !== itemId));
    const clearCart = () => setCart([]);

    const subtotal = () =>
        cart.reduce((s, i) => s + (i.price || 0) * (i.quantity || 0), 0);

    return (
        <div className="min-h-screen bg-theme-bg text-theme-text">
            <Header user={user} todaySales={0} todayProfit={0} />

            <div className="pt-28 px-6 container mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* LEFT: Product Selection */}
                <div className="lg:col-span-8 bg-theme-card/80 backdrop-blur-md border border-theme-border rounded-2xl p-4 overflow-hidden shadow-lg">
                    <div className="mb-4 flex items-center gap-3">
                        <ProductTabs activeTab={activeTab} setActiveTab={setActiveTab} />
                        <input
                            className="ml-auto border border-theme-border rounded-lg px-3 py-2 w-64 text-theme-text focus:ring-1 focus:ring-theme-accent bg-theme-card"
                            placeholder="Search products (name / model / SKU)..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <ProductGrid
                        products={products}
                        activeTab={activeTab}
                        searchTerm={searchTerm}
                        onAddToCart={addToCart}
                        onAdd={addToCart}
                    />
                </div>

                {/* RIGHT: Cart */}
                <div className="lg:col-span-4 bg-theme-card/80 backdrop-blur-md border border-theme-border rounded-2xl p-4 shadow-lg">
                    <Cart
                        cart={cart}
                        updateQuantity={updateQuantity}
                        removeFromCart={removeFromCart}
                        clearCart={clearCart}
                        subtotal={subtotal}
                        currentUserId={user?.id ?? 1}
                        showDialog={(cfg) => showToast({ ...cfg })}
                        reloadProducts={loadProducts}
                    />
                </div>
            </div>
        </div>
    );
};

export default POS;
