// src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './pages/Login';
import POS from './pages/POS';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check if user is already logged in (on page load)
    useEffect(() => {
        const checkAuth = () => {
            const authStatus = localStorage.getItem('isAuthenticated');
            const savedUser = localStorage.getItem('username');

            if (authStatus === 'true' && savedUser) {
                setIsAuthenticated(true);
                setUser({ username: savedUser });
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    // Handle login
    const handleLogin = (userData) => {
        setIsAuthenticated(true);
        setUser(userData);
    };

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('username');
        setIsAuthenticated(false);
        setUser(null);
    };

    // Show loading spinner while checking authentication
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="App">
            {isAuthenticated ? (
                <POS user={user} onLogout={handleLogout} />
            ) : (
                <Login onLogin={handleLogin} />
            )}
        </div>
    );
}

export default App;