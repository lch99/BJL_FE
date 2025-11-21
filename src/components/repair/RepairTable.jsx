import React from "react";
import { Pencil, Trash2 } from "lucide-react";

export default function RepairTable({ repairs, onEdit, onDelete }) {
    const formatDate = (d) => new Date(d).toLocaleDateString("en-MY", {
        year: "numeric",
        month: "short",
        day: "numeric"
    });

    const statusBadge = (status) => {
        const color = {
            pending: "bg-yellow-400",
            in_progress: "bg-blue-500",
            completed: "bg-green-500",
        }[status] || "bg-gray-400";

        return (
            <span className={`px-2 py-1 text-xs font-semibold text-white rounded-full ${color}`}>
                {status.replace("_", " ")}
            </span>
        );
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-gray-800 border-collapse">
                <thead className="bg-orange-100 text-orange-800 uppercase text-xs font-semibold">
                <tr>
                    <th className="px-4 py-3 text-left">#</th>
                    <th className="px-4 py-3 text-left">Customer</th>
                    <th className="px-4 py-3 text-left">Phone</th>
                    <th className="px-4 py-3 text-left">Device</th>
                    <th className="px-4 py-3 text-left">Issue</th>
                    <th className="px-4 py-3 text-left">Cost (RM)</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Created</th>
                    <th className="px-4 py-3 text-center">Actions</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                {repairs.map((r, i) => (
                    <tr key={r.id} className="hover:bg-orange-50 transition">
                        <td className="px-4 py-2">{i + 1}</td>
                        <td className="px-4 py-2">{r.customer_name || "-"}</td>
                        <td className="px-4 py-2">{r.customer_phone || "-"}</td>
                        <td className="px-4 py-2">{r.device_model || "-"}</td>
                        <td className="px-4 py-2">{r.issue_description || "-"}</td>
                        <td className="px-4 py-2">{parseFloat(r.repair_cost || 0).toFixed(2)}</td>
                        <td className="px-4 py-2">{statusBadge(r.status)}</td>
                        <td className="px-4 py-2">{r.created_at ? formatDate(r.created_at) : "-"}</td>
                        <td className="px-4 py-2 flex gap-2 justify-center">
                            <button
                                onClick={() => onEdit(r)}
                                className="p-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg"
                                title="Edit"
                            >
                                <Pencil size={16} />
                            </button>
                            <button
                                onClick={() => onDelete(r)}
                                className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                                title="Delete"
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
