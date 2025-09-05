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

  const chartData: Record<
    "D" | "W" | "M" | "Y",
    { labels: string[]; data: number[] }
  > = {
    D: {
      labels: ["0:00", "04:00", "08:00", "12:00", "16:00", "20:00"],
      data: [45, 30, 78, 95, 70, 55],
    },
    W: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      data: [160, 240, 200, 220, 280, 210, 150],
    },
    M: {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      data: [1250, 1400, 1350, 1700],
    },
    Y: {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      data: [
        3000, 2800, 3200, 4000, 3500, 4200, 5000, 4800, 4500, 4700, 5200, 6000,
      ],
    },
  };

  const userStatsData = {
    labels: chartData[timeRange].labels,
    datasets: [
      {
        label: "User Activities",
        data: chartData[timeRange].data,
        backgroundColor: "#3B82F6",
        borderRadius: 12,
        barThickness: 38,
      },
    ],
  };

  return (
    <div className="bg-white shadow rounded-lg p-4 py-8 px-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <div>
          <h2 className="text-lg font-semibold py-1.5">User statistics</h2>
          <p className="text-gray-500 text-sm">User activities overview</p>
        </div>

        {/* Timerange buttons */}
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

      {/* Chart */}
      <div className="h-74">
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
