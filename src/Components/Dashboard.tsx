import React from "react";
import TotalUsers from "./TotalUsers";
import Categories from "./Categories";
import Documents from "./Documents";
import Business from "./Business";
import Reviews from "./Reviews";
import Locations from "./Locations";

const Dashboard: React.FC = () => {
  return (
    <section className="pt-20 py-8 px-8 bg-gray-50">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
        <p className="text-gray-600">
          Welcome back! Here's what's happening with your platform today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className=" grid  grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-6">
        <TotalUsers />
        <Categories />
        <Documents />
        <Business />
        <Reviews />
        <Locations />
      </div>
    </section>
  );
};

export default Dashboard;
