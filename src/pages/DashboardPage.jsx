import React, { useEffect, useState } from "react";
import {
    DollarSign,
    BarChart3,
    ShoppingCart,
    Package,
    Truck,
    ClipboardList,
    Wrench,
    Users,
    AlertTriangle,
} from "lucide-react";
import Header from "../components/layout/Header"; // ✅ your existing header component
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalSales: 0,
        totalProfit: 0,
        totalOrders: 0,
        lowStock: 0,
    });

    useEffect(() => {
        // Replace with real backend call later
        const fetchData = async () => {
            try {
                const res = await fetch("http://localhost:3000/api/dashboard/summary");
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (err) {
                console.error("Failed to load dashboard data:", err);
            }
        };
        fetchData();
    }, []);

    const quickLinks = [
        { name: "POS", icon: <ShoppingCart className="w-6 h-6" />, path: "/pos" },
        { name: "Inventory", icon: <Package className="w-6 h-6" />, path: "/inventory" },
        { name: "Suppliers", icon: <Truck className="w-6 h-6" />, path: "/suppliers" },
        { name: "Purchases", icon: <ClipboardList className="w-6 h-6" />, path: "/purchases" },
        { name: "Reports", icon: <BarChart3 className="w-6 h-6" />, path: "/reports" },
        { name: "Repairs", icon: <Wrench className="w-6 h-6" />, path: "/repairs" },
        { name: "Workers", icon: <Users className="w-6 h-6" />, path: "/workers" },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
            {/* ✅ Reuse your existing POS Header */}
            <Header />

            <div className="p-6">
                {/* Title */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-amber-700">Dashboard Overview</h1>
                        <p className="text-amber-600">Track your business performance at a glance</p>
                    </div>
                    <div className="mt-3 sm:mt-0 text-sm text-amber-500">
                        {new Date().toLocaleString("en-MY", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                    <KPIBox
                        title="Total Sales"
                        value={`RM ${stats.totalSales.toFixed(2)}`}
                        gradient="from-yellow-400 to-orange-500"
                        icon={<DollarSign className="w-8 h-8 opacity-30" />}
                        subtext="All-time revenue"
                    />
                    <KPIBox
                        title="Total Profit"
                        value={`RM ${stats.totalProfit.toFixed(2)}`}
                        gradient="from-orange-400 to-amber-600"
                        icon={<BarChart3 className="w-8 h-8 opacity-30" />}
                        subtext="Net earnings"
                    />
                    <KPIBox
                        title="Total Orders"
                        value={stats.totalOrders}
                        gradient="from-amber-500 to-orange-600"
                        icon={<ShoppingCart className="w-8 h-8 opacity-30" />}
                        subtext="Completed orders"
                    />
                    <KPIBox
                        title="Low Stock Items"
                        value={stats.lowStock}
                        gradient="from-orange-500 to-yellow-600"
                        icon={<AlertTriangle className="w-8 h-8 opacity-30" />}
                        subtext="Need restock soon"
                    />
                </div>

                {/* Quick Navigation */}
                <div className="mb-10">
                    <h2 className="text-xl font-semibold mb-4 text-amber-700">Quick Access</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                        {quickLinks.map((link, idx) => (
                            <button
                                key={idx}
                                onClick={() => navigate(link.path)}
                                className="flex flex-col items-center justify-center bg-white hover:bg-amber-50
                           border border-amber-200 rounded-2xl shadow-md p-5 transition-all"
                            >
                                <div className="mb-2 text-amber-600">{link.icon}</div>
                                <span className="text-gray-800 font-medium">{link.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Placeholder for Graphs */}
                <div>
                    <h2 className="text-xl font-semibold mb-3 text-amber-700">Performance Insights</h2>
                    <div className="w-full h-64 bg-white rounded-2xl border border-amber-200 shadow-md flex items-center justify-center text-amber-400">
                        <p>📈 Graphs and analytics coming soon</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ====== KPI Card Component ======
const KPIBox = ({ title, value, gradient, icon, subtext }) => (
    <div
        className={`bg-gradient-to-br ${gradient} text-white rounded-2xl shadow-md p-6`}
    >
        <div className="flex items-center justify-between mb-2">
            <p className="text-orange-100 text-sm font-medium">{title}</p>
            {icon}
        </div>
        <p className="text-4xl font-bold mb-1">{value}</p>
        <p className="text-orange-100 text-xs">{subtext}</p>
    </div>
);
