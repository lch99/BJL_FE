import React, { useState, useEffect, useCallback } from 'react';
import { Building2, Plus, Edit2, Trash2, Loader2 } from 'lucide-react';
import {
    fetchSuppliers,
    createSupplier,
    updateSupplier,
    deleteSupplier
} from '../../util/posApi';

const SupplierView = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState(null);
    const [form, setForm] = useState({
        name: '',
        contact_name: '',
        phone: '',
        email: '',
        address: '',
        notes: '',
        status: 'active'
    });

    const loadSuppliers = useCallback(async () => {
        try {
            setLoading(true);
            const data = await fetchSuppliers();
            setSuppliers(data || []);
        } catch (err) {
            console.error('Failed to load suppliers:', err);
            setSuppliers([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadSuppliers();
    }, [loadSuppliers]);

    const openNew = () => {
        setEditingSupplier(null);
        setForm({
            name: '',
            contact_name: '',
            phone: '',
            email: '',
            address: '',
            notes: '',
            status: 'active'
        });
        setShowModal(true);
    };

    const handleEdit = (s) => {
        setEditingSupplier(s);
        setForm({
            name: s.name || '',
            contact_name: s.contact_name || '',
            phone: s.phone || '',
            email: s.email || '',
            address: s.address || '',
            notes: s.notes || '',
            status: s.status || 'active'
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this supplier?')) return;
        try {
            setLoading(true);
            await deleteSupplier(id);
            await loadSuppliers();
        } catch (err) {
            console.error('Failed to delete supplier:', err);
            alert('Delete failed');
        } finally {
            setLoading(false);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingSupplier(null);
        setForm({
            name: '',
            contact_name: '',
            phone: '',
            email: '',
            address: '',
            notes: '',
            status: 'active'
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name.trim()) return alert('Supplier name is required');
        try {
            setLoading(true);
            if (editingSupplier) {
                await updateSupplier(editingSupplier.id, form);
            } else {
                await createSupplier(form);
            }
            await loadSuppliers();
            closeModal();
        } catch (err) {
            console.error('Failed to save supplier:', err);
            alert('Save failed');
        } finally {
            setLoading(false);
        }
    };

    const stats = {
        total: suppliers.length,
        active: suppliers.filter(s => s.status === 'active').length,
        inactive: suppliers.filter(s => s.status === 'inactive').length
    };

    return (
        <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Suppliers', count: stats.total, color: 'from-purple-500 to-purple-600', icon: Building2 },
                    { label: 'Active', count: stats.active, color: 'from-emerald-400 to-emerald-500', icon: Building2 },
                    { label: 'Inactive', count: stats.inactive, color: 'from-red-400 to-red-500', icon: Building2 }
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
                        <Building2 className="w-7 h-7 text-amber-500" />
                        Suppliers
                    </h2>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={openNew}
                            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-400 text-white rounded-lg font-semibold hover:opacity-90 transition-all flex items-center gap-2 shadow-md"
                        >
                            <Plus className="w-5 h-5" />
                            New Supplier
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-12 text-amber-600">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-3"></div>
                        Loading suppliers...
                    </div>
                ) : suppliers.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                        <Building2 className="w-16 h-16 mx-auto mb-3 opacity-30" />
                        <p className="font-medium">No suppliers found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gradient-to-r from-orange-50 to-yellow-50 border-b border-orange-200">
                            <tr>
                                {['ID', 'Name', 'Contact', 'Phone', 'Email', 'Address', 'Status', 'Actions'].map(h => (
                                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-orange-700 uppercase">{h}</th>
                                ))}
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-orange-100">
                            {suppliers.map(s => (
                                <tr key={s.id} className="hover:bg-orange-50 transition-colors">
                                    <td className="px-4 py-3 font-mono text-sm text-orange-700">#{s.id}</td>
                                    <td className="px-4 py-3 font-semibold text-gray-800">{s.name}</td>
                                    <td className="px-4 py-3">{s.contact_name || '-'}</td>
                                    <td className="px-4 py-3">{s.phone || '-'}</td>
                                    <td className="px-4 py-3">{s.email || '-'}</td>
                                    <td className="px-4 py-3 truncate max-w-xs text-sm text-gray-500">{s.address || '-'}</td>
                                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${s.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {s.status ? s.status.toUpperCase() : 'UNKNOWN'}
                      </span>
                                    </td>
                                    <td className="px-4 py-3 flex gap-2">
                                        <button onClick={() => handleEdit(s)} className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(s.id)} className="p-2 hover:bg-red-100 text-red-600 rounded-lg">
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
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto border border-amber-100">
                        <h3 className="text-2xl font-bold mb-6 text-orange-700">
                            {editingSupplier ? 'Edit Supplier' : 'New Supplier'}
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Supplier Name *</label>
                                    <input
                                        required
                                        type="text"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        className="w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:border-orange-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                                    <input
                                        type="text"
                                        value={form.contact_name}
                                        onChange={(e) => setForm({ ...form, contact_name: e.target.value })}
                                        className="w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:border-orange-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                    <input
                                        type="text"
                                        value={form.phone}
                                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                        className="w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:border-orange-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        className="w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:border-orange-500"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                    <textarea
                                        value={form.address}
                                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                                        className="w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:border-orange-500"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                                    <textarea
                                        value={form.notes}
                                        onChange={(e) => setForm({ ...form, notes: e.target.value })}
                                        className="w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:border-orange-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <select
                                        value={form.status}
                                        onChange={(e) => setForm({ ...form, status: e.target.value })}
                                        className="w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:border-orange-500"
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={closeModal} className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium">Cancel</button>
                                <button type="submit" disabled={loading} className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-400 text-white rounded-lg font-bold hover:opacity-90 disabled:opacity-50 transition-all">
                                    {loading ? 'Saving...' : editingSupplier ? 'Update Supplier' : 'Create Supplier'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SupplierView;
