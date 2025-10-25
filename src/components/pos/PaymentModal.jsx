// src/components/POS/PaymentModal.jsx
import React from 'react';
import { X, Check, Banknote, CreditCard, Phone } from 'lucide-react';

const PaymentModal = ({
                          show,
                          onClose,
                          total,
                          paymentMethod,
                          setPaymentMethod,
                          receivedAmount,
                          setReceivedAmount,
                          onComplete
                      }) => {
    if (!show) return null;

    const received = parseFloat(receivedAmount) || 0;
    const change = received - total;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold">Process Payment</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-4 mb-6">
                    {/* Total Amount */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                        <p className="text-4xl font-bold text-blue-600">${total.toFixed(2)}</p>
                    </div>

                    {/* Payment Method */}
                    <div>
                        <label className="text-sm font-medium text-gray-600 mb-2 block">Payment Method</label>
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                onClick={() => setPaymentMethod('cash')}
                                className={`p-3 rounded-lg border-2 transition-all ${
                                    paymentMethod === 'cash'
                                        ? 'border-green-500 bg-green-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <Banknote className={`w-6 h-6 mx-auto mb-1 ${
                                    paymentMethod === 'cash' ? 'text-green-600' : 'text-gray-400'
                                }`} />
                                <p className="text-xs font-medium">Cash</p>
                            </button>
                            <button
                                onClick={() => setPaymentMethod('card')}
                                className={`p-3 rounded-lg border-2 transition-all ${
                                    paymentMethod === 'card'
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <CreditCard className={`w-6 h-6 mx-auto mb-1 ${
                                    paymentMethod === 'card' ? 'text-blue-600' : 'text-gray-400'
                                }`} />
                                <p className="text-xs font-medium">Card</p>
                            </button>
                            <button
                                onClick={() => setPaymentMethod('ewallet')}
                                className={`p-3 rounded-lg border-2 transition-all ${
                                    paymentMethod === 'ewallet'
                                        ? 'border-purple-500 bg-purple-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <Phone className={`w-6 h-6 mx-auto mb-1 ${
                                    paymentMethod === 'ewallet' ? 'text-purple-600' : 'text-gray-400'
                                }`} />
                                <p className="text-xs font-medium">E-Wallet</p>
                            </button>
                        </div>
                    </div>

                    {/* Amount Received */}
                    <div>
                        <label className="text-sm font-medium text-gray-600 mb-2 block">Amount Received</label>
                        <div className="relative">
                            <span className="absolute left-4 top-3 text-gray-400 text-xl">$</span>
                            <input
                                type="number"
                                step="0.01"
                                value={receivedAmount}
                                onChange={(e) => setReceivedAmount(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 text-xl font-bold border-2 rounded-lg focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div className="flex gap-2 mt-2">
                            {[total, Math.ceil(total / 50) * 50, Math.ceil(total / 100) * 100].map((amount, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setReceivedAmount(amount.toFixed(2))}
                                    className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                                >
                                    ${amount.toFixed(0)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Change Display */}
                    {received >= total && (
                        <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
                            <p className="text-sm text-green-600 mb-1">Change</p>
                            <p className="text-3xl font-bold text-green-700">${change.toFixed(2)}</p>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onComplete}
                        disabled={received < total}
                        className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                    >
                        <Check className="w-5 h-5" />
                        Complete Sale
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;