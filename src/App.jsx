import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import POSPage from './pages/POS';

const AppRoutes = () => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    // Load auth state from localStorage on app start
    useEffect(() => {
        const auth = localStorage.getItem('isAuthenticated');
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (auth === 'true' && storedUser) {
            setIsAuthenticated(true);
            setUser(storedUser);
        }
    }, []);

    // Redirect to /pos if authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/pos', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const handleLogin = (userData, token) => {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify(userData));
        if (token) localStorage.setItem('token', token);
        setIsAuthenticated(true);
        setUser(userData);
    };

    const handleLogout = () => {
        localStorage.clear();
        setIsAuthenticated(false);
        setUser(null);
        navigate('/login', { replace: true });
    };

    return (
        <Routes>
            <Route
                path="/login"
                element={
                    isAuthenticated ? <Navigate to="/pos" replace /> : <Login onLogin={handleLogin} />
                }
            />
            <Route
                path="/pos"
                element={
                    isAuthenticated ? <POSPage user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />
                }
            />
            <Route path="*" element={<Navigate to={isAuthenticated ? '/pos' : '/login'} replace />} />
        </Routes>
    );
};

const App = () => {
    return (
        <Router>
            <AppRoutes />
        </Router>
    );
};

export default App;
