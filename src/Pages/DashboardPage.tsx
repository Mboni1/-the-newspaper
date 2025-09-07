import React from "react";

const allStats = [
  "Total Users",
  "Categories",
  "Documents",
  "Business",
  "Reviews",
  "Location",
  "Articles",
  "Visitors Analytics",
  "Notifications",
];

const moderatorStats = [
  "Total Users",
  "Categories",
  "Documents",
  "Business",
  "Reviews",
  "Location",
];

const Dashboard: React.FC = () => {
  const role = localStorage.getItem("role") || "moderator"; // default moderator

  const statsToShow = role === "admin" ? allStats : moderatorStats;

  return (
    <div className="p-6 pt-20 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <p className="text-gray-600 mb-4">Role: {role}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {statsToShow.map((stat) => (
          <div
            key={stat}
            className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition"
          >
            <p className="text-gray-700 font-medium">{stat}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
