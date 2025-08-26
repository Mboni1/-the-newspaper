import React from "react";
import { Briefcase } from "lucide-react";
import { Link } from "react-router-dom";
import StatCard from "./StatCard";

const Business: React.FC = () => {
  return (
    <Link to="/business">
      <StatCard icon={Briefcase} value={45} label="Business" />
    </Link>
  );
};

export default Business;
