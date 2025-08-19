import React from "react";

const data = [
  { label: "Week 1", value: 850 },
  { label: "Week 2", value: 920 },
  { label: "Week 3", value: 780 },
  { label: "Week 4", value: 1100 },
];

const maxValue = Math.max(...data.map((d) => d.value));

const UserStatistics: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm w-full">
      <h3 className="text-lg font-semibold">User Statistics</h3>
      <p className="text-sm text-gray-500 mb-4">User activity over time</p>

      <div className="flex justify-around items-end h-48">
        {data.map((d, i) => (
          <div key={i} className="flex flex-col items-center">
            <span className="mb-2 font-semibold text-sm">{d.value}</span>
            <div
              className={`w-10 rounded-lg ${
                i === 3 ? "bg-blue-600" : "bg-blue-400"
              }`}
              style={{ height: `${(d.value / maxValue) * 150}px` }}
            />
            <span className="mt-2 text-sm text-gray-600">{d.label}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-2 mt-4">
        {["D", "W", "M", "Y"].map((period) => (
          <button
            key={period}
            className={`px-3 py-1 rounded-lg font-medium ${
              period === "W"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {period}
          </button>
        ))}
      </div>
    </div>
  );
};

export default UserStatistics;
