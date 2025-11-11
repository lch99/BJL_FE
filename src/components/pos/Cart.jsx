import React, { useState, useMemo, useEffect } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import CheckoutDialog from "./CheckoutDialog";
import { fetchWorkers, createSale } from "../../util/posApi";

const Cart = ({
                  cart = [],
                  updateQuantity = () => {},
                  removeFromCart = () => {},
                  clearCart = () => {},
                  subtotal: subtotalFn = null,
                  currentUserId = null,
                  showDialog = () => {},
                  reloadProducts = () => {},
              }) => {
    const [discountType, setDiscountType] = useState("fixed");
    const [discountValue, setDiscountValue] = useState(0);
    const [applySST, setApplySST] = useState(false);
    const [showCheckout, setShowCheckout] = useState(false);
    const [workers, setWorkers] = useState([]);
    const [loadingWorkers, setLoadingWorkers] = useState(true);
    const [savingSale, setSavingSale] = useState(false);

    useEffect(() => {
        const loadWorkers = async () => {
            try {
                const data = await fetchWorkers();
                setWorkers(data);
            } catch (err) {
                console.error(err);
                showDialog({ type: "error", message: "Failed to load workers", autoClose: true });
            } finally {
                setLoadingWorkers(false);
            }
        };
        loadWorkers();
    }, [showDialog]);

    const cartLength = Array.isArray(cart) ? cart.length : 0;

    const subtotal = useMemo(() => {
        if (typeof subtotalFn === "function") return Number(subtotalFn()) || 0;
        return cart.reduce((s, i) => s + (Number(i.price) || 0) * (Number(i.quantity) || 0), 0);
    }, [cart, subtotalFn]);

    const discountAmt = useMemo(() => {
        if (!discountValue) return 0;
        if (discountType === "percentage") return subtotal * (discountValue / 100);
        return Number(discountValue) || 0;
    }, [subtotal, discountType, discountValue]);

    const beforeSST = Math.max(0, subtotal - discountAmt);
    const sst = applySST ? beforeSST * 0.06 : 0;
    const total = beforeSST + sst;

    const handleConfirmPayment = async ({ paymentMethod, remarks, workerId }) => {
        if (!workerId) {
            showDialog({ type: "error", message: "Please select a worker", autoClose: true, zIndex: 9999 });
            return;
        }

        const items = cart.map((item) => {
            const rawId = String(item.itemId);
            const numericId = Number(rawId.includes("-") ? rawId.split("-")[1] : rawId);

            return {
                type: item.category.toLowerCase() === "phones" ? "phone" : "accessory",
                id: numericId,
                quantity: Number(item.quantity) || 1,
                price: Number(item.price) || 0,
            };
        });


        try {
            setSavingSale(true);
            await createSale({
                total_amount: total,
                paid_amount: total,
                payment_method: paymentMethod,
                worker_id: Number(workerId),
                created_by: currentUserId,
                items,
            });

            showDialog({ type: "success", message: "Sale created successfully!", autoClose: true });
            clearCart();
            setShowCheckout(false);
            await reloadProducts();
        } catch (err) {
            console.error(err);
            showDialog({ type: "error", message: "Failed to create sale: " + err.message, autoClose: true });
        } finally {
            setSavingSale(false);
        }
    };

    return (
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-md border border-amber-200 flex flex-col h-full">
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-bold text-amber-700">Current Cart</h3>
                <div className="text-sm text-gray-500">
                    {cartLength} item{cartLength !== 1 ? "s" : ""}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto mb-3">
                {cartLength === 0 ? (
                    <div className="py-12 text-center text-gray-400">No items in cart</div>
                ) : (
                    cart.map((it) => (
                        <div
                            key={it.itemId}
                            className="flex items-center justify-between p-2 rounded-lg border border-amber-100 mb-2"
                        >
                            <div>
                                <div className="font-medium text-gray-800">{it.name}</div>
                                <div className="text-xs text-gray-500">RM {Number(it.price).toFixed(2)}</div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => updateQuantity(it.itemId, (it.quantity || 1) - 1)} className="p-1">
                                    <Minus className="w-4 h-4 text-amber-600" />
                                </button>
                                <div className="w-10 text-center">{it.quantity}</div>
                                <button onClick={() => updateQuantity(it.itemId, (it.quantity || 1) + 1)} className="p-1">
                                    <Plus className="w-4 h-4 text-amber-600" />
                                </button>
                                <button onClick={() => removeFromCart(it.itemId)} className="p-1 ml-2">
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Summary */}
            <div className="border-t border-amber-100 pt-3 space-y-3">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold text-gray-800">RM {Number(subtotal).toFixed(2)}</span>
                </div>

                <div>
                    <div className="text-xs text-gray-500 mb-1">💸 Discount</div>
                    <div className="flex items-center gap-2">
                        <select value={discountType} onChange={(e) => setDiscountType(e.target.value)} className="px-2 py-1 border rounded-md text-sm">
                            <option value="fixed">RM</option>
                            <option value="percentage">%</option>
                        </select>
                        <input
                            type="text"
                            value={discountValue === 0 ? "" : discountValue}
                            onChange={(e) => setDiscountValue(isNaN(Number(e.target.value)) ? 0 : Number(e.target.value))}
                            className="flex-1 px-2 py-1 border rounded-md"
                            placeholder="Discount"
                            inputMode="decimal"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <input type="checkbox" checked={applySST} onChange={(e) => setApplySST(e.target.checked)} className="accent-amber-500" />
                        <span className="text-sm text-gray-600">Apply SST (6%)</span>
                    </div>
                    <div className="text-sm text-gray-600">RM {sst.toFixed(2)}</div>
                </div>

                <div className="flex justify-between items-center text-lg font-bold text-amber-700">
                    <span>Total</span>
                    <span>RM {total.toFixed(2)}</span>
                </div>

                <div className="flex gap-2">
                    <button onClick={() => clearCart()} className="flex-1 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition">
                        Clear
                    </button>
                    <button
                        onClick={() => setShowCheckout(true)}
                        className="flex-1 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold hover:opacity-90 transition"
                        disabled={savingSale}
                    >
                        {savingSale ? "Processing..." : "Checkout"}
                    </button>
                </div>

                {showCheckout && (
                    <CheckoutDialog
                        subtotal={subtotal}
                        discount={discountAmt}
                        total={total}
                        workers={workers}
                        loadingWorkers={loadingWorkers}
                        onClose={() => setShowCheckout(false)}
                        onConfirm={handleConfirmPayment}
                        saving={savingSale}
                    />
                )}
            </div>
        </div>
    );
};

export default Cart;
