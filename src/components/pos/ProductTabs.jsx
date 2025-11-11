// src/components/pos/ProductTabs.jsx
import React from "react";

const ProductTabs = ({ activeTab, setActiveTab }) => {
    return (
        <div className="flex gap-2">
            {[
                { id: "phones", label: "Phones" },
                { id: "accessories", label: "Accessories" },
            ].map((t) => (
                <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className={`px-4 py-2 rounded-lg font-semibold transition ${
                        activeTab === t.id
                            ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow"
                            : "bg-white text-amber-700 border border-amber-100 hover:bg-amber-50"
                    }`}
                >
                    {t.label}
                </button>
            ))}
        </div>
    );
};

export default ProductTabs;
