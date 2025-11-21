import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import "./styles/global.css";
import Login from './pages/Login';
import DashboardPage from './pages/DashboardPage';
import POS from './pages/POS';
import InventoryView from "./pages/InventoryView";
import { usePOS } from './hooks/usePOS';
import { ToastProvider } from './components/common/FeedbackToast';
import RepairsPage from './pages/RepairView';

/**
 * Root wrapper to mount FeedbackToast globally
 * Ensures all toasts appear above any portal/modals
 */
const AppWithToast = () => {
    // Routing and authentication state
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const pos = usePOS(user);

    // Load authentication state from localStorage on mount
    useEffect(() => {
        const auth = localStorage.getItem('isAuthenticated');
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (auth === 'true' && storedUser) {
            setIsAuthenticated(true);
            setUser(storedUser);
        }
    }, []);

    const handleLogin = (userData, token) => {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify(userData));
        if (token) localStorage.setItem('token', token);
        setIsAuthenticated(true);
        setUser(userData);
    };

    return (
        <>
            <Routes>
                <Route
                    path="/login"
                    element={
                        isAuthenticated ? (
                            <Navigate to="/dashboard" replace />
                        ) : (
                            <Login onLogin={handleLogin} />
                        )
                    }
                />
                <Route
                    path="/dashboard"
                    element={
                        isAuthenticated ? (
                            <DashboardPage user={user} pos={pos} />
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />
                <Route
                    path="/pos"
                    element={
                        isAuthenticated ? (
                            <POS user={user} pos={pos} />
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />
                <Route
                    path="/inventory"
                    element={
                        isAuthenticated ? (
                            <InventoryView user={user} pos={pos} />
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />
                <Route
                    path="/repair"
                    element={
                        isAuthenticated ? (
                            <RepairsPage user={user} pos={pos} />
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />
                {/* Add routes for inventory, suppliers, purchase later */}
                <Route
                    path="*"
                    element={
                        <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />
                    }
                />
            </Routes>
        </>
    );
};

/**
 * App entry point with global ToastProvider
 */
const App = () => (
    <Router>
        <ToastProvider>
            <AppWithToast />
        </ToastProvider>
    </Router>
);

export default App;
