import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const UserStatistics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<"D" | "W" | "M" | "Y">("W");

  const userStatsData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "User Activities",
        data: [160, 240, 200, 220, 280, 210, 150],
        backgroundColor: "#3B82F6",
        borderRadius: 12,
        barThickness: 38,
      },
    ],
  };

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <div className="flex justify-between items-center mb-3">
        <div>
          <h2 className="text-sm font-semibold">User statistics</h2>
          <p className="text-gray-500 text-xs">User activities overview</p>
        </div>
        <div className="space-x-1">
          {["D", "W", "M", "Y"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range as "D" | "W" | "M" | "Y")}
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                timeRange === range
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>
      <div className="h-64">
        <Bar
          data={userStatsData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: {
                ticks: { font: { size: 12 } },
                grid: { display: false },
                border: { display: false },
              },
              y: {
                ticks: { font: { size: 12 } },
                grid: { display: false },
                border: { display: false },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default UserStatistics;
