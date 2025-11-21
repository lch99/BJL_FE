// src/components/dashboard/POSBlock.jsx
import React from "react";
import POSView from "../pos/PosView";

const POSBlock = (props) => {
    return (
        <div className="mt-card col-span-1 md:col-span-2">
            <h2 className="text-xl mt-title mb-4">Point of Sale</h2>

            <div className="mt-panel">
                <POSView {...props} />
            </div>
        </div>
    );
};

export default POSBlock;
