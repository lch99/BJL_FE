import React, { useState, useEffect } from "react";
import DataTable from "../components/common/DataTable/DataTable";
import { Plus, Pencil, Trash2, RefreshCw } from "lucide-react";
import Header from "../components/common/Header";
import RepairForm from "../components/repair/RepairForm";
import { fetchRepairs, deleteRepair, updateRepair } from "../util/posApi";
import { useToast } from "../components/common/FeedbackToast";

const statusBadge = (status) => {
    const key = status?.toLowerCase();
    const config = {
        pending:     { bg: "bg-yellow-100 text-yellow-900 border border-yellow-300", label: "Pending" },
        in_progress: { bg: "bg-blue-100 text-blue-900 border border-blue-300",     label: "In Progress" },
        completed:   { bg: "bg-green-100 text-green-900 border border-green-300",  label: "Completed" },
        collected:   { bg: "bg-purple-100 text-purple-900 border border-purple-300", label: "Collected" },
        cancelled:   { bg: "bg-red-100 text-red-900 border border-red-300",        label: "Cancelled" },
    }[key] || { bg: "bg-gray-100 text-gray-900 border border-gray-300", label: status || "Unknown" };

    return (
        <span className={`px-5 py-2.5 rounded-full font-bold text-sm shadow-sm ${config.bg}`}>
      {config.label}
    </span>
    );
};

const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString("en-MY", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

export default function RepairView() {
    const [repairs, setRepairs] = useState([]);
    const [loading, setLoading] = useState(true); // ← this was the problem
    const [formVisible, setFormVisible] = useState(false);
    const [editingRepair, setEditingRepair] = useState(null);
    const [statusFilter, setStatusFilter] = useState("all");
    const [dateFilter, setDateFilter] = useState("all");
    const [activeMenuId, setActiveMenuId] = useState(null);
    const { showToast } = useToast();

    const loadRepairs = async () => {
        try {
            setLoading(true);
            const data = await fetchRepairs();
            setRepairs(data || []);
        } catch {
            showToast({ type: "error", message: "Failed to load repairs" });
            setRepairs([]); // ← important
        } finally {
            setLoading(false); // ← always set false
        }
    };

    useEffect(() => {
        loadRepairs();
    }, []);

    const handleDelete = async (repair) => {
        const numericId = repair.id.replace("repair-", "");
        if (!window.confirm(`Delete repair for ${repair.customer_name}?`)) return;
        try {
            await deleteRepair(numericId);
            loadRepairs();
            showToast({ type: "success", message: "Repair deleted" });
        } catch {
            showToast({ type: "error", message: "Delete failed" });
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        const numericId = id.replace("repair-", "");
        try {
            await updateRepair(numericId, { status: newStatus });
            loadRepairs();
            showToast({ type: "success", message: `Status → ${newStatus.replace("_", " ")}` });
        } catch {
            showToast({ type: "error", message: "Update failed" });
        }
        setActiveMenuId(null);
    };

    // Filter repairs
    const filteredRepairs = repairs.filter(r => {
        const matchStatus = statusFilter === "all" || r.status?.toLowerCase() === statusFilter;

        if (dateFilter === "all") return matchStatus;

        const today = new Date();
        const repairDate = new Date(r.created_at);

        const isToday = repairDate.toDateString() === today.toDateString();
        const isYesterday = repairDate.toDateString() === new Date(today - 86400000).toDateString();
        const isThisWeek = repairDate > new Date(today - 7 * 86400000);

        const matchDate =
            (dateFilter === "today" && isToday) ||
            (dateFilter === "yesterday" && isYesterday) ||
            (dateFilter === "this_week" && isThisWeek);

        return matchStatus && matchDate;
    });

    const repairsWithNumber = filteredRepairs.map((repair, index) => ({
        ...repair,
        rowNumber: index + 1,
    }));

    const columns = [
        { key: "rowNumber", label: "#", width: "60px", center: true },
        { key: "customer_name", label: "Customer", minWidth: "160px" },
        { key: "customer_phone", label: "Phone", width: "140px" },
        { key: "device_model", label: "Device", minWidth: "160px" },
        { key: "issue_description", label: "Issue", minWidth: "280px", wrap: true },
        { key: "repair_cost", label: "Cost (RM)", render: r => `RM ${(parseFloat(r.repair_cost || 0)).toFixed(2)}`, width: "130px", right: true },
        {
            key: "status",
            label: "Status",
            render: (row) => {
                const current = row.status?.toLowerCase() || "pending";

                const transitions = {
                    pending:     [{ value: "in_progress", label: "Start Repair" }],
                    in_progress: [{ value: "completed",   label: "Mark Completed" }, { value: "cancelled", label: "Cancel Repair" }],
                    completed:   [{ value: "collected",   label: "Customer Collected" }],
                    collected:   [],
                    cancelled:   [{ value: "pending",     label: "Reopen Repair" }],
                };

                const allowed = transitions[current] || [];

                return (
                    <div className="relative">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenuId(activeMenuId === row.id ? null : row.id);
                            }}
                            className={`px-5 py-2.5 rounded-full font-bold text-sm shadow-md transition-all ${
                                allowed.length > 0 ? "hover:shadow-lg hover:scale-105 cursor-pointer" : "cursor-default opacity-80"
                            }`}
                            style={{
                                backgroundColor: {
                                    pending:     "#fefce8",
                                    in_progress: "#dbeafe",
                                    completed:   "#d1fae5",
                                    collected:   "#f3e8ff",
                                    cancelled:   "#fee2e2",
                                }[current] || "#e5e7eb",
                                color: {
                                    pending:     "#854d0e",
                                    in_progress: "#1e40af",
                                    completed:   "#065f46",
                                    collected:   "#6b21a8",
                                    cancelled:   "#991b1b",
                                }[current] || "#374151",
                            }}
                        >
                            {statusBadge(row.status).props.children}
                        </button>

                        {activeMenuId === row.id && allowed.length > 0 && (
                            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-[var(--mt-border-dark)] z-20 overflow-hidden">
                                {allowed.map(opt => (
                                    <button
                                        key={opt.value}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleStatusChange(row.id, opt.value);
                                        }}
                                        className="w-full px-6 py-4 text-left hover:bg-[var(--mt-surface-light)] transition font-medium text-[var(--mt-text-dark)] flex items-center gap-3"
                                    >
                                        <span className="text-lg">→</span> {opt.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                );
            },
            minWidth: "240px",
            center: true,
        },
        { key: "created_at", label: "Created At", render: r => formatDateTime(r.created_at), width: "200px", center: true },
        { key: "updated_at", label: "Updated At", render: r => formatDateTime(r.updated_at), width: "200px", center: true },
        {
            key: "actions",
            label: "Actions",
            render: (row) => (
                <div className="flex gap-3 justify-center">
                    <button
                        onClick={() => {
                            setEditingRepair({
                                ...row,
                                id: row.id.replace("repair-", "")
                            });
                            setFormVisible(true);
                        }}
                        className="p-2.5 bg-[var(--mt-accent)] hover:bg-[var(--mt-header-hover)] text-white rounded-xl shadow-md transition"
                        title="Edit"
                    >
                        <Pencil size={18} />
                    </button>
                    <button
                        onClick={() => handleDelete(row)}
                        className="p-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-md transition"
                        title="Delete"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            ),
            width: "120px",
            center: true,
        },
    ];

    return (
        <div className="h-full w-full flex flex-col bg-[var(--mt-bg)] page-container">
            <Header title="Repairs" />

            <div className="mt-10 px-6">
                {/* Top Bar */}
                <div className="flex flex-wrap items-center justify-end gap-4 mb-6">
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-5 py-3 rounded-xl border border-[var(--mt-border)] bg-[var(--mt-card)] focus:ring-2 focus:ring-[var(--mt-accent)] font-medium">
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="collected">Collected</option>
                        <option value="cancelled">Cancelled</option>
                    </select>

                    <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}
                            className="px-5 py-3 rounded-xl border border-[var(--mt-border)] bg-[var(--mt-card)] focus:ring-2 focus:ring-[var(--mt-accent)] font-medium">
                        <option value="all">All Dates</option>
                        <option value="today">Today</option>
                        <option value="yesterday">Yesterday</option>
                        <option value="this_week">This Week</option>
                    </select>

                    <div className="flex gap-4">
                        <button onClick={() => { setEditingRepair(null); setFormVisible(true); }}
                                className="px-6 py-3 bg-[var(--mt-accent)] hover:bg-[var(--mt-header-hover)] text-white rounded-xl font-semibold shadow-lg flex items-center gap-2 transition">
                            <Plus size={20}/> Add Repair
                        </button>
                        <button onClick={loadRepairs} disabled={loading}
                                className="px-6 py-3 bg-[var(--mt-card)] hover:bg-[var(--mt-surface-light)] border-2 border-[var(--mt-border-dark)] text-[var(--mt-text-dark)] rounded-xl font-semibold shadow-lg flex items-center gap-2 transition disabled:opacity-70">
                            <RefreshCw size={20} className={loading ? "animate-spin" : ""}/>
                            Refresh
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-hidden pb-4">
                    <DataTable
                        columns={columns}
                        data={repairsWithNumber}
                        loading={loading}
                        renderCell={(row, col) => col.render ? col.render(row) : row[col.key] || "-"}
                    />
                </div>
            </div>

            {/* Modal */}
            {formVisible && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6"
                     onClick={(e) => e.target === e.currentTarget && (setFormVisible(false), setEditingRepair(null))}>
                    <div className="w-full max-w-4xl max-h-screen overflow-y-auto">
                        <RepairForm
                            initialData={editingRepair}
                            onCancel={() => {
                                setFormVisible(false);
                                setEditingRepair(null);
                            }}
                            onSuccess={() => {
                                setFormVisible(false);
                                setEditingRepair(null);
                                loadRepairs();
                                showToast({ type: "success", message: editingRepair ? "Repair updated!" : "Repair added!" });
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}