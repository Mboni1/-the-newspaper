import React from "react";
import UserStatistics from "./UserStatistics";
import UserLocations from "./UserLocations";

const Analytics: React.FC = () => {
  return (
    <div className="p-1 mb-6 space-y-4 py-8 px-8">
      <h1 className="text-lg font-bold  px-3">Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UserStatistics />
        <UserLocations />
      </div>
    </div>
  );
};

export default Analytics;
