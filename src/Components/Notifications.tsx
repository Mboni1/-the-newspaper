import React from "react";
import { Bell } from "lucide-react";
import StatCard from "./StatCard";
import { Link } from "react-router-dom";

const Notifications: React.FC = () => {
  return (
    <Link to="/notifications">
      <StatCard icon={Bell} value={""} label="Notifications" />
    </Link>
  );
};

export default Notifications;
