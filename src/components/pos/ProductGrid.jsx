import React, { useMemo } from "react";
import ProductCard from "./ProductCard";

const ProductGrid = ({ products = [], activeTab = "phones", searchTerm = "", onAddToCart }) => {
    const normalized = useMemo(() => {
        return (products || []).map((p) => {
            if (activeTab === "phones") {
                const model = p.model_info || {};
                const name = `${model.model_name || "Phone"}${p.color ? " — " + p.color : ""}`;
                return {
                    id: p.id,
                    brand: model.brand || "Unknown",
                    name,
                    price: parseFloat(p.sell_price || 0),
                    stock: p.quantity ?? 0,
                    raw: p,
                };
            } else {
                return {
                    id: p.id,
                    brand: p.brand || "Unknown",
                    name: p.name || p.sku || "Accessory",
                    price: parseFloat(p.sell_price || p.price || 0),
                    stock: p.quantity ?? p.stock ?? 0,
                    raw: p,
                };
            }
        });
    }, [products, activeTab]);

    const filtered = useMemo(() => {
        const q = (searchTerm || "").trim().toLowerCase();
        if (!q) return normalized;
        return normalized.filter(
            (it) =>
                (it.name || "").toLowerCase().includes(q) ||
                (it.brand || "").toLowerCase().includes(q) ||
                (it.raw?.sku || "").toLowerCase().includes(q)
        );
    }, [normalized, searchTerm]);

    const grouped = useMemo(() => {
        return filtered.reduce((acc, item) => {
            const brand = item.brand || "Others";
            if (!acc[brand]) acc[brand] = [];
            acc[brand].push(item);
            return acc;
        }, {});
    }, [filtered]);

    return (
        <div className="overflow-y-auto" style={{ maxHeight: "68vh" }}>
            {Object.keys(grouped).length === 0 ? (
                <div className="py-16 text-center text-theme-text-light/70">No products found.</div>
            ) : (
                Object.entries(grouped).map(([brand, items]) => (
                    <div key={brand} className="mb-6">
                        <h3 className="text-lg font-semibold text-theme-accent mb-3">{brand}</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {items.map((it) => (
                                <ProductCard
                                    key={it.id}
                                    item={it}
                                    onAdd={() => onAddToCart(it.raw)}
                                    className="bg-theme-card border border-theme-border rounded-xl shadow hover:bg-theme-surface-light transition-all"
                                />
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default ProductGrid;
