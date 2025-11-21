// src/components/repair/RepairForm.jsx
import React, { useState, useMemo } from "react";
import { Wrench, Save, XCircle, User, Phone, Smartphone, Settings, FileText, DollarSign } from "lucide-react";
import { createRepair, updateRepair } from "../../util/posApi";

const toTitleCase = (str) => (!str ? "" : str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()));

const REPAIR_PREFIXES = [
    "Diagnosis", "Screen Repair", "Battery Replacement", "Charging Port",
    "Software Fix", "Camera Repair", "Motherboard Repair", "Water Damage", "Cleaning", "Others"
];

export default function RepairForm({ initialData = null, onCancel, onSuccess }) {
    const isEdit = !!initialData;

    const [customerName, setCustomerName] = useState(initialData?.customer_name || "");
    const [customerPhone, setCustomerPhone] = useState(initialData?.customer_phone || "");
    const [phoneModel, setPhoneModel] = useState(initialData?.device_model || "");
    const [repairPrefix, setRepairPrefix] = useState("Diagnosis");
    const [repairDetail, setRepairDetail] = useState("");
    const [remarks, setRemarks] = useState(initialData?.remarks || "");
    const [price, setPrice] = useState(initialData?.repair_cost?.toString() || "");

    useMemo(() => {
        if (initialData?.issue_description) {
            const found = REPAIR_PREFIXES.find(p => initialData.issue_description.startsWith(p + " - "));
            if (found) {
                setRepairPrefix(found);
                setRepairDetail(initialData.issue_description.slice(found.length + 3));
            } else {
                setRepairPrefix("Others");
                setRepairDetail(initialData.issue_description);
            }
        }
    }, [initialData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            customer_name: toTitleCase(customerName),
            customer_phone: customerPhone.trim(),
            device_model: toTitleCase(phoneModel),
            issue_description: repairDetail ? `${repairPrefix} - ${toTitleCase(repairDetail)}` : repairPrefix,
            remarks: remarks ? toTitleCase(remarks) : null,
            repair_cost: parseFloat(price) || 0,
        };

        try {
            if (isEdit) {
                await updateRepair(initialData.id, payload);
            } else {
                await createRepair(payload);
            }
            onSuccess();
        } catch (err) {
            alert("Save failed!");
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            {/* Clean Card */}
            <div className="bg-[var(--mt-card)] rounded-3xl shadow-xl border border-[var(--mt-border-dark)]">
                {/* Header */}
                <div className="bg-[var(--mt-accent)]/10 px-8 py-5 border-b border-[var(--mt-border-dark)] text-center">
                    <div className="flex items-center justify-center gap-3">
                        <Wrench size={32} className="text-[var(--mt-accent)]" />
                        <h2 className="text-2xl font-bold text-[var(--mt-text-dark)]">
                            {isEdit ? "Edit Repair Job" : "New Repair Job"}
                        </h2>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 sm:p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Column */}
                        <div className="space-y-6">
                            <div>
                                <label className="flex items-center gap-2 text-base font-semibold text-[var(--mt-text-dark)] mb-2">
                                    <User size={18} className="text-[var(--mt-accent)]" />
                                    Customer Name
                                </label>
                                <input required value={customerName} onChange={e => setCustomerName(toTitleCase(e.target.value))}
                                       className="w-full px-4 py-3 rounded-xl border border-[var(--mt-border-dark)] bg-white focus:border-[var(--mt-accent)] focus:ring-4 focus:ring-[var(--mt-accent)]/20 transition text-base"
                                       placeholder="Ahmad Bin Ali" />
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-base font-semibold text-[var(--mt-text-dark)] mb-2">
                                    <Phone size={18} className="text-[var(--mt-accent)]" />
                                    Phone Number
                                </label>
                                <input required value={customerPhone} onChange={e => setCustomerPhone(e.target.value)}
                                       className="w-full px-4 py-3 rounded-xl border border-[var(--mt-border-dark)] bg-white focus:border-[var(--mt-accent)] focus:ring-4 focus:ring-[var(--mt-accent)]/20 transition text-base"
                                       placeholder="012-3456789" />
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-base font-semibold text-[var(--mt-text-dark)] mb-2">
                                    <Smartphone size={18} className="text-[var(--mt-accent)]" />
                                    Device Model
                                </label>
                                <input required value={phoneModel} onChange={e => setPhoneModel(toTitleCase(e.target.value))}
                                       className="w-full px-4 py-3 rounded-xl border border-[var(--mt-border-dark)] bg-white focus:border-[var(--mt-accent)] focus:ring-4 focus:ring-[var(--mt-accent)]/20 transition text-base"
                                       placeholder="iPhone 15 Pro Max" />
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-base font-semibold text-[var(--mt-text-dark)] mb-2">
                                    <Settings size={18} className="text-[var(--mt-accent)]" />
                                    Repair Category
                                </label>
                                <select value={repairPrefix} onChange={e => setRepairPrefix(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-[var(--mt-border-dark)] bg-white focus:border-[var(--mt-accent)] focus:ring-4 focus:ring-[var(--mt-accent)]/20 transition text-base">
                                    {REPAIR_PREFIXES.map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            <div>
                                <label className="flex items-center gap-2 text-base font-semibold text-[var(--mt-text-dark)] mb-2">
                                    <Settings size={18} className="text-[var(--mt-accent)]" />
                                    Issue Detail
                                </label>
                                <input required value={repairDetail} onChange={e => setRepairDetail(toTitleCase(e.target.value))}
                                       className="w-full px-4 py-3 rounded-xl border border-[var(--mt-border-dark)] bg-white focus:border-[var(--mt-accent)] focus:ring-4 focus:ring-[var(--mt-accent)]/20 transition text-base"
                                       placeholder="Cracked screen, no power..." />
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-base font-semibold text-[var(--mt-text-dark)] mb-2">
                                    <FileText size={18} className="text-[var(--mt-accent)]" />
                                    Remarks (Optional)
                                </label>
                                <textarea value={remarks} onChange={e => setRemarks(toTitleCase(e.target.value))} rows={3}
                                          className="w-full px-4 py-3 rounded-xl border border-[var(--mt-border-dark)] bg-white focus:border-[var(--mt-accent)] focus:ring-4 focus:ring-[var(--mt-accent)]/20 transition resize-none text-base"
                                          placeholder="Password: 0000, with box..." />
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-lg font-bold text-[var(--mt-text-dark)] mb-3">
                                    <DollarSign size={24} className="text-[var(--mt-accent)]" />
                                    Estimated Price (RM)
                                </label>
                                <input required type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)}
                                       className="w-full px-5 py-4 text-3xl font-bold rounded-xl border-2 border-[var(--mt-border-dark)] bg-white focus:border-[var(--mt-accent)] focus:ring-4 focus:ring-[var(--mt-accent)]/20 transition text-center"
                                       placeholder="250.00" />
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();   // ← THIS LINE IS THE KEY
                                        onCancel();
                                    }}
                                    className="px-8 py-4 rounded-xl border-2 border-[var(--mt-border-dark)] hover:bg-[var(--mt-surface-light)] flex items-center gap-3 font-bold text-lg transition"
                                >
                                    <XCircle size={24} /> Cancel
                                </button>
                                <button type="submit"
                                        className="px-10 py-3 bg-[var(--mt-accent)] hover:bg-[var(--mt-header-hover)] text-white rounded-xl flex items-center gap-2 font-bold shadow-lg transition">
                                    <Save size={22} /> {isEdit ? "Update Repair" : "Save Repair"}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}