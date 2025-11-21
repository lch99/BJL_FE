// src/components/common/DataTable/DataTableSearch.jsx
import React from "react";

const DataTableSearch = ({ search, onSearch }) => {
    return (
        <input
            type="text"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search..."
            className="px-3 py-1 rounded border border-[var(--mt-border)] shadow-sm focus:outline-none focus:ring-1 focus:ring-[var(--mt-accent)]"
        />
    );
};

export default DataTableSearch;
