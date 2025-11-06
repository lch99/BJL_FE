import { X, Printer } from 'lucide-react';

const ReceiptModal = ({ show, onClose, receipt }) => {
    if (!show || !receipt) return null;

    const handlePrint = () => window.print();
    const safeNum = (val) => (typeof val === 'number' ? val : 0);

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-amber-100">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-extrabold text-orange-700">Receipt</h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-orange-50 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-orange-600" />
                    </button>
                </div>

                {/* Receipt Content */}
                <div className="border-2 border-dashed border-orange-200 p-6 rounded-lg">
                    {/* Transaction Details */}
                    <div className="space-y-2 mb-4 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Transaction ID:</span>
                            <span className="font-mono font-medium text-gray-800">
                {receipt.id || receipt.sale_id || 'N/A'}
              </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Date:</span>
                            <span className="font-medium text-gray-800">
                {new Date(receipt.date || Date.now()).toLocaleString()}
              </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Customer:</span>
                            <span className="font-medium text-gray-800">
                {receipt.customer || 'Walk-in'}
              </span>
                        </div>
                        {receipt.phone && receipt.phone !== 'N/A' && (
                            <div className="flex justify-between">
                                <span className="text-gray-600">Phone:</span>
                                <span className="font-medium text-gray-800">
                  {receipt.phone}
                </span>
                            </div>
                        )}
                    </div>

                    {/* Items */}
                    <div className="border-t-2 border-dashed border-orange-200 pt-4 mb-4">
                        {receipt.items?.map((item, idx) => (
                            <div
                                key={idx}
                                className="flex justify-between mb-2 text-sm text-gray-700"
                            >
                                <div className="flex-1">
                                    <div className="font-medium">{item.name}</div>
                                    <div className="text-gray-500">
                                        {item.quantity} × RM{safeNum(item.selling_price).toFixed(2)}
                                    </div>
                                </div>
                                <div className="font-bold text-orange-700">
                                    RM
                                    {(safeNum(item.price) * safeNum(item.quantity)).toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Totals */}
                    <div className="border-t-2 border-dashed border-orange-200 pt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Subtotal:</span>
                            <span className="font-medium text-gray-800">
                ${safeNum(receipt.subtotal).toFixed(2)}
              </span>
                        </div>
                        {safeNum(receipt.discount) > 0 && (
                            <div className="flex justify-between text-sm text-green-600">
                                <span>Discount:</span>
                                <span className="font-medium">
                  -${safeNum(receipt.discount).toFixed(2)}
                </span>
                            </div>
                        )}
                        <div className="flex justify-between text-lg font-bold border-t pt-2 text-orange-700">
                            <span>Total:</span>
                            <span>${safeNum(receipt.total).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
              <span className="text-gray-600">
                Payment ({receipt.paymentMethod || receipt.payment_method || 'Cash'}):
              </span>
                            <span className="font-medium text-gray-800">
                RM
                                {safeNum(receipt.receivedAmount || receipt.amount_received).toFixed(2)}
              </span>
                        </div>
                        {safeNum(receipt.change) > 0 && (
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Change:</span>
                                <span className="font-medium text-gray-800">
                  ${safeNum(receipt.change).toFixed(2)}
                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                    >
                        Close
                    </button>
                    <button
                        onClick={handlePrint}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all"
                    >
                        <Printer className="w-5 h-5" />
                        Print
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReceiptModal;
