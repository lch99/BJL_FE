import React, { useState, useMemo } from "react";
import DataTable from "../common/DataTable/DataTable";
import { Pencil, Trash } from "lucide-react";

export default function InventoryTable({ type, items, onEdit, onDelete }) {
    const [search, setSearch] = useState("");
    const [sortKey, setSortKey] = useState("id");
    const [sortOrder, setSortOrder] = useState("asc");
    const [page, setPage] = useState(1);

    const totalPages = 1; // your API handles real pagination later

    // 🔍 FILTER
    const filtered = useMemo(() => {
        if (!search) return items;

        return items.filter((i) =>
            JSON.stringify(i).toLowerCase().includes(search.toLowerCase())
        );
    }, [items, search]);

    // 🔽 SORT
    const sorted = useMemo(() => {
        return [...filtered].sort((a, b) => {
            const x = a[sortKey];
            const y = b[sortKey];

            if (x < y) return sortOrder === "asc" ? -1 : 1;
            if (x > y) return sortOrder === "asc" ? 1 : -1;
            return 0;
        });
    }, [filtered, sortKey, sortOrder]);

    // 🧱 DEFINE COLUMNS FOR PHONES OR ACCESSORIES
    const columns = useMemo(() => {
        if (type === "phones") {
            return [
                { key: "id", label: "ID", sortable: true },
                { key: "model", label: "Model", sortable: true },
                {
                    key: "variants",
                    label: "Variants",
                    sortable: false,
                    render: (row) => row.variants?.length || 0
                }
            ];
        }

        // accessories
        return [
            { key: "id", label: "ID", sortable: true },
            { key: "name", label: "Name", sortable: true },
            { key: "brand", label: "Brand", sortable: true },
            { key: "sku", label: "SKU", sortable: true },
            { key: "quantity", label: "Stock", sortable: true }
        ];
    }, [type]);

    // 🔧 HANDLE SORT CLICK
    const handleSort = (key) => {
        if (!columns.find((c) => c.key === key)?.sortable) return;

        if (sortKey === key) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortKey(key);
            setSortOrder("asc");
        }
    };

    return (
        <DataTable
            columns={columns}
            data={sorted}

            enableSearch={true}
            search={search}
            onSearch={setSearch}

            sortKey={sortKey}
            sortOrder={sortOrder}
            onSort={handleSort}

            page={page}
            totalPages={totalPages}
            onPageChange={setPage}

            actions={(row) => (
                <div className="flex justify-center gap-2">
                    <button onClick={() => onEdit(row)} className="text-blue-600">
                        <Pencil size={18} />
                    </button>
                    <button onClick={() => onDelete(row)} className="text-red-600">
                        <Trash size={18} />
                    </button>
                </div>
            )}
        />
    );
}
