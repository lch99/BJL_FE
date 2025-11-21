import React, { useState, useRef, useEffect } from 'react';
import { Phone, User, ArrowLeft, Home } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = ({ user, todaySales = 0, todayProfit = 0, onLogout, onUserManage }) => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        // Safe cleanup - no error in StrictMode
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []); // dependencies empty = fine

    const handleBack = () => navigate(-1);
    const handleHome = () => navigate('/dashboard'); // <- update with your dashboard route

    // Only show back/home buttons if NOT on dashboard
    const dashboardPaths = ['/dashboard', '/']; // add all dashboard paths here
    const showNavButtons = !dashboardPaths.includes(location.pathname.replace(/\/$/, ''));

    return (
        <header className="fixed top-0 left-0 w-full z-50 h-24 flex items-center backdrop-blur-md bg-white/30 shadow-lg px-6">
            <div className="max-w-7xl mx-auto flex items-center justify-between w-full">

                {/* Left Section: Back/Home + Brand */}
                <div className="flex items-center gap-4">
                    {showNavButtons && (
                        <div className="flex gap-2">
                            <button
                                onClick={handleBack}
                                className="p-2 rounded hover:bg-theme-surface/70 transition"
                                title="Back"
                            >
                                <ArrowLeft size={20} className="text-theme-text" />
                            </button>
                        </div>
                    )}
                    <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/dashboard')}>
                        <Phone className="w-8 h-8 text-theme-accent drop-shadow-md" />
                        <div>
                            <h1 className="text-2xl font-extrabold text-theme-text drop-shadow-sm">BenJoLee POS</h1>
                            <p className="text-sm text-theme-text-light/90">Phone Reseller & Repair System</p>
                        </div>
                    </div>
                </div>

                {/* Right Section: Stats + User */}
                <div className="flex items-center gap-6">

                    {/* Today Stats */}
                    <div className="flex items-center gap-4 bg-theme-card/80 px-4 py-2 rounded-xl shadow backdrop-blur-sm border border-theme-border">
                        <div>
                            <p className="text-xs text-theme-text-light">Today's Sales</p>
                            <p className="font-bold text-theme-text">RM {todaySales.toFixed(2)}</p>
                        </div>
                        <div className="border-l border-theme-border h-6" />
                        <div>
                            <p className="text-xs text-theme-text-light">Profit</p>
                            <p className="font-bold text-theme-text">RM {todayProfit.toFixed(2)}</p>
                        </div>
                    </div>

                    {/* User Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setOpen(!open)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-theme-card/80 hover:bg-theme-surface/90 shadow backdrop-blur-sm"
                        >
                            <User className="w-5 h-5 text-theme-text" />
                            <span className="font-medium text-theme-text">{user?.username || 'User'}</span>
                        </button>

                        {open && (
                            <div className="absolute right-0 mt-2 w-44 bg-theme-card border border-theme-border rounded-lg shadow-lg overflow-hidden z-50">
                                <button className="w-full px-4 py-2 hover:bg-theme-surface text-left text-theme-text" onClick={() => setOpen(false)}>
                                    My Profile
                                </button>
                                {['admin', 'manager'].includes(user?.role?.toLowerCase()) && (
                                    <button
                                        onClick={() => { setOpen(false); onUserManage && onUserManage(); }}
                                        className="w-full px-4 py-2 hover:bg-theme-surface text-left text-theme-text"
                                    >
                                        User Management
                                    </button>
                                )}
                                <button
                                    onClick={onLogout}
                                    className="w-full px-4 py-2 hover:bg-red-50 text-left text-red-600"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </header>
    );
};

export default Header;
