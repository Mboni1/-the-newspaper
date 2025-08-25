import React from "react";
import { Star } from "lucide-react";
import StatCard from "./StatCard";
import { Link } from "react-router-dom";

const Reviews: React.FC = () => {
  return (
    <Link to="/reviews">
      {" "}
      {/* make sure this matches route */}
      <StatCard icon={Star} value="1.2k" label="Reviews" rating={4} />
    </Link>
  );
};

export default Reviews;
