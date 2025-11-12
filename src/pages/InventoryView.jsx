import React, { useState, useEffect } from "react";
import InventoryTable from "../components/inventory/InventoryTable";
import InventoryForm from "../components/inventory/InventoryForm";
import { fetchPhones, fetchAccessories, createPhone, updatePhone, deletePhone, createAccessory, updateAccessory, deleteAccessory } from "../util/posApi";
import Header from "../components/layout/Header";
import { useToast } from "../components/layout/FeedbackToast";

export default function InventoryView() {
    const [activeTab, setActiveTab] = useState("phones");
    const [phones, setPhones] = useState([]);
    const [accessories, setAccessories] = useState([]);
    const [formVisible, setFormVisible] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const { showToast } = useToast();

    // Fetch items
    const loadItems = async () => {
        const [phoneData, accessoryData] = await Promise.all([fetchPhones(), fetchAccessories()]);
        setPhones(phoneData);
        setAccessories(accessoryData);
    };

    useEffect(() => {
        loadItems();
    }, []);

    const cleanId = (id) => id.toString().replace(/^(phone|accessory)-/, "");

    const handleAddEdit = async (item) => {
        try {
            if (activeTab === "phones") {
                if (editingItem) {
                    await updatePhone(cleanId(editingItem.id), {
                        model: item.model,
                        variants: item.variants,
                    });
                    showToast({ type: "success", message: "Phone updated successfully" });
                } else {
                    await createPhone({
                        model: item.model,
                        variants: item.variants,
                    });
                    showToast({ type: "success", message: "Phone created successfully" });
                }
            } else {
                if (editingItem) {
                    await updateAccessory(cleanId(editingItem.id), {
                        name: item.name,
                        brand: item.brand,
                        sku: item.sku,
                        purchase_price: item.cost,
                        sell_price: item.price,
                        quantity: item.stock,
                    });
                    showToast({ type: "success", message: "Accessory updated successfully" });
                } else {
                    await createAccessory({
                        name: item.name,
                        brand: item.brand,
                        sku: item.sku,
                        purchase_price: item.cost,
                        sell_price: item.price,
                        quantity: item.stock,
                    });
                    showToast({ type: "success", message: "Accessory updated successfully" });
                }
            }

            await loadItems();
            setFormVisible(false);
            setEditingItem(null);
        } catch (err) {
            console.error("❌ Error in handleAddEdit:", err);
            showToast({ type: "error", message: `Operation failed: ${err.message}` });
        }
    };

    const handleDelete = async (item) => {
        const id = cleanId(item.id);
        try {
            if (activeTab === "phones") {
                await deletePhone(id);
                showToast({ type: "success", message: "Phone deleted successfully" });
            } else {
                await deleteAccessory(id);
                showToast({ type: "success", message: "Accessory deleted successfully" });
            }
            await loadItems();
        } catch (err) {
            console.error("❌ Delete failed:", err);
            showToast({ type: "error", message: `Delete failed: ${err.message}` });
        }
    };

    return (
        <div className="h-full w-full flex flex-col">
            <Header title="Inventory" />

            {/* Tabs */}
            <div className="flex gap-2 mt-4 px-4">
                <button
                    className={`px-4 py-2 rounded-t-lg font-semibold ${activeTab === "phones" ? "bg-orange-500 text-white" : "bg-orange-100 text-orange-800"}`}
                    onClick={() => setActiveTab("phones")}
                >
                    Phones
                </button>
                <button
                    className={`px-4 py-2 rounded-t-lg font-semibold ${activeTab === "accessories" ? "bg-orange-500 text-white" : "bg-orange-100 text-orange-800"}`}
                    onClick={() => setActiveTab("accessories")}
                >
                    Accessories
                </button>
                <button
                    className="ml-auto px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
                    onClick={() => setFormVisible(true)}
                >
                    Add New
                </button>
            </div>

            {/* Table */}
            <div className="px-4 py-2 flex-1 overflow-auto">
                {activeTab === "phones" && (
                    <InventoryTable
                        type="phones"
                        items={phones}
                        onEdit={(item) => { setEditingItem(item); setFormVisible(true); }}
                        onDelete={handleDelete}
                    />
                )}
                {activeTab === "accessories" && (
                    <InventoryTable
                        type="accessories"
                        items={accessories}
                        onEdit={(item) => { setEditingItem(item); setFormVisible(true); }}
                        onDelete={handleDelete}
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
