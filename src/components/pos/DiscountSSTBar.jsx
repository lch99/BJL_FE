// src/components/pos/DiscountSSTBar.jsx
import React, { useState } from "react";

const DiscountSSTBar = ({ calculateSubtotal, calculateTotal }) => {
    const [discount, setDiscount] = useState(0);
    const [discountType, setDiscountType] = useState("fixed");
    const [sstEnabled, setSstEnabled] = useState(false);

    const subtotal = calculateSubtotal();
    const total = calculateTotal(discount, discountType, sstEnabled);

    return (
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-md border border-amber-200 p-4 mb-4">
            <div className="flex items-center justify-between gap-3">
                {/* Discount */}
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        value={discount}
                        onChange={(e) => setDiscount(Number(e.target.value))}
                        className="w-24 px-2 py-1 border border-amber-200 rounded-md focus:ring-1 focus:ring-orange-400 text-sm"
                        placeholder="Discount"
                    />
                    <select
                        value={discountType}
                        onChange={(e) => setDiscountType(e.target.value)}
                        className="px-2 py-1 border border-amber-200 rounded-md text-sm bg-white focus:ring-1 focus:ring-orange-400"
                    >
                        <option value="fixed">RM</option>
                        <option value="percentage">%</option>
                    </select>
                </div>

                {/* SST Toggle */}
                <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600">SST (6%)</label>
                    <input
                        type="checkbox"
                        checked={sstEnabled}
                        onChange={(e) => setSstEnabled(e.target.checked)}
                        className="accent-orange-500 w-4 h-4"
                    />
                </div>
            </div>

            {/* Totals */}
            <div className="flex justify-between mt-3 text-sm">
                <span className="text-gray-500">Subtotal:</span>
                <span className="font-semibold text-gray-800">RM{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-amber-700">
                <span>Total:</span>
                <span>RM{total.toFixed(2)}</span>
            </div>
        </div>
    );
};

export default DiscountSSTBar;
