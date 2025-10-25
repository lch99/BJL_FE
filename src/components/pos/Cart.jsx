// src/components/POS/Cart.jsx
import React from 'react';
import { Plus, Minus, Trash2, CreditCard, X } from 'lucide-react';

const Cart = ({
                  cart,
                  customerName,
                  setCustomerName,
                  customerPhone,
                  setCustomerPhone,
                  discount,
                  setDiscount,
                  discountType,
                  setDiscountType,
                  updateQuantity,
                  removeFromCart,
                  clearCart,
                  calculateSubtotal,
                  calculateDiscount,
                  calculateTotal,
                  initiatePayment
              }) => {
    const subtotal = calculateSubtotal();
    const totalDiscount = calculateDiscount();
    const total = calculateTotal();

    return (
        <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-amber-200 p-5 flex flex-col h-full">
            <h2 className="text-xl font-bold mb-4 text-amber-700 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-orange-500" />
                Current Cart
            </h2>

            {/* Empty Cart */}
            {cart.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                    <X className="w-12 h-12 mb-3 opacity-30" />
                    <p>No items in cart</p>
                </div>
            ) : (
                <div className="flex-1 overflow-y-auto pr-1 space-y-3">
                    {cart.map(item => (
                        <div
                            key={item.id}
                            className="flex items-center justify-between bg-white rounded-xl border border-amber-100 shadow-sm p-3 hover:border-orange-300 transition-all"
                        >
                            <div>
                                <p className="font-semibold text-gray-800">{item.name}</p>
                                <p className="text-xs text-gray-500">${item.sell_price} each</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="p-1 rounded-md hover:bg-orange-100"
                                >
                                    <Minus className="w-4 h-4 text-orange-600" />
                                </button>
                                <span className="w-6 text-center font-medium">{item.quantity}</span>
                                <button
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="p-1 rounded-md hover:bg-orange-100"
                                >
                                    <Plus className="w-4 h-4 text-orange-600" />
                                </button>
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="p-1 rounded-md hover:bg-red-100"
                                >
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Summary */}
            <div className="mt-4 border-t border-amber-200 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-600">Subtotal:</span>
                    <span className="font-semibold text-gray-800">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-600">Discount:</span>
                    <span className="font-semibold text-orange-600">-${totalDiscount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-amber-800">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                </div>
            </div>

            {/* Customer Info */}
            <div className="mt-4 space-y-3">
                <input
                    type="text"
                    placeholder="Customer Name"
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    className="w-full border border-amber-200 rounded-lg px-3 py-2 text-sm focus:border-orange-400 focus:ring-1 focus:ring-orange-300"
                />
                <input
                    type="text"
                    placeholder="Phone Number"
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value)}
                    className="w-full border border-amber-200 rounded-lg px-3 py-2 text-sm focus:border-orange-400 focus:ring-1 focus:ring-orange-300"
                />
                <div className="flex gap-2">
                    <input
                        type="number"
                        placeholder="Discount"
                        value={discount}
                        onChange={e => setDiscount(Number(e.target.value))}
                        className="w-1/2 border border-amber-200 rounded-lg px-3 py-2 text-sm focus:border-orange-400 focus:ring-1 focus:ring-orange-300"
                    />
                    <select
                        value={discountType}
                        onChange={e => setDiscountType(e.target.value)}
                        className="w-1/2 border border-amber-200 rounded-lg px-3 py-2 text-sm bg-white focus:border-orange-400 focus:ring-1 focus:ring-orange-300"
                    >
                        <option value="fixed">$</option>
                        <option value="percentage">%</option>
                    </select>
                </div>
            </div>

            {/* Actions */}
            <div className="mt-5 flex gap-2">
                <button
                    onClick={clearCart}
                    className="flex-1 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 font-semibold transition"
                >
                    Clear
                </button>
                <button
                    onClick={initiatePayment}
                    disabled={cart.length === 0}
                    className="flex-1 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold shadow-md hover:shadow-lg hover:scale-[1.02] transition disabled:opacity-60"
                >
                    Checkout
                </button>
            </div>
        </div>
    );
};

export default Cart;
