import React, { createContext, useContext, useState, useEffect } from "react";
import { CheckCircle2, XCircle, Info } from "lucide-react";

let toastIdCounter = 0;

// Create Toast Context
const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = ({ type = "success", message = "", duration = 3000, saving = false }) => {
        const id = toastIdCounter++;
        setToasts((prev) => [...prev, { id, type, message, duration, saving }]);
        return id;
    };

    const removeToast = (id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast, removeToast }}>
            {children}
            <FeedbackToast toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
};

// Hook to use toast anywhere
export const useToast = () => useContext(ToastContext);

// FeedbackToast component
const FeedbackToast = ({ toasts = [], removeToast = () => {} }) => {
    return (
        <div className="fixed top-4 right-4 flex flex-col gap-3 z-[10000]">
            {toasts.map((toast) => (
                <ToastItem key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
            ))}
        </div>
    );
};

const ToastItem = ({ type, message, duration = 3000, saving, onClose }) => {
    const [visible, setVisible] = useState(false);
    const [countdown, setCountdown] = useState(duration / 1000);

    useEffect(() => {
        setVisible(true);
        if (!saving) {
            const interval = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        setVisible(false);
                        setTimeout(onClose, 200);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [duration, saving, onClose]);

    const getIcon = () => {
        if (saving)
            return <div className="loader-border w-5 h-5 border-2 border-amber-500 rounded-full animate-spin" />;
        if (type === "success") return <CheckCircle2 className="w-5 h-5 text-green-500" />;
        if (type === "error") return <XCircle className="w-5 h-5 text-red-500" />;
        return <Info className="w-5 h-5 text-blue-500" />;
    };

    return (
        <div
            className={`flex items-center gap-3 p-3 rounded-xl shadow-lg bg-white border-l-4 border-${
                type === "success" ? "green" : type === "error" ? "red" : "blue"
            }-500 transition-all duration-200 transform ${
                visible ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0"
            }`}
        >
            {getIcon()}
            <div className="flex-1">
                <p className="text-gray-800">{message}</p>
                {!saving && <p className="text-xs text-gray-400 mt-0.5">Closing in {countdown}s</p>}
            </div>
            {!saving && (
                <button
                    onClick={() => {
                        setVisible(false);
                        setTimeout(onClose, 200);
                    }}
                    className="text-gray-400 hover:text-gray-600 transition"
                >
                    ✕
                </button>
            )}
            <style jsx>{`
                .loader-border {
                    border-top-color: transparent;
                    border-right-color: transparent;
                }
            `}</style>
        </div>
    );
};

export default FeedbackToast;
