import React from "react";
import { Grid } from "lucide-react";
import StatCard from "./StatCard";

const Categories: React.FC = () => {
  return <StatCard icon={Grid} value={"09"} label="Categories" />;
};

export default Categories;
