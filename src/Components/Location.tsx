import React from "react";
import { MapPin } from "lucide-react";
import StatCard from "./StatCard";
import { Link } from "react-router-dom";

const Location: React.FC = () => {
  return (
    <Link to="/locations-overview">
      <StatCard icon={MapPin} value={"45"} label="Location" />
    </Link>
  );
};

export default Location;
