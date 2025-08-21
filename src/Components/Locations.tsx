import React from "react";
import { MapPin } from "lucide-react";
import StatCard from "./StatCard";

const Locations: React.FC = () => {
  return <StatCard icon={MapPin} value={45} label="Locations" />;
};

export default Locations;
