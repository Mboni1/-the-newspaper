import React from "react";
import { Users } from "lucide-react";
import StatCard from "./StatCard";

const TotalUsers: React.FC = () => {
  return <StatCard icon={Users} value={352} label="Total users" />;
};

export default TotalUsers;
