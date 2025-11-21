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
                showDialog({
                    type: "error",
                    message: "Failed to load workers",
                    autoClose: true,
                });
            } finally {
                setLoadingWorkers(false);
            }
        };
        loadWorkers();
    }, [showDialog]);

    const cartLength = Array.isArray(cart) ? cart.length : 0;

    const subtotal = useMemo(() => {
        if (typeof subtotalFn === "function") return Number(subtotalFn()) || 0;
        return cart.reduce(
            (s, i) => s + (Number(i.price) || 0) * (Number(i.quantity) || 0),
            0
        );
    }, [cart, subtotalFn]);

    const discountAmt = useMemo(() => {
        if (!discountValue) return 0;
        if (discountType === "percentage")
            return subtotal * (discountValue / 100);
        return Number(discountValue) || 0;
    }, [subtotal, discountType, discountValue]);

    const beforeSST = Math.max(0, subtotal - discountAmt);
    const sst = applySST ? beforeSST * 0.06 : 0;
    const total = beforeSST + sst;

    const handleConfirmPayment = async ({ paymentMethod, remarks, workerId }) => {
        if (!workerId) {
            showDialog({
                type: "error",
                message: "Please select a worker",
                autoClose: true,
                zIndex: 9999,
            });
            return;
        }

        const items = cart.map((item) => {
            const rawId = String(item.itemId);
            const numericId = Number(
                rawId.includes("-") ? rawId.split("-")[1] : rawId
            );

            return {
                type:
                    item.category.toLowerCase() === "phones"
                        ? "phone"
                        : "accessory",
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

            showDialog({
                type: "success",
                message: "Sale created successfully!",
                autoClose: true,
            });
            clearCart();
            setShowCheckout(false);
            await reloadProducts();
        } catch (err) {
            console.error(err);
            showDialog({
                type: "error",
                message: "Failed to create sale: " + err.message,
                autoClose: true,
            });
        } finally {
            setSavingSale(false);
        }
    };

    return (
        <div
            className="
                rounded-2xl p-4 shadow-lg border
                bg-[var(--mt-card)]
                border-[var(--mt-border)]
                flex flex-col h-full
            "
        >
            {/* Header */}
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-bold text-theme-accent">
                    Current Cart
                </h3>
                <div className="text-sm text-theme-text-light">
                    {cartLength} item{cartLength !== 1 ? "s" : ""}
                </div>
            </div>

            {/* CART LIST */}
            <div className="flex-1 overflow-y-auto mb-3">
                {cartLength === 0 ? (
                    <div className="py-12 text-center text-theme-text-light">
                        No items in cart
                    </div>
                ) : (
                    cart.map((it) => (
                        <div
                            key={it.itemId}
                            className="
                                flex items-center justify-between p-2 rounded-lg mb-2
                                border border-[var(--mt-border)]
                                bg-[var(--mt-surface-light)]
                            "
                        >
                            <div>
                                <div className="font-medium text-theme-text">
                                    {it.name}
                                </div>
                                <div className="text-xs text-theme-text-light">
                                    RM {Number(it.price).toFixed(2)}
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() =>
                                        updateQuantity(
                                            it.itemId,
                                            (it.quantity || 1) - 1
                                        )
                                    }
                                    className="p-1 hover:opacity-70"
                                >
                                    <Minus className="w-4 h-4 text-theme-accent" />
                                </button>

                                <div className="w-10 text-center text-theme-text">
                                    {it.quantity}
                                </div>

                                <button
                                    onClick={() =>
                                        updateQuantity(
                                            it.itemId,
                                            (it.quantity || 1) + 1
                                        )
                                    }
                                    className="p-1 hover:opacity-70"
                                >
                                    <Plus className="w-4 h-4 text-theme-accent" />
                                </button>

                                <button
                                    onClick={() => removeFromCart(it.itemId)}
                                    className="p-1 ml-2 hover:opacity-70"
                                >
                                    <Trash2 className="w-4 h-4 text-[var(--mt-error)]" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* SUMMARY */}
            <div className="border-t border-[var(--mt-border)] pt-3 space-y-3">
                <div className="flex justify-between text-sm">
                    <span className="text-theme-text-light">Subtotal</span>
                    <span className="font-semibold text-theme-text">
                        RM {Number(subtotal).toFixed(2)}
                    </span>
                </div>

                {/* DISCOUNT */}
                <div>
                    <div className="text-xs text-theme-text-light mb-1">
                        💸 Discount
                    </div>
                    <div className="flex items-center gap-2">
                        <select
                            value={discountType}
                            onChange={(e) =>
                                setDiscountType(e.target.value)
                            }
                            className="
                                px-2 py-1 rounded-md text-sm
                                bg-[var(--mt-card)]
                                border border-[var(--mt-border)]
                                text-theme-text
                            "
                        >
                            <option value="fixed">RM</option>
                            <option value="percentage">%</option>
                        </select>

                        <input
                            type="text"
                            value={discountValue === 0 ? "" : discountValue}
                            onChange={(e) =>
                                setDiscountValue(
                                    isNaN(Number(e.target.value))
                                        ? 0
                                        : Number(e.target.value)
                                )
                            }
                            className="
                                flex-1 px-2 py-1 rounded-md
                                bg-[var(--mt-card)]
                                border border-[var(--mt-border)]
                                text-theme-text
                            "
                            placeholder="Discount"
                            inputMode="decimal"
                        />
                    </div>
                </div>

                {/* SST */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={applySST}
                            onChange={(e) => setApplySST(e.target.checked)}
                        />
                        <span className="text-sm text-theme-text-light">
                            Apply SST (6%)
                        </span>
                    </div>
                    <div className="text-sm text-theme-text-light">
                        RM {sst.toFixed(2)}
                    </div>
                </div>

                {/* TOTAL */}
                <div className="flex justify-between items-center text-lg font-bold text-theme-accent">
                    <span>Total</span>
                    <span>RM {total.toFixed(2)}</span>
                </div>

                {/* BUTTONS */}
                <div className="flex gap-2 mt-2">
                    {/* CLEAR BUTTON */}
                    <button
                        onClick={() => clearCart()}
                        className="
                            flex-1 py-2 rounded-lg
                            bg-[var(--mt-surface-light)]
                            text-theme-text
                            hover:bg-[var(--mt-surface)]
                            transition
                        "
                    >
                        Clear
                    </button>

                    {/* CHECKOUT BUTTON */}
                    <button
                        onClick={() => setShowCheckout(true)}
                        className="
                            flex-1 py-2 rounded-lg text-white font-semibold
                            bg-[var(--mt-accent)]
                            hover:bg-[var(--mt-header-hover)]
                            transition
                        "
                        disabled={savingSale}
                    >
                        {savingSale ? "Processing..." : "Checkout"}
                    </button>
                </div>

                {/* CHECKOUT DIALOG */}
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
