import React from "react";

interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, label }) => {
  return (
    <div className="flex items-center gap-3 p-5 bg-white rounded-xl shadow-sm">
      <div className="text-blue-600 text-3xl">{icon}</div>
      <div>
        <p className="text-xl font-bold text-blue-600">{value}</p>
        <p className="text-gray-500 text-sm">{label}</p>
      </div>
    </div>
  );
};

export default StatCard;
