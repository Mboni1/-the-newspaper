import React, { useEffect, useState } from "react";
import DashboardLayout from "../Components/DashboardLayout";

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

const Dashboard: React.FC = () => {
  const [role, setRole] = useState(localStorage.getItem("role") || "moderator");

  // Update role automatically when storage changes
  useEffect(() => {
    const handleStorageChange = () => {
      setRole(localStorage.getItem("role") || "moderator");
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // If moderator → remove "Total Users"
  const statsToShow =
    role === "admin"
      ? allStats
      : allStats.filter((stat) => stat !== "Total Users");

  return (
    <DashboardLayout>
      <div className="p-6">
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
    </DashboardLayout>
  );
};

export default Dashboard;
