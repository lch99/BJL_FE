// src/components/pos/ProductGrid.jsx
import React, { useMemo } from "react";
import ProductCard from "./ProductCard";

/**
 * products: array of raw product objects (from your APIs)
 * activeTab: "phones" or "accessories" (used to map brand/name fields)
 * searchTerm: string
 * onAddToCart: function
 */
const ProductGrid = ({ products = [], activeTab = "phones", searchTerm = "", onAddToCart }) => {
    // Normalize products into display items
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
                // accessory
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

    // group by brand
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
                <div className="py-16 text-center text-gray-400">No products found.</div>
            ) : (
                Object.entries(grouped).map(([brand, items]) => (
                    <div key={brand} className="mb-6">
                        <h3 className="text-lg font-semibold text-amber-700 mb-3">{brand}</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {items.map((it) => (
                                <ProductCard key={it.id} item={it} onAdd={() => onAddToCart(it.raw)} />
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default ProductGrid;
