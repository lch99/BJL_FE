// src/components/dashboard/GraphCard.jsx
import React from "react";

const GraphCard = ({ title }) => {
    return (
        <div className="bg-white rounded-2xl shadow-lg p-4 flex items-center justify-center h-40">
            <span className="text-gray-400 font-semibold">{title} (Coming Soon)</span>
        </div>
    );
};

export default GraphCard;
