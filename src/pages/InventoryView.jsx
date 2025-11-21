import React, { useState, useEffect } from "react";
import DataTable from "../components/common/DataTable/DataTable";
import InventoryForm from "../components/inventory/InventoryForm";
import Header from "../components/common/Header";
import { Pencil, Trash } from "lucide-react";
import { useToast } from "../components/common/FeedbackToast";
import {
    fetchPhones,
    fetchAccessories,
    createPhone,
    updatePhone,
    deletePhone,
    createAccessory,
    updateAccessory,
    deleteAccessory
} from "../util/posApi";

export default function InventoryView() {
    const [activeTab, setActiveTab] = useState("phones");
    const [phones, setPhones] = useState([]);
    const [accessories, setAccessories] = useState([]);
    const [formVisible, setFormVisible] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [search, setSearch] = useState("");
    const [sortKey, setSortKey] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");
    const { showToast } = useToast();

    const loadItems = async () => {
        try {
            const [phoneData, accessoryData] = await Promise.all([fetchPhones(), fetchAccessories()]);
            setPhones(phoneData);
            setAccessories(accessoryData);
        } catch (err) {
            console.error(err);
            showToast({ type: "error", message: "Failed to load inventory" });
        }
    };

    useEffect(() => {
        loadItems();
    }, []);

    const handleAddEdit = async (item) => {
        try {
            if (activeTab === "phones") {
                if (editingItem) {
                    await updatePhone(editingItem.id, { ...item });
                    showToast({ type: "success", message: "Phone updated successfully" });
                } else {
                    await createPhone({ ...item });
                    showToast({ type: "success", message: "Phone created successfully" });
                }
            } else {
                if (editingItem) {
                    await updateAccessory(editingItem.id, { ...item });
                    showToast({ type: "success", message: "Accessory updated successfully" });
                } else {
                    await createAccessory({ ...item });
                    showToast({ type: "success", message: "Accessory created successfully" });
                }
            }
            setFormVisible(false);
            setEditingItem(null);
            await loadItems();
        } catch (err) {
            console.error(err);
            showToast({ type: "error", message: `Operation failed: ${err.message}` });
        }
    };

    const handleDelete = async (item) => {
        try {
            if (activeTab === "phones") {
                await deletePhone(item.id);
                showToast({ type: "success", message: "Phone deleted successfully" });
            } else {
                await deleteAccessory(item.id);
                showToast({ type: "success", message: "Accessory deleted successfully" });
            }
            await loadItems();
        } catch (err) {
            console.error(err);
            showToast({ type: "error", message: `Delete failed: ${err.message}` });
        }
    };

    const handleSort = (key) => {
        if (sortKey === key) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        else { setSortKey(key); setSortOrder("asc"); }
    };

    const getSortedData = (data, columns) => {
        let filtered = data.filter(item =>
            columns.some(col => {
                if (col.key === "#") return false;
                const val = col.key.includes(".") ? col.key.split(".").reduce((o, k) => o?.[k], item) : item[col.key];
                return val?.toString().toLowerCase().includes(search.toLowerCase());
            })
        );

        if (!sortKey) return filtered;

        return [...filtered].sort((a, b) => {
            const valA = sortKey.includes(".") ? sortKey.split(".").reduce((o, k) => o?.[k], a) : a[sortKey];
            const valB = sortKey.includes(".") ? sortKey.split(".").reduce((o, k) => o?.[k], b) : b[sortKey];

            if (typeof valA === "number" && typeof valB === "number") return sortOrder === "asc" ? valA - valB : valB - valA;
            return sortOrder === "asc" ? valA?.toString().localeCompare(valB?.toString()) : valB?.toString().localeCompare(valA?.toString());
        });
    };

    const phoneColumns = [
        { key: "#", label: "#", sortable: false },
        { key: "model_info.brand", label: "Brand", sortable: true },
        { key: "model_info.model_name", label: "Model", sortable: true },
        { key: "color", label: "Color", sortable: false },
        { key: "ram", label: "RAM", sortable: true },
        { key: "storage", label: "Storage", sortable: true },
        { key: "quantity", label: "Stock", sortable: true },
        { key: "purchase_price", label: "Purchase Price", sortable: true },
        { key: "sell_price", label: "Selling Price", sortable: true },
        { key: "status", label: "Status", sortable: true }
    ];

    const accessoryColumns = [
        { key: "#", label: "#", sortable: false },
        { key: "name", label: "Name", sortable: true },
        { key: "brand", label: "Brand", sortable: true },
        { key: "sku", label: "SKU", sortable: false },
        { key: "quantity", label: "Stock", sortable: true },
        { key: "purchase_price", label: "Purchase Price", sortable: true },
        { key: "sell_price", label: "Selling Price", sortable: true },
        { key: "status", label: "Status", sortable: true }
    ];

    const addRowNumber = (data) => data.map((item, index) => ({ ...item, "#": index + 1 }));

    const renderCell = (row, col) => {
        if (col.key === "status") {
            const color =
                row.status === "active" ? "bg-green-500" :
                    row.status === "inactive" ? "bg-gray-400" :
                        "bg-yellow-400";
            return (
                <span className={`px-2 py-1 rounded-full text-white font-semibold text-sm ${color}`}>
                    {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                </span>
            );
        }
        if (col.key.includes(".")) return col.key.split(".").reduce((o, k) => o?.[k], row);
        return row[col.key];
    };

    return (
        <div className="flex flex-col h-full w-full mt-header px-6 py-9 bg-theme-bg">
            <Header title="Inventory" />

            {/* Tabs */}
            <div className="flex gap-2 mt-6 px-4 mb-6">
                {["phones", "accessories"].map(tab => (
                    <button
                        key={tab}
                        className={`px-4 py-2 rounded-t-lg font-semibold text-white transition ${
                            activeTab === tab
                                ? "bg-gradient-to-r from-[var(--mt-accent)] to-[var(--mt-header-hover)] shadow-md"
                                : "bg-[var(--mt-surface-light)] text-[var(--mt-text)] hover:bg-[var(--mt-surface)]"
                        }`}
                        onClick={() => { setActiveTab(tab); setSearch(""); setSortKey(""); setSortOrder("asc"); }}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}

                <button
                    className="ml-auto px-4 py-2 rounded shadow-md text-white font-semibold
                    bg-gradient-to-r from-[var(--mt-accent)] to-[var(--mt-header-hover)]
                    hover:opacity-90 transition"
                    onClick={() => setFormVisible(true)}
                >
                    Add New
                </button>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto bg-theme-card rounded-xl p-4 shadow-inner">
                {activeTab === "phones" && (
                    <DataTable
                        columns={phoneColumns}
                        data={addRowNumber(getSortedData(phones, phoneColumns))}
                        search={search}
                        onSearch={setSearch}
                        sortKey={sortKey}
                        sortOrder={sortOrder}
                        onSort={handleSort}
                        actions={(row) => (
                            <div className="flex justify-center gap-2">
                                <button className="text-[var(--mt-accent)]" onClick={() => { setEditingItem(row); setFormVisible(true); }}>
                                    <Pencil size={18} />
                                </button>
                                <button className="text-[var(--mt-red)]" onClick={() => handleDelete(row)}>
                                    <Trash size={18} />
                                </button>
                            </div>
                        )}
                        renderCell={renderCell}
                    />
                )}
                {activeTab === "accessories" && (
                    <DataTable
                        columns={accessoryColumns}
                        data={addRowNumber(getSortedData(accessories, accessoryColumns))}
                        search={search}
                        onSearch={setSearch}
                        sortKey={sortKey}
                        sortOrder={sortOrder}
                        onSort={handleSort}
                        actions={(row) => (
                            <div className="flex justify-center gap-2">
                                <button className="text-[var(--mt-accent)]" onClick={() => { setEditingItem(row); setFormVisible(true); }}>
                                    <Pencil size={18} />
                                </button>
                                <button className="text-[var(--mt-red)]" onClick={() => handleDelete(row)}>
                                    <Trash size={18} />
                                </button>
                            </div>
                        )}
                        renderCell={renderCell}
                    />
                )}
            </div>

            {/* Add/Edit Form */}
            {formVisible && (
                <InventoryForm
                    visible={formVisible}
                    initialData={editingItem}
                    onClose={() => { setFormVisible(false); setEditingItem(null); }}
                    onSubmit={handleAddEdit}
                />
            )}
        </div>
    );
}
