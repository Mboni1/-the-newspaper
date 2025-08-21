import React from "react";
import { Briefcase } from "lucide-react";
import StatCard from "./StatCard";

const Business: React.FC = () => {
  return <StatCard icon={Briefcase} value={45} label="Business" />;
};

export default Business;
