import React from "react";
import UserStatistics from "./UserStatistics";
import UserLocations from "./UserLocations";

const Analytics: React.FC = () => {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-lg font-bold">Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UserStatistics />
        <UserLocations />
      </div>
    </div>
  );
};

export default Analytics;
