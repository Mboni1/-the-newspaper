import React from "react";
import StatCard from "./Components/StatCard";
import UserStatistics from "./Components/UserStatistics";
import UserLocation from "./Components/UserLocation";
import { FiUsers, FiLayers, FiFileText, FiBriefcase } from "react-icons/fi";

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Search..."
          className="px-4 py-2 rounded-lg border border-gray-300 w-64"
        />
        <div className="flex items-center gap-4">
          <button className="relative">
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            🔔
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-300"></div>
            <span className="font-medium">Admin</span>
          </div>
        </div>
      </header>

      {/* Dashboard Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-500">
          Welcome back! Here's what's happening with your platform today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={<FiUsers />} value={352} label="Total users" />
        <StatCard icon={<FiLayers />} value={9} label="Categories" />
        <StatCard icon={<FiFileText />} value={45} label="Documents" />
        <StatCard icon={<FiBriefcase />} value={45} label="Business" />
      </div>

      {/* Analytics */}
      <h2 className="text-xl font-bold mb-4">Analytics</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UserStatistics />
        <UserLocation />
      </div>
    </div>
  );
};

export default App;
