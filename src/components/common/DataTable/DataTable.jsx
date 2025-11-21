import React from "react";
import { Search } from "lucide-react";

export default function DataTable({
                                      columns = [],
                                      data = [],
                                      loading = false,

                                      enableSearch = true,
                                      search = "",
                                      onSearch = () => {},

                                      sortKey,
                                      sortOrder,
                                      onSort = () => {},

                                      page = 1,
                                      totalPages = 1,
                                      onPageChange = () => {},

                                      actions = null,
                                      renderCell // NEW: function(row, column) => JSX
                                  }) {
    return (
        <div className="w-full flex flex-col gap-3">

            {/* SEARCH */}
            {enableSearch && (
                <div className="flex items-center bg-[var(--mt-surface-light)] px-3 py-2 rounded-lg shadow-inner w-full max-w-xs">
                    <Search size={18} className="text-[var(--mt-text-light)]" />
                    <input
                        className="ml-2 bg-transparent outline-none text-[var(--mt-text)] w-full"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => onSearch(e.target.value)}
                    />
                </div>
            )}

            {/* TABLE */}
            <div className="overflow-x-auto rounded-xl shadow bg-white">
                <table className="min-w-full border-collapse">
                    <thead className="bg-[var(--mt-surface-light)]">
                    <tr>
                        {columns.map((col) => (
                            <th
                                key={col.key}
                                style={{ width: col.width || "auto" }}
                                className={`px-4 py-3 text-center font-semibold cursor-pointer ${
                                    col.sortable ? "hover:text-[var(--mt-accent)]" : ""
                                }`}
                                onClick={() => col.sortable && onSort(col.key)}
                            >
                                {col.label}
                                {sortKey === col.key && (
                                    <span className="ml-1">
                                            {sortOrder === "asc" ? "▲" : "▼"}
                                        </span>
                                )}
                            </th>
                        ))}

                        {actions && <th className="px-4 py-3 text-center font-semibold">Actions</th>}
                    </tr>
                    </thead>

                    <tbody>
                    {loading ? (
                        <tr>
                            <td
                                colSpan={columns.length + (actions ? 1 : 0)}
                                className="p-5 text-center text-gray-500"
                            >
                                Loading...
                            </td>
                        </tr>
                    ) : data.length === 0 ? (
                        <tr>
                            <td
                                colSpan={columns.length + (actions ? 1 : 0)}
                                className="p-5 text-center text-gray-500"
                            >
                                No records found
                            </td>
                        </tr>
                    ) : (
                        data.map((row, index) => (
                            <tr
                                key={index}
                                className="border-t hover:bg-[var(--mt-surface)] transition"
                            >
                                {columns.map((col) => (
                                    <td key={col.key} className="px-4 py-3 text-center">
                                        {renderCell ? renderCell(row, col) : row[col.key]}
                                    </td>
                                ))}
                                {actions && (
                                    <td className="px-4 py-3 text-center">{actions(row)}</td>
                                )}
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            {/* PAGINATION */}
            <div className="flex justify-center items-center gap-3 mt-2">
                <button
                    onClick={() => page > 1 && onPageChange(page - 1)}
                    disabled={page === 1}
                    className="px-4 py-1 rounded-lg border bg-[var(--mt-surface-light)] disabled:opacity-40"
                >
                    Prev
                </button>

                <span className="font-medium text-[var(--mt-text)]">
                    Page {page} / {totalPages}
                </span>

                <button
                    onClick={() => page < totalPages && onPageChange(page + 1)}
                    disabled={page === totalPages}
                    className="px-4 py-1 rounded-lg border bg-[var(--mt-surface-light)] disabled:opacity-40"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
