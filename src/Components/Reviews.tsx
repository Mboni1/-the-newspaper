import React from "react";
import { Star } from "lucide-react";
import StatCard from "./StatCard";

const Reviews: React.FC = () => {
  return <StatCard icon={Star} value="1.2k" label="Reviews" rating={4} />;
};

export default Reviews;
