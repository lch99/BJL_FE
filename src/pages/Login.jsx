// src/components/Auth/Login.jsx
import React, { useState } from 'react';
import { Phone, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!username || !password) {
            setError('Please enter both username and password');
            return;
        }

        setLoading(true);

        try {
            // TODO: Replace with your API call
            // const response = await fetch('YOUR_API_URL/auth/login', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify({ username, password })
            // });
            // const data = await response.json();

            // Simulate API call (Remove this in production)
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Demo credentials (Remove this in production)
            if (username === 'admin' && password === 'admin123') {
                // Store token or user data
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('username', username);

                // Call parent component's login handler
                onLogin({ username, role: 'admin' });
            } else {
                setError('Invalid username or password');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 flex items-center justify-center p-4">
            {/* Background Pattern */}
            <div className="absolute inset-0 overflow-hidden opacity-10">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-white rounded-full"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white rounded-full"></div>
            </div>

            {/* Login Card */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-10 text-center">
                    <div className="bg-white bg-opacity-20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                        <Phone className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Phone Shop POS</h1>
                    <p className="text-blue-100 text-sm">Sign in to access your dashboard</p>
                </div>

                {/* Form Section */}
                <div className="px-8 py-8">
                    {error && (
                        <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-lg p-4 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-red-800">{error}</p>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Username Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Username
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="block w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                                    placeholder="Enter your username"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                                    placeholder="Enter your password"
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    disabled={loading}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <span className="ml-2 text-sm text-gray-600">Remember me</span>
                            </label>
                            <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                                Forgot password?
                            </a>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 shadow-lg"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Signing in...
                </span>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    {/* Demo Credentials Info */}
                    <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                        <p className="text-xs font-semibold text-blue-800 mb-2">Demo Credentials:</p>
                        <p className="text-xs text-blue-700">Username: <span className="font-mono font-bold">admin</span></p>
                        <p className="text-xs text-blue-700">Password: <span className="font-mono font-bold">admin123</span></p>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-4 bg-gray-50 border-t">
                    <p className="text-center text-xs text-gray-500">
                        © 2025 Phone Shop POS. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;