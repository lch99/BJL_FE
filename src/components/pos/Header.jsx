// src/components/POS/Header.jsx
import React from 'react';
import { Phone, DollarSign, TrendingUp } from 'lucide-react';

const Header = ({ todaySales = 0, todayProfit = 0 }) => {
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

                {/* ==== Today’s Stats Section ==== */}
                <div className="flex items-center gap-5 bg-white/15 rounded-2xl px-5 py-3 sm:px-6 sm:py-4 backdrop-blur-sm border border-white/20 shadow-md">
                    <div className="flex items-center gap-2">
                        <div className="bg-green-500/20 p-2 rounded-lg">
                            <DollarSign className="w-5 h-5 text-green-200" />
                        </div>
                        <div>
                            <p className="text-xs sm:text-sm text-yellow-100">Today's Sales</p>
                            <p className="text-lg sm:text-2xl font-bold">
                                ${todaySales.toFixed(2)}
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
                                ${todayProfit.toFixed(2)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Decorative underline */}
            <div className="h-1 bg-gradient-to-r from-yellow-300 via-orange-400 to-amber-600 opacity-80" />
        </header>
    );
};

export default Header;
