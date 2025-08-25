import React from "react";
import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import StatCard from "./StatCard";

const Locations: React.FC = () => {
  return (
    <Link to="/location-analytics">
      {" "}
      <StatCard icon={MapPin} value={45} label="Locations" />
    </Link>
  );
};

export default Locations;
