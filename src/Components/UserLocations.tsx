import React, { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

// Data types
interface ChartData {
  name: string;
  value: number;
}

const COLORS = ["#2563eb", "#3b82f6", "#60a5fa", "#93c5fd", "#dbeafe"];

// Example datasets
const datasets: Record<string, ChartData[]> = {
  Countries: [
    { name: "United States", value: 35 },
    { name: "Canada", value: 25 },
    { name: "United Kingdom", value: 18 },
    { name: "Germany", value: 12 },
    { name: "Others", value: 8 },
  ],
  Categories: [
    { name: "Accommodation", value: 25 },
    { name: "Food & Dining", value: 15 },
    { name: "Transportation", value: 38 },
    { name: "Tours & Events", value: 12 },
    { name: "Others", value: 8 },
  ],
  Businesses: [
    { name: "Hotels & Lodges", value: 28 },
    { name: "Restaurant", value: 22 },
    { name: "Tour Operators", value: 20 },
    { name: "Transport Service", value: 15 },
    { name: "Others", value: 15 },
  ],
};

const UserLocation: React.FC = () => {
  const [selected, setSelected] = useState<keyof typeof datasets>("Countries");

  const data = datasets[selected];

  return (
    <div className="bg-white shadow rounded-lg p-4 py-8 px-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <div>
          <p className="text-lg font-semibold py-1.5">
            Geographic Distribution of Users
          </p>
          <h2 className="text-gray-500 text-sm">{selected} distribution</h2>
        </div>

        {/* Dropdown */}
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value as keyof typeof datasets)}
          className="border px-3 py-1 rounded-lg text-sm text-gray-600 cursor-pointer"
        >
          <option value="Countries">Countries</option>
          <option value="Categories">Categories</option>
          <option value="Businesses">Businesses</option>
        </select>
      </div>

      {/* Chart + Legend */}
      <div className="flex flex-col sm:flex-row items-center px-10 pt-10 gap-10">
        {/* Donut Chart */}
        <ResponsiveContainer width={200} height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>

        {/* Legend */}
        <ul className="space-y-2">
          {data.map((entry, index) => (
            <li key={index} className="flex justify-between gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span
                  className="inline-block w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></span>
                <span>{entry.name}</span>
              </div>
              <span className="font-medium">{entry.value}%</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserLocation;
