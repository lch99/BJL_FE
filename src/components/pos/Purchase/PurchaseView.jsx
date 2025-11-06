import React, { useState, useEffect, useCallback } from 'react';
import { PackagePlus, Trash2, Loader2, Edit2} from 'lucide-react';
import {
    fetchPurchases,
    createPurchase,
    updatePurchase,
    voidPurchase,
    fetchSuppliers,
    fetchProducts
} from '../../../util/posApi';

const emptyItem = () => ({ product_type: 'phone', product_id: '', quantity: 1, unit_cost: 0, subtotal: 0 });

const PurchaseView = () => {
    const [purchases, setPurchases] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [products, setProducts] = useState([]); // combined phones/accessories from fetchProducts()
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingPurchase, setEditingPurchase] = useState(null);

    const [form, setForm] = useState({
        invoice_no: '',
        purchase_date: new Date().toISOString().slice(0, 10),
        supplier_id: '',
        items: [emptyItem()],
        remarks: ''
    });

    const loadInitial = useCallback(async () => {
        try {
            setLoading(true);
            const [pData, sData, prodData] = await Promise.all([
                fetchPurchases(),
                fetchSuppliers(),
                fetchProducts()
            ]);
            setPurchases(pData || []);
            setSuppliers(sData || []);
            setProducts(prodData || []);
        } catch (err) {
            console.error('Failed to load purchases/suppliers/products:', err);
            setPurchases([]);
            setSuppliers([]);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadInitial();
    }, [loadInitial]);

    const openNew = () => {
        setEditingPurchase(null);
        setForm({
            invoice_no: '',
            purchase_date: new Date().toISOString().slice(0, 10),
            supplier_id: '',
            items: [emptyItem()],
            remarks: ''
        });
        setShowModal(true);
    };

    const handleEdit = (p) => {
        // load purchase items if needed; assume API returns items when fetching purchases
        const items = (p.items || []).map(it => ({
            product_type: it.product_type,
            product_id: it.product_id,
            quantity: it.quantity,
            unit_cost: parseFloat(it.unit_cost || 0),
            subtotal: parseFloat(it.subtotal || 0)
        }));
        setEditingPurchase(p);
        setForm({
            invoice_no: p.invoice_no || '',
            purchase_date: p.purchase_date ? p.purchase_date.slice(0, 10) : new Date().toISOString().slice(0,10),
            supplier_id: p.supplier_id || '',
            items: items.length ? items : [emptyItem()],
            remarks: p.remarks || ''
        });
        setShowModal(true);
    };

    const handleVoid = async (id) => {
        if (!window.confirm('Void this purchase?')) return;
        try {
            setLoading(true);
            await voidPurchase(id);
            await loadInitial();
        } catch (err) {
            console.error('Failed to void purchase:', err);
            alert('Void failed');
        } finally {
            setLoading(false);
        }
    };

    const addItem = () => {
        setForm(f => ({ ...f, items: [...f.items, emptyItem()] }));
    };

    const removeItem = (idx) => {
        setForm(f => {
            const items = [...f.items];
            items.splice(idx, 1);
            return { ...f, items: items.length ? items : [emptyItem()] };
        });
    };

    const updateItem = (idx, field, value) => {
        setForm(f => {
            const items = [...f.items];
            items[idx] = { ...items[idx], [field]: value };

            // recalc subtotal if qty or cost changed
            const qty = Number(items[idx].quantity) || 0;
            const cost = Number(items[idx].unit_cost) || 0;
            items[idx].subtotal = parseFloat((qty * cost).toFixed(2));

            return { ...f, items };
        });
    };

    const onProductTypeChange = (idx, type) => {
        updateItem(idx, 'product_type', type);
        // clear product selection
        updateItem(idx, 'product_id', '');
    };

    const calculateTotal = () => {
        return form.items.reduce((s, it) => s + (Number(it.subtotal) || 0), 0);
    };

    const handleSubmit = async () => {
        if (!form.supplier_id) return alert('Select a supplier.');
        if (!form.invoice_no) return alert('Invoice number required.');
        if (form.items.length === 0) return alert('Add at least one item.');

        // Basic validation of items
        for (let i = 0; i < form.items.length; i++) {
            const it = form.items[i];
            if (!it.product_id) return alert(`Select product for line ${i+1}`);
            if (!it.quantity || it.quantity <= 0) return alert(`Invalid qty at line ${i+1}`);
            if (!it.unit_cost || it.unit_cost < 0) return alert(`Invalid cost at line ${i+1}`);
        }

        const payload = {
            invoice_no: form.invoice_no,
            purchase_date: form.purchase_date,
            supplier_id: form.supplier_id,
            total_cost: calculateTotal(),
            remarks: form.remarks,
            items: form.items.map(it => ({
                product_type: it.product_type,
                product_id: Number(it.product_id),
                quantity: Number(it.quantity),
                unit_cost: Number(it.unit_cost),
                subtotal: Number(it.subtotal)
            }))
        };

        try {
            setLoading(true);
            if (editingPurchase) {
                await updatePurchase(editingPurchase.id, payload);
            } else {
                await createPurchase(payload);
            }
            await loadInitial();
            setShowModal(false);
        } catch (err) {
            console.error('Failed to save purchase:', err);
            alert('Save failed');
        } finally {
            setLoading(false);
        }
    };

    // helper to get filtered product list for a line (by type)
    const getProductsByType = (type) => products.filter(p => {
        // assume product has field to indicate type, check common keys
        // If fetchProducts returns category or product_type, use it; try both
        const t = (p.product_type || p.type || p.category || '').toString().toLowerCase();
        if (type === 'phone') {
            return t.includes('phone') || t.includes('phones') || (p.is_phone === true);
        } else {
            return t.includes('accessory') || t.includes('accessories') || (p.is_accessory === true);
        }
    });

    return (
        <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Purchases', count: purchases.length, color: 'from-purple-500 to-purple-600', icon: PackagePlus },
                    { label: 'Total Amount (RM)', count: purchases.reduce((s,p) => s + Number(p.total_cost || 0), 0).toFixed(2), color: 'from-emerald-400 to-emerald-500', icon: PackagePlus },
                    { label: 'Suppliers', count: suppliers.length, color: 'from-blue-400 to-blue-500', icon: PackagePlus }
                ].map(({ label, count, color, icon: Icon }, idx) => (
                    <div key={idx} className={`bg-gradient-to-br ${color} text-white rounded-xl p-6 shadow-md`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-white/80 mb-1">{label}</p>
                                <p className="text-4xl font-bold">{count}</p>
                            </div>
                            <Icon className="w-10 h-10 opacity-30" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-amber-100">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2 text-amber-700">
                        <PackagePlus className="w-7 h-7 text-amber-500" />
                        Purchases
                    </h2>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={openNew}
                            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-400 text-white rounded-lg font-semibold hover:opacity-90 transition-all flex items-center gap-2 shadow-md"
                        >
                            <PackagePlus className="w-5 h-5" />
                            New Purchase
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-12 text-amber-600">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-3"></div>
                        Loading purchases...
                    </div>
                ) : purchases.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                        <PackagePlus className="w-16 h-16 mx-auto mb-3 opacity-30" />
                        <p className="font-medium">No purchases found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gradient-to-r from-orange-50 to-yellow-50 border-b border-orange-200">
                            <tr>
                                {['ID', 'Invoice', 'Supplier', 'Date', 'Total (RM)', 'Remarks', 'Status', 'Actions'].map(h => (
                                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-orange-700 uppercase">{h}</th>
                                ))}
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-orange-100">
                            {purchases.map(p => (
                                <tr key={p.id} className="hover:bg-orange-50 transition-colors">
                                    <td className="px-4 py-3 font-mono text-sm text-orange-700">#{p.id}</td>
                                    <td className="px-4 py-3 font-semibold text-gray-800">{p.invoice_no}</td>
                                    <td className="px-4 py-3">{(p.Supplier && p.Supplier.name) || p.supplier_name || '-'}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{p.purchase_date ? new Date(p.purchase_date).toLocaleDateString() : '-'}</td>
                                    <td className="px-4 py-3 font-bold text-orange-700">RM {Number(p.total_cost || 0).toFixed(2)}</td>
                                    <td className="px-4 py-3 truncate max-w-xs text-sm text-gray-500">{p.remarks || '-'}</td>
                                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${p.voided ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        {p.voided ? 'VOIDED' : (p.status || 'N/A').toString().toUpperCase()}
                      </span>
                                    </td>
                                    <td className="px-4 py-3 flex gap-2">
                                        <button onClick={() => handleEdit(p)} className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleVoid(p.id)} className="p-2 hover:bg-red-100 text-red-600 rounded-lg">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto border border-amber-100">
                        <h3 className="text-2xl font-bold mb-6 text-orange-700">
                            {editingPurchase ? 'Edit Purchase' : 'New Purchase'}
                        </h3>

                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Invoice No *</label>
                                    <input
                                        type="text"
                                        value={form.invoice_no}
                                        onChange={(e) => setForm({ ...form, invoice_no: e.target.value })}
                                        className="w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:border-orange-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Date *</label>
                                    <input
                                        type="date"
                                        value={form.purchase_date}
                                        onChange={(e) => setForm({ ...form, purchase_date: e.target.value })}
                                        className="w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:border-orange-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Supplier *</label>
                                    <select
                                        value={form.supplier_id}
                                        onChange={(e) => setForm({ ...form, supplier_id: e.target.value })}
                                        className="w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:border-orange-500"
                                    >
                                        <option value="">Select Supplier</option>
                                        {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* Items */}
                            <div className="border rounded-lg overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead className="bg-emerald-100 text-emerald-800">
                                    <tr>
                                        <th className="p-2 text-left">Type</th>
                                        <th className="p-2 text-left">Product</th>
                                        <th className="p-2 text-right">Qty</th>
                                        <th className="p-2 text-right">Unit Cost</th>
                                        <th className="p-2 text-right">Subtotal</th>
                                        <th className="p-2 text-center">Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {form.items.map((it, idx) => {
                                        const list = getProductsByType(it.product_type);
                                        return (
                                            <tr key={idx} className="border-t">
                                                <td className="p-2">
                                                    <select
                                                        value={it.product_type}
                                                        onChange={(e) => onProductTypeChange(idx, e.target.value)}
                                                        className="border px-2 py-1 rounded"
                                                    >
                                                        <option value="phone">Phone</option>
                                                        <option value="accessory">Accessory</option>
                                                    </select>
                                                </td>

                                                <td className="p-2">
                                                    <select
                                                        value={it.product_id}
                                                        onChange={(e) => updateItem(idx, 'product_id', e.target.value)}
                                                        className="w-full border px-2 py-1 rounded"
                                                    >
                                                        <option value="">Select product</option>
                                                        {list.map(p => (
                                                            <option key={p.id} value={p.id}>
                                                                {p.name || p.title || p.model || `#${p.id}`}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>

                                                <td className="p-2 text-right">
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={it.quantity}
                                                        onChange={(e) => updateItem(idx, 'quantity', Number(e.target.value))}
                                                        className="border px-2 py-1 rounded w-20 text-right"
                                                    />
                                                </td>

                                                <td className="p-2 text-right">
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        value={it.unit_cost}
                                                        onChange={(e) => updateItem(idx, 'unit_cost', Number(e.target.value))}
                                                        className="border px-2 py-1 rounded w-28 text-right"
                                                    />
                                                </td>

                                                <td className="p-2 text-right font-semibold">RM {(Number(it.subtotal) || 0).toFixed(2)}</td>

                                                <td className="p-2 text-center">
                                                    <button onClick={() => removeItem(idx)} className="text-red-600 hover:text-red-800 p-2">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Add item + remarks */}
                            <div className="flex gap-3 items-center">
                                <button onClick={addItem} className="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600">+ Add Item</button>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                                    <input type="text" value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} className="w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:border-orange-500" />
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">Total</p>
                                    <p className="text-xl font-bold">RM {calculateTotal().toFixed(2)}</p>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => { setShowModal(false); setEditingPurchase(null); }} className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium">Cancel</button>
                                <button onClick={handleSubmit} disabled={loading} className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-400 text-white rounded-lg font-bold hover:opacity-90 disabled:opacity-50 transition-all">
                                    {loading ? <><Loader2 className="inline w-4 h-4 animate-spin mr-2" />Saving...</> : editingPurchase ? 'Update Purchase' : 'Create Purchase'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PurchaseView;
