// src/components/dashboard/GraphCard.jsx
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const GraphCard = ({ title = "Today's Sales Breakdown" }) => {
    // ← FORCE VALUES TO BE NUMBERS
    const data = [
        { name: "Phone Sales", value: 2450, color: "#a67f68" },
        { name: "Accessories", value: 980, color: "#d4a574" },
        { name: "Repair Service", value: 1650, color: "#8b5a3c" },
        { name: "Others", value: 420, color: "#f7eedb" },
    ].map(item => ({ ...item, value: Number(item.value) })); // ← THIS LINE FIXES IT

    const total = data.reduce((sum, item) => sum + item.value, 0);

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0];
            return (
                <div className="bg-white p-4 rounded-xl shadow-2xl border border-gray-200">
                    <p className="font-bold text-gray-800">{data.name}</p>
                    <p className="text-lg font-bold text-[#a67f68]">
                        RM {data.value.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">
                        {((data.value / total) * 100).toFixed(1)}%
                    </p>
                </div>
            );
        }
        return null;
    };

    const renderCustomizedLabel = ({ percent }) => {
        return percent > 0.1 ? `${(percent * 100).toFixed(0)}%` : "";
    };

    return (
        <div className="bg-[var(--mt-card)] rounded-3xl shadow-xl border border-[var(--mt-border-dark)] p-6 hover:shadow-2xl transition-all duration-300">
            <h3 className="text-xl font-bold text-[var(--mt-text-dark)] mb-6 text-center">
                {title}
            </h3>

            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={100}
                        innerRadius={60}
                        fill="#8884d8"
                        dataKey="value"
                        stroke="none"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        verticalAlign="bottom"
                        height={40}
                        formatter={(value, entry) => (
                            <span className="text-[var(--mt-text-dark)] font-medium">
                {value} — RM {Number(entry.value).toFixed(0)}
              </span>
                        )}
                    />
                </PieChart>
            </ResponsiveContainer>

            <div className="mt-6 text-center">
                <p className="text-sm text-[var(--mt-text-light)]">Total Sales Today</p>
                <p className="text-3xl font-bold text-[var(--mt-accent)]">
                    RM {total.toFixed(2)}
                </p>
            </div>
        </div>
    );
};

export default GraphCard;