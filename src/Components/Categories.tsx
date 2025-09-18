import React, { useEffect, useState } from "react";
import { Grid } from "lucide-react";
import StatCard from "./StatCard";
import { Link } from "react-router-dom";

import api from "../lib/axios";

const Categories: React.FC = () => {
  const [totalCategories, setTotalCategories] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTotalCategories = async () => {
      try {
        const res = await api.get("/category");

        // Assuming backend returns { total: number }
        setTotalCategories(res.data.total || 0);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchTotalCategories();
  }, []);

  return (
    <Link to="/service-categories">
      <StatCard
        icon={Grid}
        value={loading ? "..." : totalCategories} // show "..." while loading
        label="Categories"
      />
    </Link>
  );
};

export default Categories;
