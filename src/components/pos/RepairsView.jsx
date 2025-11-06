import React, {useState, useEffect, useCallback} from 'react';
import {Wrench, Plus, Edit2, Trash2, Clock, CheckCircle, XCircle} from 'lucide-react';
import {fetchRepairs, createRepair, updateRepair, deleteRepair} from '../../util/posApi';

const REPAIR_OPTIONS = [
    "Screen Replacement",
    "Battery Replacement",
    "Volume Button Repair",
    "Charging Port Replacement",
    "Water Damage Cleaning",
    "Software Update",
    "OS Reinstallation",
    "App Crash Fix",
    "No Power Issue",
    "Overheating Issue",
    "Camera Replacement",
    "Speaker/Mic Problem",
    "Touchscreen Issue"
];

const RepairsView = () => {
    const [repairs, setRepairs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [editingRepair, setEditingRepair] = useState(null);

    const [formData, setFormData] = useState({
        customer_name: '',
        customer_phone: '',
        customer_email: '',
        device_brand: '',
        device_model: '',
        issue_description: '',
        repair_cost: '',
        status: 'pending'
    });

    const loadRepairs = useCallback(async () => {
        try {
            setLoading(true);
            const data = await fetchRepairs({
                status: statusFilter,
                start_date: dateFrom,
                end_date: dateTo
            });
            setRepairs(data);
        } catch (err) {
            console.error('Error fetching repairs:', err);
        } finally {
            setLoading(false);
        }
    }, [statusFilter, dateFrom, dateTo]);


    useEffect(() => {
        loadRepairs();
    }, [loadRepairs]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (editingRepair) {
                await updateRepair(editingRepair.id, formData);
            } else {
                await createRepair(formData);
            }
            await loadRepairs();
            closeModal();
        } catch (error) {
            console.error('Error saving repair:', error);
            alert('Failed to save repair');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (repair) => {
        setEditingRepair(repair);
        setFormData({
            customer_name: repair.customer_name || '',
            customer_phone: repair.customer_phone || '',
            customer_email: repair.customer_email || '',
            device_brand: repair.device_brand || '',
            device_model: repair.device_model || '',
            issue_description: repair.issue_description || '',
            repair_cost: repair.repair_cost || '',
            status: repair.status || 'pending'
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this repair?')) return;

        try {
            setLoading(true);
            await deleteRepair(id);
            await loadRepairs();
        } catch (error) {
            console.error('Error deleting repair:', error);
            alert('Failed to delete repair');
        } finally {
            setLoading(false);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingRepair(null);
        setFormData({
            customer_name: '',
            customer_phone: '',
            customer_email: '',
            device_brand: '',
            device_model: '',
            issue_description: '',
            repair_cost: '',
            status: 'pending'
        });
    };

    const getStatusBadge = (status) => {
        if (!status) {
            return (
                <span
                    className="px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 bg-gray-100 text-gray-800">
        <Clock className="w-3 h-3"/>
        UNKNOWN
      </span>
            );
        }

        const styles = {
            pending: 'bg-yellow-100 text-yellow-800',
            in_progress: 'bg-blue-100 text-blue-800',
            completed: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800',
        };

        const icons = {
            pending: Clock,
            in_progress: Wrench,
            completed: CheckCircle,
            cancelled: XCircle,
        };

        const Icon = icons[status] || Clock;

        return (
            <span
                className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
                    styles[status] || 'bg-gray-100 text-gray-800'
                }`}
            >
      <Icon className="w-3 h-3"/>
                {status.replace('_', ' ').toUpperCase()}
    </span>
        );
    };


    const stats = {
        total: repairs.length,
        pending: repairs.filter((r) => r.status === 'pending').length,
        inProgress: repairs.filter((r) => r.status === 'in_progress').length,
        completed: repairs.filter((r) => r.status === 'completed').length,
        cancelled: repairs.filter((r) => r.status === 'cancelled').length
    };

    return (
        <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
                    {label: 'Total Repairs', count: stats.total, color: 'from-purple-500 to-purple-600', icon: Wrench},
                    {label: 'Pending', count: stats.pending, color: 'from-yellow-400 to-yellow-500', icon: Clock},
                    {label: 'In Progress', count: stats.inProgress, color: 'from-blue-500 to-blue-600', icon: Wrench},
                    {
                        label: 'Completed',
                        count: stats.completed,
                        color: 'from-green-500 to-green-600',
                        icon: CheckCircle
                    },
                    {label: 'Cancelled', count: stats.cancelled, color: 'from-red-500 to-red-600', icon: XCircle}
                ].map(({label, count, color, icon: Icon}, idx) => (
                    <div key={idx} className={`bg-gradient-to-br ${color} text-white rounded-xl p-6 shadow-md`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-white/80 mb-1">{label}</p>
                                <p className="text-4xl font-bold">{count}</p>
                            </div>
                            <Icon className="w-10 h-10 opacity-30"/>
                        </div>
                    </div>
                ))}
            </div>

            {/* Repairs Table */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-amber-100">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2 text-orange-700">
                        <Wrench className="w-7 h-7 text-orange-500"/>
                        Repairs Management
                    </h2>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap gap-3 items-center">
                        {/* Status Filter */}
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 border-2 border-amber-200 rounded-lg focus:outline-none focus:border-orange-500"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>

                        {/* Date Range Filter */}
                        <div className="flex items-center gap-2 text-sm">
                            <label className="text-gray-700">From:</label>
                            <input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                className="border-2 border-amber-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-orange-500"
                            />
                            <label className="text-gray-700">To:</label>
                            <input
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                                className="border-2 border-amber-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-orange-500"
                            />
                        </div>

                        {/* Add Repair Button */}
                        <button
                            onClick={() => setShowModal(true)}
                            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-400 text-white rounded-lg font-semibold hover:opacity-90 transition-all flex items-center gap-2 shadow-md"
                        >
                            <Plus className="w-5 h-5" />
                            New Repair
                        </button>
                    </div>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-12 text-amber-600">
                        <div
                            className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-3"></div>
                        Loading repairs...
                    </div>
                ) : repairs.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                        <Wrench className="w-16 h-16 mx-auto mb-3 opacity-30"/>
                        <p className="font-medium">No repairs found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gradient-to-r from-orange-50 to-yellow-50 border-b border-orange-200">
                            <tr>
                                {['ID', 'Customer', 'Device', 'Issue', 'Cost', 'Status', 'Date', 'Actions'].map((h) => (
                                    <th
                                        key={h}
                                        className="px-4 py-3 text-left text-xs font-bold text-orange-700 uppercase"
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-orange-100">
                            {repairs.map((r) => (
                                <tr key={r.id} className="hover:bg-orange-50 transition-colors">
                                    <td className="px-4 py-3 font-mono text-sm text-orange-700">#{r.id}</td>
                                    <td className="px-4 py-3">
                                        <div className="font-semibold text-gray-800">{r.customer_name}</div>
                                        <div className="text-xs text-gray-500">{r.customer_phone}</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="font-medium">{r.device_brand}</div>
                                        <div className="text-xs text-gray-500">{r.device_model}</div>
                                    </td>
                                    <td className="px-4 py-3 truncate max-w-xs">{r.issue_description}</td>
                                    <td className="px-4 py-3 font-bold text-orange-700">
                                        ${parseFloat(r.repair_cost || 0).toFixed(2)}
                                    </td>
                                    <td className="px-4 py-3">{getStatusBadge(r.status)}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">
                                        {new Date(r.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-3 flex gap-2">
                                        <button
                                            onClick={() => handleEdit(r)}
                                            className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg"
                                        >
                                            <Edit2 className="w-4 h-4"/>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(r.id)}
                                            className="p-2 hover:bg-red-100 text-red-600 rounded-lg"
                                        >
                                            <Trash2 className="w-4 h-4"/>
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
                    <div
                        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto border border-amber-100">
                        <h3 className="text-2xl font-bold mb-6 text-orange-700">
                            {editingRepair ? 'Edit Repair' : 'New Repair'}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                {/* Optional Customer Info */}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Customer Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.customer_name}
                                        onChange={(e) =>
                                            setFormData({...formData, customer_name: e.target.value})
                                        }
                                        className="w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:border-orange-500"
                                        placeholder="Optional"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Contact Number
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.customer_phone}
                                        onChange={(e) =>
                                            setFormData({...formData, customer_phone: e.target.value})
                                        }
                                        className="w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:border-orange-500"
                                        placeholder="Optional"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Device Model *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.device_model}
                                        onChange={(e) =>
                                            setFormData({...formData, device_model: e.target.value})
                                        }
                                        className="w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:border-orange-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Repair Cost (RM) *
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        value={formData.repair_cost}
                                        onChange={(e) =>
                                            setFormData({...formData, repair_cost: e.target.value})
                                        }
                                        className="w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:border-orange-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Status *
                                    </label>
                                    <select
                                        required
                                        value={formData.status}
                                        onChange={(e) =>
                                            setFormData({...formData, status: e.target.value})
                                        }
                                        className="w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:border-orange-500"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Issue Description *
                                </label>

                                {/* Selected Tags Preview */}
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {formData.issue_description
                                        .split(', ')
                                        .filter(Boolean)
                                        .map((issue) => (
                                            <span
                                                key={issue}
                                                className="flex items-center gap-1 bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium"
                                            >
                    {issue}
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const remaining = formData.issue_description
                                                            .split(', ')
                                                            .filter((i) => i !== issue);
                                                        setFormData({
                                                            ...formData,
                                                            issue_description: remaining.join(', '),
                                                        });
                                                    }}
                                                    className="ml-1 text-orange-600 hover:text-orange-800"
                                                >
                        ×
                    </button>
                </span>
                                        ))}

                                    {formData.issue_description.trim() === '' && (
                                        <span className="text-gray-400 text-sm italic">
                No issues selected yet
            </span>
                                    )}
                                </div>

                                {/* Common Repair Options */}
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
                                    {REPAIR_OPTIONS.map((option) => {
                                        const selected = formData.issue_description
                                            .split(', ')
                                            .includes(option);
                                        return (
                                            <button
                                                key={option}
                                                type="button"
                                                onClick={() => {
                                                    const selectedIssues = formData.issue_description
                                                        ? formData.issue_description.split(', ').filter(Boolean)
                                                        : [];
                                                    if (selected) {
                                                        const updated = selectedIssues.filter((i) => i !== option);
                                                        setFormData({
                                                            ...formData,
                                                            issue_description: updated.join(', '),
                                                        });
                                                    } else {
                                                        selectedIssues.push(option);
                                                        setFormData({
                                                            ...formData,
                                                            issue_description: selectedIssues.join(', '),
                                                        });
                                                    }
                                                }}
                                                className={`border-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                                                    selected
                                                        ? 'bg-orange-500 text-white border-orange-500'
                                                        : 'border-gray-300 hover:border-orange-400 hover:bg-orange-50'
                                                }`}
                                            >
                                                {option}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Add Custom Issue */}
                                <div className="mt-2">
                                    <label className="text-sm text-gray-600 mb-1 block">
                                        Add Custom Issue
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Type and press Enter"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && e.target.value.trim() !== '') {
                                                    e.preventDefault();
                                                    const newIssue = e.target.value.trim();
                                                    const selected = formData.issue_description
                                                        ? formData.issue_description.split(', ').filter(Boolean)
                                                        : [];
                                                    if (!selected.includes(newIssue)) {
                                                        selected.push(newIssue);
                                                        setFormData({
                                                            ...formData,
                                                            issue_description: selected.join(', '),
                                                        });
                                                    }
                                                    e.target.value = '';
                                                }
                                            }}
                                            className="flex-1 px-3 py-2 border-2 rounded-lg focus:outline-none focus:border-orange-500"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">
                                        Press <span className="font-semibold">Enter</span> to add custom issue
                                    </p>
                                </div>
                            </div>


                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-400 text-white rounded-lg font-bold hover:opacity-90 disabled:opacity-50 transition-all"
                                >
                                    {loading ? 'Saving...' : editingRepair ? 'Update Repair' : 'Create Repair'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RepairsView;
