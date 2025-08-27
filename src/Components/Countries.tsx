import React from "react";
import { Globe } from "lucide-react";
import StatCard from "./StatCard";
import { Link } from "react-router-dom";

const Countries: React.FC = () => {
  return (
    <Link to="/visitor-analytics">
      <StatCard icon={Globe} value={"28"} label="Countries" />
    </Link>
  );
};

export default Countries;
