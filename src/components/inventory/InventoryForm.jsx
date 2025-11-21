import React, { useState, useEffect } from "react";

// Helper function: Title Case
const toTitleCase = (str) => {
    return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
};

export default function InventoryForm({ visible, onClose, onSubmit, initialData }) {
    const [category, setCategory] = useState("Phones");
    const [model, setModel] = useState("");
    const [variants, setVariants] = useState([]);
    const [accessory, setAccessory] = useState({
        name: "",
        brand: "",
        sku: "",
        stock: 0,
        price: 0,
        cost: 0,
    });

    useEffect(() => {
        if (initialData) {
            if (initialData.model_info) {
                setCategory("Phones");
                setModel(toTitleCase(initialData.model_info.model_name));
                setVariants([{
                    sku: toTitleCase(initialData.sku),
                    color: toTitleCase(initialData.color || ""),
                    ram: initialData.ram || 0,
                    storage: initialData.storage || 0,
                    condition: initialData.condition || "new",
                    warranty_months: initialData.warranty_months || 12,
                    stock: initialData.quantity || 0,
                    price: initialData.sell_price || 0,
                    cost: initialData.purchase_price || 0,
                    imei: initialData.imei || "",
                }]);
            } else {
                setCategory("Accessories");
                setAccessory({
                    name: toTitleCase(initialData.name || ""),
                    brand: toTitleCase(initialData.brand || ""),
                    sku: toTitleCase(initialData.sku || ""),
                    stock: initialData.quantity || 0,
                    price: initialData.sell_price || 0,
                    cost: initialData.purchase_price || 0,
                });
            }
        } else {
            if (category === "Phones") {
                setVariants([{
                    sku: "",
                    color: "",
                    ram: 0,
                    storage: 0,
                    condition: "new",
                    warranty_months: 12,
                    stock: 0,
                    price: 0,
                    cost: 0,
                    imei: "",
                }]);
            }
        }
    }, [initialData, category]);

    if (!visible) return null;

    const handleVariantChange = (index, field, value) => {
        setVariants(prev => {
            const newVariants = [...prev];
            if (["ram", "storage", "warranty_months", "stock", "price", "cost"].includes(field)) {
                newVariants[index][field] = parseFloat(value) || 0;
            } else {
                newVariants[index][field] = toTitleCase(value);
            }
            return newVariants;
        });
    };

    const handleAccessoryChange = (field, value) => {
        setAccessory(prev => ({
            ...prev,
            [field]: ["name", "brand", "sku"].includes(field) ? toTitleCase(value) : value
        }));
    };

    const addVariantRow = () => {
        setVariants(prev => [...prev, {
            sku: "",
            color: "",
            ram: 0,
            storage: 0,
            condition: "new",
            warranty_months: 12,
            stock: 0,
            price: 0,
            cost: 0,
            imei: "",
        }]);
    };

    const removeVariantRow = (index) => {
        setVariants(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (category === "Phones") {
            const validVariants = variants.filter(v => v.sku && v.sku.trim() !== "");
            if (!model.trim() || validVariants.length === 0) {
                alert("Please enter a model and at least one variant (with SKU).");
                return;
            }
            onSubmit({ model: model.trim(), variants: validVariants });
        } else {
            onSubmit({ ...accessory, category });
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <form
                onSubmit={handleSubmit}
                className="bg-[var(--mt-surface)] rounded-xl shadow-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-[var(--mt-accent)]"
            >
                <h2 className="text-2xl font-bold mb-4 text-[var(--mt-accent)]">
                    {initialData ? "Edit Item" : "Add Item"}
                </h2>

                {/* Category Selector */}
                <div className="mb-4 flex gap-4">
                    <label className="font-semibold text-[var(--mt-text)]">Category:</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="border p-2 rounded bg-[var(--mt-surface-light)] text-[var(--mt-text)]"
                    >
                        <option value="Phones">Phones</option>
                        <option value="Accessories">Accessories</option>
                    </select>
                </div>

                {/* Phones Section */}
                {category === "Phones" && (
                    <>
                        <div className="mb-4">
                            <label className="block font-medium mb-1 text-[var(--mt-text)]">Phone Model</label>
                            <input
                                type="text"
                                value={model}
                                onChange={(e) => setModel(toTitleCase(e.target.value))}
                                placeholder="e.g. Samsung S25"
                                className="border p-2 w-full rounded bg-[var(--mt-surface-light)] text-[var(--mt-text)]"
                                required
                            />
                        </div>

                        <div className="overflow-x-auto mb-4">
                            <table className="min-w-full border border-[var(--mt-surface-light)]">
                                <thead className="bg-[var(--mt-accent-light)] text-[var(--mt-accent)]">
                                <tr>
                                    <th className="p-2 border">SKU</th>
                                    <th className="p-2 border">Color</th>
                                    <th className="p-2 border">RAM</th>
                                    <th className="p-2 border">Storage</th>
                                    <th className="p-2 border">Condition</th>
                                    <th className="p-2 border">Warranty</th>
                                    <th className="p-2 border">Stock</th>
                                    <th className="p-2 border">Price</th>
                                    <th className="p-2 border">Cost</th>
                                    <th className="p-2 border">IMEI</th>
                                    <th className="p-2 border">Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {variants.map((v, i) => (
                                    <tr key={i} className="hover:bg-[var(--mt-surface-light)]">
                                        <td className="p-1 border"><input value={v.sku} onChange={(e) => handleVariantChange(i, "sku", e.target.value)} className="border p-1 w-full rounded bg-[var(--mt-surface-light)] text-[var(--mt-text)]" /></td>
                                        <td className="p-1 border"><input value={v.color} onChange={(e) => handleVariantChange(i, "color", e.target.value)} className="border p-1 w-full rounded bg-[var(--mt-surface-light)] text-[var(--mt-text)]" /></td>
                                        <td className="p-1 border"><input type="number" value={v.ram} onChange={(e) => handleVariantChange(i, "ram", e.target.value)} className="border p-1 w-full rounded bg-[var(--mt-surface-light)] text-[var(--mt-text)]" /></td>
                                        <td className="p-1 border"><input type="number" value={v.storage} onChange={(e) => handleVariantChange(i, "storage", e.target.value)} className="border p-1 w-full rounded bg-[var(--mt-surface-light)] text-[var(--mt-text)]" /></td>
                                        <td className="p-1 border">
                                            <select value={v.condition} onChange={(e) => handleVariantChange(i, "condition", e.target.value)} className="border p-1 w-full rounded bg-[var(--mt-surface-light)] text-[var(--mt-text)]">
                                                <option value="new">New</option>
                                                <option value="used">Used</option>
                                                <option value="refurbished">Refurbished</option>
                                            </select>
                                        </td>
                                        <td className="p-1 border"><input type="number" value={v.warranty_months} onChange={(e) => handleVariantChange(i, "warranty_months", e.target.value)} className="border p-1 w-full rounded bg-[var(--mt-surface-light)] text-[var(--mt-text)]" /></td>
                                        <td className="p-1 border"><input type="number" value={v.stock} onChange={(e) => handleVariantChange(i, "stock", e.target.value)} className="border p-1 w-full rounded bg-[var(--mt-surface-light)] text-[var(--mt-text)]" /></td>
                                        <td className="p-1 border"><input type="number" value={v.price} onChange={(e) => handleVariantChange(i, "price", e.target.value)} className="border p-1 w-full rounded bg-[var(--mt-surface-light)] text-[var(--mt-text)]" /></td>
                                        <td className="p-1 border"><input type="number" value={v.cost} onChange={(e) => handleVariantChange(i, "cost", e.target.value)} className="border p-1 w-full rounded bg-[var(--mt-surface-light)] text-[var(--mt-text)]" /></td>
                                        <td className="p-1 border"><input value={v.imei} onChange={(e) => handleVariantChange(i, "imei", e.target.value)} className="border p-1 w-full rounded bg-[var(--mt-surface-light)] text-[var(--mt-text)]" /></td>
                                        <td className="p-1 border text-center">
                                            <button type="button" onClick={() => removeVariantRow(i)} className="text-[var(--mt-red)] hover:underline">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                            <button type="button" onClick={addVariantRow} className="mt-2 px-4 py-1 bg-[var(--mt-accent)] text-white rounded hover:opacity-90 transition">
                                Add Variant
                            </button>
                        </div>
                    </>
                )}

                {/* Accessories Section */}
                {category === "Accessories" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {["name","brand","sku","stock","price","cost"].map(field => (
                            <div key={field}>
                                <label className="block mb-1 font-medium text-[var(--mt-text)]">{toTitleCase(field)}</label>
                                <input
                                    value={accessory[field]}
                                    onChange={(e) => handleAccessoryChange(field, field==="stock"||field==="price"||field==="cost" ? parseFloat(e.target.value)||0 : e.target.value)}
                                    className="border p-2 w-full rounded bg-[var(--mt-surface-light)] text-[var(--mt-text)]"
                                />
                            </div>
                        ))}
                    </div>
                )}

                {/* Buttons */}
                <div className="flex justify-end gap-2 mt-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 border rounded hover:bg-[var(--mt-surface-light)] text-[var(--mt-text)]">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-[var(--mt-accent)] text-white rounded hover:opacity-90 transition">
                        {initialData ? "Update" : "Add"}
                    </button>
                </div>
            </form>
        </div>
    );
}
