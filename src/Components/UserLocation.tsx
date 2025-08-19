import React from "react";

const UserLocation: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm w-full">
      <h3 className="text-lg font-semibold">User Location</h3>
      <p className="text-sm text-gray-500 mb-4">Geographic distribution</p>

      <div className="flex justify-center items-center">
        <div className="relative w-40 h-40 rounded-full bg-gradient-to-tr from-blue-600 via-blue-400 to-blue-200">
          <div className="absolute inset-6 bg-white rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default UserLocation;
