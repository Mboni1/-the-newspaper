import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";
import StatCard from "./StatCard";
import { Link } from "react-router-dom";
import axios from "axios";

const Reviews: React.FC = () => {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviewsCount = async () => {
      try {
        const res = await axios.get(
          "https://nearme-bn.onrender.com/review/admin/all",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        // assuming backend returns { data: [...], total: number }
        const totalReviews = res.data.total ?? res.data.data?.length ?? 0;
        setCount(totalReviews);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || "Failed to fetch reviews");
        setLoading(false);
      }
    };

    fetchReviewsCount();
  }, []);

  return (
    <Link to="/reviews">
      <StatCard
        icon={Star}
        value={loading ? "..." : count ?? 0}
        label="Reviews"
        rating={4}
      />
    </Link>
  );
};

export default Reviews;
