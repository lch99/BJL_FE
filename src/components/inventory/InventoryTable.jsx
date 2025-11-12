import React from "react";
import { Pencil, Trash2 } from "lucide-react";

export default function InventoryTable({ items, onEdit, onDelete, type }) {

    const formatPrice = (val) => `RM ${parseFloat(val).toLocaleString('en-MY', { minimumFractionDigits: 2 })}`;

    const getStockBadge = (stock) => {
        if (stock <= 5) return <span className="px-2 py-1 text-xs font-semibold bg-red-500 text-white rounded-full">Low</span>;
        if (stock <= 20) return <span className="px-2 py-1 text-xs font-semibold bg-yellow-400 text-white rounded-full">Medium</span>;
        return <span className="px-2 py-1 text-xs font-semibold bg-green-500 text-white rounded-full">High</span>;
    };

    const getConditionBadge = (condition) => {
        if (!condition) return null;
        const colorMap = { new: "bg-green-500", used: "bg-gray-500", refurbished: "bg-yellow-500" };
        return (
            <span className={`px-2 py-1 text-xs font-semibold text-white rounded-full ${colorMap[condition.toLowerCase()] || "bg-gray-500"}`}>
        {condition.charAt(0).toUpperCase() + condition.slice(1)}
      </span>
        );
    };

    return (
        <div className="overflow-x-auto bg-white rounded-xl shadow border border-orange-200">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-orange-100 text-orange-800 uppercase text-sm font-semibold">
                <tr>
                    <th className="px-4 py-3">#</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Brand</th>
                    <th className="px-4 py-3">SKU</th>

                    {type === "phones" && (
                        <>
                            <th className="px-4 py-3">Color</th>
                            <th className="px-4 py-3">RAM</th>
                            <th className="px-4 py-3">Storage</th>
                            <th className="px-4 py-3">Condition</th>
                            <th className="px-4 py-3">Warranty</th>
                        </>
                    )}

                    {type === "accessories" && (
                        <th className="px-4 py-3">Subcategory</th>
                    )}

                    <th className="px-4 py-3">Stock</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Cost</th>
                    <th className="px-4 py-3">Actions</th>
                </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 text-sm">
                {items.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-orange-50 transition">
                        <td className="px-4 py-2">{idx + 1}</td>
                        <td className="px-4 py-2 font-medium">{item.name}</td>
                        <td className="px-4 py-2">{item.brand || '-'}</td>
                        <td className="px-4 py-2">{item.sku || '-'}</td>

                        {type === "phones" && (
                            <>
                                <td className="px-4 py-2">{item.color || '-'}</td>
                                <td className="px-4 py-2">{item.ram ? `${item.ram}GB` : '-'}</td>
                                <td className="px-4 py-2">{item.storage ? `${item.storage}GB` : '-'}</td>
                                <td className="px-4 py-2">{getConditionBadge(item.condition)}</td>
                                <td className="px-4 py-2">{item.warranty_months ? `${item.warranty_months} months` : '-'}</td>
                            </>
                        )}

                        {type === "accessories" && (
                            <td className="px-4 py-2">{item.subcategory || '-'}</td>
                        )}

                        <td className="px-4 py-2">{getStockBadge(item.stock)}</td>
                        <td className="px-4 py-2">{formatPrice(item.price)}</td>
                        <td className="px-4 py-2">{formatPrice(item.cost)}</td>

                        <td className="px-4 py-2 flex gap-2">
                            <button
                                onClick={() => onEdit(item)}
                                className="flex items-center justify-center px-3 py-1 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                                title="Edit Item"
                            >
                                <Pencil size={16} />
                            </button>
                            <button
                                onClick={() => onDelete(item)}
                                className="flex items-center justify-center px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                                title="Delete Item"
                            >
                                <Trash2 size={16} />
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
