// src/components/common/FeedbackToast.jsx
import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { CheckCircle2, XCircle, Info } from "lucide-react";

let toastIdCounter = 0;

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    const isMountedRef = useRef(true);
    const timersRef = useRef({});

    useEffect(() => {
        return () => {
            isMountedRef.current = false;
            Object.values(timersRef.current).forEach(clearTimeout);
            timersRef.current = {};
        };
    }, []);

    const showToast = ({ type = "success", message = "", duration = 3000 }) => {
        const id = toastIdCounter++;
        const newToast = { id, type, message };

        if (!isMountedRef.current) return;

        setToasts((prev) => [...prev, newToast]);

        const timer = setTimeout(() => {
            if (!isMountedRef.current) return;
            setToasts((prev) => prev.filter((t) => t.id !== id));
            delete timersRef.current[id];
        }, duration);

        timersRef.current[id] = timer;
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <ToastContainer toasts={toasts} />
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);

const ToastContainer = ({ toasts }) => {
    return (
        <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3">
            {toasts.map((toast) => (
                <Toast key={toast.id} type={toast.type} message={toast.message} />
            ))}
        </div>
    );
};

const Toast = ({ type, message }) => {
    const themes = {
        success: {
            bg: "bg-green-50 border-green-600 text-green-800",
            icon: <CheckCircle2 className="w-6 h-6 text-green-600" />,
        },
        error: {
            bg: "bg-red-50 border-red-600 text-red-800",
            icon: <XCircle className="w-6 h-6 text-red-600" />,
        },
        info: {
            bg: "bg-amber-50 border-amber-600 text-amber-800",
            icon: <Info className="w-6 h-6 text-amber-600" />,
        },
    };

    const theme = themes[type] || themes.info;

    return (
        <div
            className={`flex items-center gap-4 px-6 py-4 min-w-80 rounded-2xl shadow-2xl border-2 ${theme.bg} backdrop-blur-sm animate-in slide-in-from-top-4 fade-in duration-300`}
        >
            {theme.icon}
            <div className="flex-1">
                <p className={`font-bold text-lg ${theme.text}`}>{type.charAt(0).toUpperCase() + type.slice(1)}</p>
                <p className={`text-base ${theme.text} opacity-90`}>{message}</p>
            </div>
        </div>
    );
};

export default ToastContainer;