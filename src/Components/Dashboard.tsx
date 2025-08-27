import React from "react";
import TotalUsers from "./TotalUsers";
import Categories from "./Categories";
import Documents from "./Documents";
import Business from "./Business";
import Reviews from "./Reviews";
import Countries from "./Countries";
import Location from "./Location";

const Dashboard: React.FC = () => {
  return (
    <section className="pt-20 py-8 px-8 bg-gray-50">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold px-3">Dashboard Overview</h1>
        <p className="text-gray-600 px-3">
          Welcome back! Here's what's happening with your platform today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className=" items-center justify-center grid  grid-cols-1 sm:grid-cols-2 md:grid-cols-7 gap-6">
        <TotalUsers />
        <Categories />
        <Documents />
        <Business />
        <Reviews />
        <Countries />
        <Location />
      </div>
    </section>
  );
};

export default Dashboard;
