import React from "react";
import { Users } from "lucide-react";
import StatCard from "./StatCard";
import { Link } from "react-router-dom";

const TotalUsers: React.FC = () => {
  return (
    <Link to="/user-management">
      <StatCard icon={Users} value={352} label="Total users" />
    </Link>
  );
};

export default TotalUsers;
