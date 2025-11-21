import React, { useEffect, useState } from "react";
import {
    DollarSign,
    TrendingUp,
    ShoppingCart,
    AlertTriangle,
    Package,
    Truck,
    ClipboardList,
    Wrench,
    Users,
    BarChart3,
} from "lucide-react";
import Header from "../components/common/Header";
import GraphCard from "../components/dashboard/GraphCard";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        todaySales: 0,
        todayProfit: 0,
        todayOrders: 0,
        lowStock: 0,
    });

    useEffect(() => {
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
        { name: "POS", icon: <ShoppingCart className="w-8 h-8" />, path: "/pos", color: "text-green-600" },
        { name: "Inventory", icon: <Package className="w-8 h-8" />, path: "/inventory", color: "text-blue-600" },
        { name: "Suppliers", icon: <Truck className="w-8 h-8" />, path: "/supplier", color: "text-purple-600" },
        { name: "Purchases", icon: <ClipboardList className="w-8 h-8" />, path: "/purchase", color: "text-orange-600" },
        { name: "Reports", icon: <BarChart3 className="w-8 h-8" />, path: "/reports", color: "text-indigo-600" },
        { name: "Repairs", icon: <Wrench className="w-8 h-8" />, path: "/repair", color: "text-amber-600" },
        { name: "Workers", icon: <Users className="w-8 h-8" />, path: "/worker", color: "text-pink-600" },
    ];

    return (
        <div className="min-h-screen bg-[var(--mt-bg)]">
            <Header />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
                {/* Welcome */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-[var(--mt-text-dark)] mb-2">
                        Welcome back! 👋
                    </h1>
                    <p className="text-lg text-[var(--mt-text-light)]">
                        {new Date().toLocaleDateString("en-MY", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </p>
                </div>

                {/* Main Layout - Left: Quick Access | Right: KPI + Graph */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* LEFT: Quick Access (1 column) */}
                    <div className="lg:col-span-1">
                        <h2 className="text-2xl font-bold text-[var(--mt-text-dark)] mb-6">
                            Quick Access
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                            {quickLinks.map((link) => (
                                <button
                                    key={link.name}
                                    onClick={() => navigate(link.path)}
                                    className="group flex flex-col items-center justify-center p-6 rounded-2xl bg-[var(--mt-card)] border border-[var(--mt-border-dark)] hover:bg-[var(--mt-surface-light)] hover:shadow-xl hover:border-[var(--mt-accent)] transition-all duration-300"
                                >
                                    <div className={`mb-4 p-4 rounded-full bg-white shadow group-hover:shadow-lg group-hover:scale-110 transition-all ${link.color}`}>
                                        {link.icon}
                                    </div>
                                    <span className="font-bold text-lg text-[var(--mt-text-dark)]">
                    {link.name}
                  </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT: KPI + Graph (3 columns) */}
                    <div className="lg:col-span-3 space-y-8">
                        {/* KPI Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <KPIBox title="Today's Sales" value={`RM ${Number(stats.todaySales || 0).toFixed(2)}`} icon={<DollarSign className="w-8 h-8 text-green-600" />} />
                            <KPIBox title="Today's Profit" value={`RM ${Number(stats.todayProfit || 0).toFixed(2)}`} icon={<TrendingUp className="w-8 h-8 text-emerald-600" />} />
                            <KPIBox title="Orders Today" value={stats.todayOrders || 0} icon={<ShoppingCart className="w-8 h-8 text-blue-600" />} />
                            <KPIBox title="Low Stock" value={stats.lowStock || 0} icon={<AlertTriangle className="w-8 h-8 text-red-600" />} warning={stats.lowStock > 0} />
                        </div>

                        {/* Sales Graph */}
                        <div>
                            <GraphCard title="Today's Sales Breakdown" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// KPI Card
const KPIBox = ({ title, value, icon, warning = false }) => (
    <div className={`rounded-3xl p-6 shadow-lg border border-[var(--mt-border-dark)] transition-all hover:shadow-2xl ${warning ? "bg-red-50" : "bg-[var(--mt-card)]"}`}>
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-[var(--mt-text-light)]">{title}</h3>
            <div className={warning ? "text-red-600" : "text-[var(--mt-accent)]"}>{icon}</div>
        </div>
        <p className="text-4xl font-bold text-[var(--mt-text-dark)]">{value}</p>
    </div>
);