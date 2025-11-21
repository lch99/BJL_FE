// src/components/pos/ProductCard.jsx
import React from "react";
import { Plus } from "lucide-react";

const ProductCard = ({ item, onAdd }) => {
    return (
        <div
            className="
                bg-[var(--mt-card)]
                border border-[var(--mt-border)]
                rounded-xl shadow-sm p-3 cursor-pointer flex flex-col justify-between
                transition hover:shadow-md
            "
            onClick={onAdd}
            role="button"
            tabIndex={0}
        >
            {/* Product Name + Brand */}
            <div>
                <div className="text-sm font-semibold text-[var(--mt-text)] truncate">
                    {item.name}
                </div>
                <div className="text-xs text-[var(--mt-text-light)] truncate">
                    {item.brand || "—"}
                </div>
            </div>

            {/* Price + Stock + Add Button */}
            <div className="mt-3 flex items-center justify-between">
                <div className="font-bold text-[var(--mt-accent)]">
                    RM {Number(item.price || 0).toFixed(2)}
                </div>

                <div className="flex items-center gap-2">
                    <div className="text-xs text-[var(--mt-text-light)]">
                        Stock: {item.stock}
                    </div>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onAdd();
                        }}
                        className="
                            px-2 py-1 rounded-md text-sm text-white
                            bg-[var(--mt-accent)]
                            hover:bg-[var(--mt-header-hover)]
                            transition
                            flex items-center justify-center
                        "
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
