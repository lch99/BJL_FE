// src/components/dashboard/POSBlock.jsx
import React from "react";
import POSView from "../pos/PosView";

const POSBlock = (props) => {
    return (
        <div className="bg-white rounded-2xl shadow-lg p-4 col-span-1 md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Point of Sale</h2>
            {/* Use your existing POSView UI */}
            <POSView {...props} />
        </div>
    );
};

export default POSBlock;
