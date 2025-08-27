import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  rating?: number;
}

const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  value,
  label,
  rating,
}) => {
  return (
    <div className="flex items-center  grid-cols-6 gap-4 rounded-xl p-4 shadow-sm bg-white hover:shadow-md transition">
      {/* Icon inside blue bordered square */}
      <div className="flex items-center justify-center w-12 h-12 border-2 border-blue-200 rounded-md bg-white">
        <Icon className="w-6 h-6 text-blue-600" />
      </div>

      {/* Value and label on the left */}
      <div className="flex flex-col">
        <p className="text-2xl font-bold text-blue-600">{value}</p>
        <p className="text-gray-600 text-sm">{label}</p>
      </div>
    </div>
  );
};

export default StatCard;
