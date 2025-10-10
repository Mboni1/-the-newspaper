import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import api from "../lib/axios";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface AnalyticsData {
  label: string;
  count: number;
}

const UserStatistics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<"D" | "W" | "M" | "Y">("W");
  const [chartLabels, setChartLabels] = useState<string[]>([]);
  const [chartCounts, setChartCounts] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Default labels per range
  const defaultLabels: Record<"D" | "W" | "M" | "Y", string[]> = {
    D: ["0:00", "04:00", "08:00", "12:00", "16:00", "20:00"],
    W: ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"],
    M: ["Week 1", "Week 2", "Week 3", "Week 4"],
    Y: [
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
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await api.get("/analytics/user", {
          params: { range: timeRange },
        });

        // backend igarura data: { data: AnalyticsData[] }
        const data: AnalyticsData[] = res.data?.data ?? [];

        // mapping: labels & counts, fallback 0 if label not found
        const labels = defaultLabels[timeRange];
        const counts = labels.map((label) => {
          const item = data.find((d) => d.label === label);
          return item ? item.count : 0;
        });

        setChartLabels(labels);
        setChartCounts(counts);
      } catch (err: any) {
        console.error("Failed to fetch analytics:", err);
        setError("Failed to load analytics data. Please try again.");
        setChartLabels(defaultLabels[timeRange]);
        setChartCounts(new Array(defaultLabels[timeRange].length).fill(0));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  const userStatsData = {
    labels: chartLabels,
    datasets: [
      {
        label: "User Activities",
        data: chartCounts,
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

      {/* Chart / Loading / Error */}
      <div className="h-74 flex items-center justify-center">
        {loading ? (
          <p className="text-gray-500 text-sm">Loading user statistics...</p>
        ) : error ? (
          <p className="text-red-500 text-sm">{error}</p>
        ) : (
          <Bar
            data={userStatsData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: {
                x: { ticks: { font: { size: 12 } }, grid: { display: false } },
                y: { ticks: { font: { size: 12 } }, grid: { display: false } },
              },
            }}
          />
        )}
      </div>
    </div>
  );
};

export default UserStatistics;
