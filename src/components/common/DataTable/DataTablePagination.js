// src/components/common/DataTable/DataTablePagination.jsx
import React from "react";

const DataTablePagination = ({ page, totalPages, onPageChange }) => {
    return (
        <div className="flex items-center gap-3">
            <button
                disabled={page <= 1}
                className="px-3 py-1 rounded border border-[var(--mt-border)] disabled:opacity-40 hover:bg-[var(--mt-surface-light)] transition"
                onClick={() => onPageChange(page - 1)}
            >
                Prev
            </button>
            <span className="font-medium text-[var(--mt-text)]">Page {page} / {totalPages}</span>
            <button
                disabled={page >= totalPages}
                className="px-3 py-1 rounded border border-[var(--mt-border)] disabled:opacity-40 hover:bg-[var(--mt-surface-light)] transition"
                onClick={() => onPageChange(page + 1)}
            >
                Next
            </button>
        </div>
    );
};

export default DataTablePagination;
