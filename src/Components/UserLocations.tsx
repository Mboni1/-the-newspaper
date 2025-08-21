import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const UserLocations: React.FC = () => {
  const userLocationsData = {
    labels: ["United States", "Canada", "United Kingdom", "Germany", "Others"],
    datasets: [
      {
        data: [35, 25, 18, 12, 8],
        backgroundColor: [
          "#1D4ED8",
          "#3B82F6",
          "#60A5FA",
          "#93C5FD",
          "#D1D5DB",
        ],
        borderWidth: 3,
      },
    ],
  };

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h2 className="text-sm font-semibold mb-1">User locations</h2>
      <p className="text-gray-500 text-xs mb-3">
        Geographic distribution of users
      </p>
      <div className="flex items-center">
        <div className="w-1/2 h-40">
          <Doughnut
            data={userLocationsData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
            }}
          />
        </div>
        <div className="w-1/2 ml-3 space-y-1">
          {userLocationsData.labels.map((label, index) => (
            <div
              key={label}
              className="flex justify-between items-center text-xs"
            >
              <div className="flex items-center space-x-1">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{
                    backgroundColor: userLocationsData.datasets[0]
                      .backgroundColor[index] as string,
                  }}
                ></span>
                <span>{label}</span>
              </div>
              <span>{userLocationsData.datasets[0].data[index]}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserLocations;
