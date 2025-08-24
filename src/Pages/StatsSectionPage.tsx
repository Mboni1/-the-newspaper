import React from "react";

interface StatCardProps {
  value: string | number;
  label: string;
}

const StatCard: React.FC<StatCardProps> = ({ value, label }) => (
  <div className="flex flex-col items-center justify-center bg-white rounded-xl shadow-md p-6 w-98">
    <span className="text-2xl font-bold text-purple-600">{value}</span>
    <span className="text-sm text-gray-500">{label}</span>
  </div>
);

const StatsSectionPage: React.FC = () => (
  <div className="flex justify-center gap-8 py-20 bg-gray-50">
    <StatCard value={261} label="Total Services" />
    <StatCard value={10} label="Categories" />
    <StatCard value="24/7" label="Support Available" />
  </div>
);

export default StatsSectionPage;
