// src/components/pos/AddProductDialog.jsx
import React, { useState } from "react";

const AddProductDialog = ({ onClose }) => {
    const [form, setForm] = useState({ name: "", price: "" });

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`New product added:\n${form.name} - RM ${form.price}`);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-96 shadow-lg">
                <h2 className="text-lg font-semibold mb-4 text-orange-600">Add Product</h2>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                        type="text"
                        placeholder="Product Name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                    />
                    <input
                        type="number"
                        placeholder="Price"
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                        className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                    />
                    <div className="flex justify-end gap-2 mt-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                        >
                            Add
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProductDialog;
