import React from 'react';
import {
    TrendingUp,
    DollarSign,
    BarChart3,
    ShoppingCart,
    Calendar,
    Printer
} from 'lucide-react';
import { getTodaySales, getTodayProfit } from '../../util/calculations';

const ReportsView = ({ transactions = [], setLastReceipt, setShowReceiptModal }) => {
    const safeNum = (val) => (isNaN(val) || val == null ? 0 : Number(val));

    // Normalize backend field differences
    const mappedTransactions = transactions.map((t) => ({
        id: t.id || t.sale_id,
        date: t.date || t.sale_date || new Date().toISOString(),
        customer: t.customer_name || t.customer || 'Walk-in',
        phone: t.customer_phone || t.phone || 'N/A',
        items: t.items || t.sale_items || [],
        total: safeNum(t.total || t.total_amount),
        profit: safeNum(t.profit || t.total_profit || 0)
    }));

    const totalSales = mappedTransactions.reduce((sum, t) => sum + safeNum(t.total), 0);
    const totalProfit = mappedTransactions.reduce((sum, t) => sum + safeNum(t.profit), 0);
    const todaySales = safeNum(getTodaySales(mappedTransactions));
    const todayProfit = safeNum(getTodayProfit(mappedTransactions));

    const handleViewReceipt = (transaction) => {
        setLastReceipt(transaction);
        setShowReceiptModal(true);
    };

    return (
        <div className="space-y-6">
            {/* Dashboard Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white rounded-2xl shadow-md p-6">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-orange-100 text-sm font-medium">Today's Sales</p>
                        <TrendingUp className="w-8 h-8 opacity-30" />
                    </div>
                    <p className="text-4xl font-bold mb-1">RM{todaySales.toFixed(2)}</p>
                    <p className="text-orange-100 text-xs">Profit: RM{todayProfit.toFixed(2)}</p>
                </div>

                <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-2xl shadow-md p-6">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-orange-100 text-sm font-medium">Total Sales</p>
                        <DollarSign className="w-8 h-8 opacity-30" />
                    </div>
                    <p className="text-4xl font-bold mb-1">RM{totalSales.toFixed(2)}</p>
                    <p className="text-orange-100 text-xs">All-time revenue</p>
                </div>

                <div className="bg-gradient-to-br from-orange-400 to-amber-600 text-white rounded-2xl shadow-md p-6">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-amber-100 text-sm font-medium">Total Profit</p>
                        <BarChart3 className="w-8 h-8 opacity-30" />
                    </div>
                    <p className="text-4xl font-bold mb-1">RM{totalProfit.toFixed(2)}</p>
                    <p className="text-amber-100 text-xs">Net earnings</p>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-yellow-600 text-white rounded-2xl shadow-md p-6">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-yellow-100 text-sm font-medium">Transactions</p>
                        <ShoppingCart className="w-8 h-8 opacity-30" />
                    </div>
                    <p className="text-4xl font-bold mb-1">{mappedTransactions.length}</p>
                    <p className="text-yellow-100 text-xs">Total orders</p>
                </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-amber-100">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2 text-amber-600">
                        <Calendar className="w-6 h-6 text-amber-500" />
                        Transaction History
                    </h2>
                </div>

                {mappedTransactions.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                        <BarChart3 className="w-16 h-16 mx-auto mb-3 opacity-30" />
                        <p className="font-medium">No transactions found</p>
                        <p className="text-sm">Complete your first sale to see it here</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gradient-to-r from-amber-50 to-yellow-50 border-b-2 border-amber-200">
                            <tr>
                                {['ID', 'Date', 'Customer', 'Items', 'Total', 'Profit', 'Actions'].map((h) => (
                                    <th
                                        key={h}
                                        className="px-4 py-3 text-left text-xs font-bold text-amber-700 uppercase tracking-wide"
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-amber-100">
                            {mappedTransactions.map((t) => (
                                <tr key={t.id} className="hover:bg-amber-50 transition-colors">
                                    <td className="px-4 py-3 font-mono text-sm text-amber-700">#{t.id}</td>
                                    <td className="px-4 py-3 text-sm">
                                        {new Date(t.date).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="font-medium">{t.customer}</div>
                                        {t.phone && t.phone !== 'N/A' && (
                                            <div className="text-xs text-gray-500">{t.phone}</div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                        {t.items.length} item{t.items.length > 1 ? 's' : ''}
                                    </td>
                                    <td className="px-4 py-3 text-right font-bold text-gray-900">
                                        RM{safeNum(t.total).toFixed(2)}
                                    </td>
                                    <td className="px-4 py-3 text-right font-bold text-green-600">
                                        RM{safeNum(t.profit).toFixed(2)}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <button
                                            onClick={() => handleViewReceipt(t)}
                                            className="p-2 hover:bg-amber-100 text-amber-600 rounded-lg transition-colors"
                                        >
                                            <Printer className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReportsView;
