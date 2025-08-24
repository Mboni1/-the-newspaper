import React from "react";
import { Grid } from "lucide-react";
import StatCard from "./StatCard";
import { Link } from "react-router-dom";

const Categories: React.FC = () => {
  return (
    <Link to="/service-categories">
      <StatCard icon={Grid} value={"09"} label="Categories" />
    </Link>
  );
};

export default Categories;
