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
                    className={`px-4 py-2 rounded-lg font-semibold transition-all
            ${
                        activeTab === t.id
                            ? "bg-theme-accent text-theme-text shadow-md" // Active: caramel bg, dark text
                            : "bg-theme-card text-theme-text-light border border-theme-border hover:bg-theme-surface-light" // Inactive: light bg, medium brown text
                    }`}
                >
                    {t.label}
                </button>
            ))}
        </div>
    );
};

export default ProductTabs;
