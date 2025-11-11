// src/components/pos/ProductCard.jsx
import React from "react";
import { Plus } from "lucide-react";

const ProductCard = ({ item, onAdd }) => {
    return (
        <div
            className="bg-white rounded-xl border border-amber-100 shadow-sm p-3 hover:shadow-md transition cursor-pointer flex flex-col justify-between"
            onClick={onAdd}
            role="button"
            tabIndex={0}
        >
            <div>
                <div className="text-sm font-medium text-gray-800 truncate">{item.name}</div>
                <div className="text-xs text-gray-500">{item.brand}</div>
            </div>

            <div className="mt-3 flex items-center justify-between">
                <div className="text-amber-600 font-bold">RM {Number(item.price || 0).toFixed(2)}</div>
                <div className="flex items-center gap-2">
                    <div className="text-xs text-gray-400">Stock: {item.stock}</div>
                    <button
                        onClick={(e) => { e.stopPropagation(); onAdd(); }}
                        className="ml-2 px-2 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-md text-sm"
                    >
                        <Plus className="w-4 h-4 inline-block" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
