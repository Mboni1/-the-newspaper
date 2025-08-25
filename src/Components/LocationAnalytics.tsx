import React, { useState } from "react";
import { Globe, MapPin, TrendingUp, Users } from "lucide-react";
import { Link } from "react-router-dom";

type ViewMode = "grid" | "chart";

const LocationAnalyticsPage: React.FC = () => {
  const [view, setView] = useState<ViewMode>("grid");

  const stats = [
    {
      icon: <Globe className="w-6 h-6 text-white" />,
      bg: "bg-blue-500",
      value: "10,178",
      label: "Total Visitors",
    },
    {
      icon: <MapPin className="w-6 h-6 text-white" />,
      bg: "bg-green-500",
      value: "8",
      label: "Countries",
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-white" />,
      bg: "bg-orange-500",
      value: "+8.8%",
      label: "Avg Growth",
    },
    {
      icon: <Users className="w-6 h-6 text-white" />,
      bg: "bg-purple-500",
      value: "3",
      label: "High Traffic",
    },
  ];

  return (
    <div className="p-6 pt-30 bg-gray-50 min-h-screen">
      {/* Back to dashboard */}
      <Link
        to="/dashboard"
        className="text-blue-600 hover:underline inline-block mb-4"
      >
        ← Back to Dashboard
      </Link>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Location Analytics of Visitors
          </h1>
          <p className="text-gray-500 text-sm">
            Track which countries your visitors are coming from to Rwanda
          </p>
        </div>

        {/* Toggle buttons */}
        <div className="flex items-center rounded-full border bg-white p-1 shadow-sm">
          <button
            className={`px-4 py-1.5 rounded-full text-sm font-medium ${
              view === "grid"
                ? "bg-gray-900 text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
            onClick={() => setView("grid")}
          >
            Grid View
          </button>
          <button
            className={`px-4 py-1.5 rounded-full text-sm font-medium ${
              view === "chart"
                ? "bg-gray-900 text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
            onClick={() => setView("chart")}
          >
            Chart View
          </button>
        </div>
      </div>

      {/* Stats section */}
      {view === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4"
            >
              <div
                className={`${stat.bg} w-10 h-10 rounded-lg flex items-center justify-center`}
              >
                {stat.icon}
              </div>
              <div>
                <p className="text-lg font-bold text-gray-800">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-6">
          {/* Placeholder for chart */}
          <p className="text-center text-gray-500">[ Chart will go here ]</p>
        </div>
      )}
    </div>
  );
};

export default LocationAnalyticsPage;
