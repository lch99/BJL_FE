import React, { useEffect } from "react";
import ReactDOM from "react-dom";

const FeedbackDialog = ({ open, type, message, onClose, autoClose = false }) => {
    useEffect(() => {
        if (autoClose && open) {
            const timer = setTimeout(onClose, 3000); // auto close after 3s
            return () => clearTimeout(timer);
        }
    }, [open, autoClose, onClose]);

    if (!open) return null;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/30" onClick={onClose}></div>
            <div className={`bg-white p-4 rounded-lg shadow-lg z-50 max-w-xs w-full`}>
                <div className={`font-bold ${type === "success" ? "text-green-600" : "text-red-600"}`}>
                    {type === "success" ? "Success" : "Error"}
                </div>
                <div className="mt-2 text-gray-800">{message}</div>
            </div>
        </div>,
        document.body
    );
};

export default FeedbackDialog;
