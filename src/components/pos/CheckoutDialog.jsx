import React, { useState } from "react";
import { createPortal } from "react-dom";

const CheckoutDialog = ({
                            subtotal = 0,
                            discount = 0,
                            total = 0,
                            workers = [],
                            loadingWorkers = true,
                            onClose,
                            onConfirm,
                            saving = false, // passed from Cart
                        }) => {
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [remarks, setRemarks] = useState("");
    const [selectedWorker, setSelectedWorker] = useState("");

    const handleConfirm = () => {
        onConfirm({
            paymentMethod,
            remarks,
            workerId: selectedWorker,
        });
    };

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-theme-card rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 relative animate-fadeIn">
                <h2 className="text-2xl font-bold text-center text-theme-accent mb-6">
                    Checkout
                </h2>

                {/* Summary */}
                <div className="space-y-2 border-b border-theme-border pb-3 mb-4">
                    <div className="flex justify-between text-sm">
                        <span className="text-theme-text-light">Subtotal</span>
                        <span className="font-semibold text-theme-text">
              RM {Number(subtotal).toFixed(2)}
            </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-theme-text-light">Discount</span>
                        <span className="font-semibold text-theme-accent">
              - RM {Number(discount).toFixed(2)}
            </span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-theme-accent">
                        <span>Total</span>
                        <span>RM {Number(total).toFixed(2)}</span>
                    </div>
                </div>

                {/* Worker selection */}
                <div className="mb-4">
                    <label className="block text-sm text-theme-text-light mb-2">Worker</label>
                    {loadingWorkers ? (
                        <div className="text-theme-text-light">Loading workers...</div>
                    ) : (
                        <select
                            value={selectedWorker}
                            onChange={(e) => setSelectedWorker(e.target.value)}
                            className="w-full px-2 py-1 border rounded-md border-theme-border text-theme-text"
                        >
                            <option value="">Select worker</option>
                            {workers.map((w) => (
                                <option key={w.id} value={w.id}>
                                    {w.name}
                                </option>
                            ))}
                        </select>
                    )}
                </div>

                {/* Payment methods */}
                <div className="mb-4">
                    <label className="block text-sm text-theme-text-light mb-2">
                        Payment Method
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { id: "cash", label: "Cash", emoji: "💵" },
                            { id: "card", label: "Card", emoji: "💳" },
                            { id: "qr", label: "QR Pay", emoji: "📱" },
                        ].map((method) => (
                            <button
                                key={method.id}
                                onClick={() => setPaymentMethod(method.id)}
                                className={`flex flex-col items-center justify-center py-3 rounded-xl border transition-all duration-150 ${
                                    paymentMethod === method.id
                                        ? "border-theme-accent bg-theme-accent text-white shadow-md"
                                        : "border-theme-border text-theme-text hover:border-theme-accent hover:bg-theme-surface"
                                }`}
                            >
                                <span className="text-2xl">{method.emoji}</span>
                                <span className="text-sm font-medium">{method.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Remarks */}
                <div className="mb-4">
                    <label className="block text-sm text-theme-text-light mb-2">
                        Remarks (optional)
                    </label>
                    <textarea
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        className="w-full border border-theme-border rounded-md p-2 text-sm text-theme-text focus:ring-1 focus:ring-theme-accent"
                        placeholder="Any note about this transaction..."
                    />
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg bg-theme-surface-light text-theme-text hover:bg-theme-surface transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={saving}
                        className="
                            flex-1 py-2 rounded-lg text-white font-semibold
                            bg-[var(--mt-accent)]
                            hover:bg-[var(--mt-header-hover)]
                            transition
                        "
                    >
                        {saving ? "Processing..." : "Confirm Payment"}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default CheckoutDialog;
