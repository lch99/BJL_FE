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
            // Ensure model and at least one variant with a SKU
            const validVariants = variants.filter(v => v.sku && v.sku.trim() !== "");

            if (!model.trim() || validVariants.length === 0) {
                alert("Please enter a model and at least one variant (with SKU).");
                return;
            }

            const payload = {
                model: model.trim(),
                variants: validVariants
            };

            console.log("Submitting payload:", payload); // 👈 debug
            onSubmit(payload);
        } else {
            onSubmit({ ...accessory, category });
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-xl shadow-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-orange-400"
            >
                <h2 className="text-2xl font-bold mb-4 text-orange-600">
                    {initialData ? "Edit Item" : "Add Item"}
                </h2>

                {/* Category Selector */}
                <div className="mb-4 flex gap-4">
                    <label className="font-semibold">Category:</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="border p-2 rounded"
                    >
                        <option value="Phones">Phones</option>
                        <option value="Accessories">Accessories</option>
                    </select>
                </div>

                {/* Phones Section */}
                {category === "Phones" && (
                    <>
                        <div className="mb-4">
                            <label className="block font-medium mb-1">Phone Model</label>
                            <input
                                type="text"
                                value={model}
                                onChange={(e) => setModel(toTitleCase(e.target.value))}
                                placeholder="e.g. Samsung S25"
                                className="border p-2 w-full rounded"
                                required
                            />
                        </div>

                        <div className="overflow-x-auto mb-4">
                            <table className="min-w-full border">
                                <thead className="bg-orange-100 text-orange-800">
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
                                    <tr key={i} className="hover:bg-orange-50">
                                        <td className="p-1 border"><input value={v.sku} onChange={(e) => handleVariantChange(i, "sku", e.target.value)} className="border p-1 w-full rounded" /></td>
                                        <td className="p-1 border"><input value={v.color} onChange={(e) => handleVariantChange(i, "color", e.target.value)} className="border p-1 w-full rounded" /></td>
                                        <td className="p-1 border"><input type="number" value={v.ram} onChange={(e) => handleVariantChange(i, "ram", e.target.value)} className="border p-1 w-full rounded" /></td>
                                        <td className="p-1 border"><input type="number" value={v.storage} onChange={(e) => handleVariantChange(i, "storage", e.target.value)} className="border p-1 w-full rounded" /></td>
                                        <td className="p-1 border">
                                            <select value={v.condition} onChange={(e) => handleVariantChange(i, "condition", e.target.value)} className="border p-1 w-full rounded">
                                                <option value="new">New</option>
                                                <option value="used">Used</option>
                                                <option value="refurbished">Refurbished</option>
                                            </select>
                                        </td>
                                        <td className="p-1 border"><input type="number" value={v.warranty_months} onChange={(e) => handleVariantChange(i, "warranty_months", e.target.value)} className="border p-1 w-full rounded" /></td>
                                        <td className="p-1 border"><input type="number" value={v.stock} onChange={(e) => handleVariantChange(i, "stock", e.target.value)} className="border p-1 w-full rounded" /></td>
                                        <td className="p-1 border"><input type="number" value={v.price} onChange={(e) => handleVariantChange(i, "price", e.target.value)} className="border p-1 w-full rounded" /></td>
                                        <td className="p-1 border"><input type="number" value={v.cost} onChange={(e) => handleVariantChange(i, "cost", e.target.value)} className="border p-1 w-full rounded" /></td>
                                        <td className="p-1 border"><input value={v.imei} onChange={(e) => handleVariantChange(i, "imei", e.target.value)} className="border p-1 w-full rounded" /></td>
                                        <td className="p-1 border text-center">
                                            <button type="button" onClick={() => removeVariantRow(i)} className="text-red-500 hover:underline">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                            <button type="button" onClick={addVariantRow} className="mt-2 px-4 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 transition">
                                Add Variant
                            </button>
                        </div>
                    </>
                )}

                {/* Accessories Section */}
                {category === "Accessories" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1 font-medium">Name</label>
                            <input value={accessory.name} onChange={(e) => handleAccessoryChange("name", e.target.value)} className="border p-2 w-full rounded" />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">Brand</label>
                            <input value={accessory.brand} onChange={(e) => handleAccessoryChange("brand", e.target.value)} className="border p-2 w-full rounded" />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">SKU</label>
                            <input value={accessory.sku} onChange={(e) => handleAccessoryChange("sku", e.target.value)} className="border p-2 w-full rounded" />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">Stock</label>
                            <input type="number" value={accessory.stock} onChange={(e) => handleAccessoryChange("stock", parseFloat(e.target.value)||0)} className="border p-2 w-full rounded" />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">Price</label>
                            <input type="number" value={accessory.price} onChange={(e) => handleAccessoryChange("price", parseFloat(e.target.value)||0)} className="border p-2 w-full rounded" />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">Cost</label>
                            <input type="number" value={accessory.cost} onChange={(e) => handleAccessoryChange("cost", parseFloat(e.target.value)||0)} className="border p-2 w-full rounded" />
                        </div>
                    </div>
                )}

                {/* Buttons */}
                <div className="flex justify-end gap-2 mt-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 border rounded hover:bg-gray-100">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition">
                        {initialData ? "Update" : "Add"}
                    </button>
                </div>
            </form>
        </div>
    );
}
