// src/components/POS/Header.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Phone, DollarSign, TrendingUp, User, Users, LogOut } from 'lucide-react';

const Header = ({ user, todaySales = 0, todayProfit = 0, onLogout, onUserManage }) => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="sticky top-0 z-50 bg-gradient-to-br from-amber-500 via-orange-500 to-yellow-400 text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-4">

                {/* ==== Brand Section ==== */}
                <div className="flex items-center gap-4">
                    <div className="bg-white/25 p-3 rounded-2xl shadow-inner backdrop-blur-sm border border-white/20">
                        <Phone className="w-8 h-8 text-white drop-shadow-md" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight drop-shadow-sm">
                            BenJoLee POS
                        </h1>
                        <p className="text-amber-50 text-sm sm:text-base font-medium opacity-90">
                            Professional Phone Reseller & Repair System
                        </p>
                    </div>
                </div>

                {/* ==== Right Section ==== */}
                <div className="flex items-center gap-5">

                    {/* ==== Today’s Stats ==== */}
                    <div className="flex items-center gap-5 bg-white/15 rounded-2xl px-5 py-3 sm:px-6 sm:py-4 backdrop-blur-sm border border-white/20 shadow-md">
                        <div className="flex items-center gap-2">
                            <div className="bg-green-500/20 p-2 rounded-lg">
                                <DollarSign className="w-5 h-5 text-green-200" />
                            </div>
                            <div>
                                <p className="text-xs sm:text-sm text-yellow-100">Today's Sales</p>
                                <p className="text-lg sm:text-2xl font-bold">
                                    RM {Number(todaySales || 0).toFixed(2)}
                                </p>
                            </div>
                        </div>
                        <div className="h-8 w-px bg-white/30 hidden sm:block" />
                        <div className="flex items-center gap-2">
                            <div className="bg-lime-500/20 p-2 rounded-lg">
                                <TrendingUp className="w-5 h-5 text-lime-200" />
                            </div>
                            <div>
                                <p className="text-xs sm:text-sm text-yellow-100">Profit</p>
                                <p className="text-lg sm:text-2xl font-bold">
                                    RM{todayProfit.toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ==== User Dropdown ==== */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setOpen(!open)}
                            className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-xl hover:bg-white/30 transition-all font-semibold"
                        >
                            <User className="w-5 h-5 text-white drop-shadow" />
                            <span>{user?.username || 'User'}</span>
                        </button>

                        {open && (
                            <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-xl shadow-lg border border-amber-100 overflow-hidden z-50">
                                {/* Profile */}
                                <button
                                    onClick={() => setOpen(false)}
                                    className="w-full flex items-center gap-2 px-4 py-2 hover:bg-amber-50 text-left"
                                >
                                    <User className="w-4 h-4 text-amber-600" /> My Profile
                                </button>

                                {/* Only show for admin/manager */}
                                {['admin', 'manager'].includes(user?.role?.toLowerCase()) && (
                                    <button
                                        onClick={() => {
                                            setOpen(false);
                                            onUserManage && onUserManage();
                                        }}
                                        className="w-full flex items-center gap-2 px-4 py-2 hover:bg-amber-50 text-left"
                                    >
                                        <Users className="w-4 h-4 text-amber-600" /> User Management
                                    </button>
                                )}

                                {/* Logout */}
                                <button
                                    onClick={onLogout}
                                    className="w-full flex items-center gap-2 px-4 py-2 hover:bg-red-50 text-left text-red-600"
                                >
                                    <LogOut className="w-4 h-4" /> Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Decorative underline */}
            <div className="h-1 bg-gradient-to-r from-yellow-300 via-orange-400 to-amber-600 opacity-80" />
        </header>
    );
};

export default Header;
