import React, { useEffect, useState } from "react";
import { Briefcase } from "lucide-react";
import { Link } from "react-router-dom";
import StatCard from "./StatCard";
import api from "../lib/axios";

const Business: React.FC = () => {
  const [totalBusinesses, setTotalBusinesses] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTotalBusinesses = async () => {
      try {
        const res = await api.get("/category/adminfetchbuz/all", {
          params: {
            limit: 1, // we only need total count, not all records
            page: 1,
          },
        });

        // Assuming backend returns total count in res.data.total
        setTotalBusinesses(res.data.total || 0);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching total businesses:", err);
        setTotalBusinesses(0);
        setLoading(false);
      }
    };

    fetchTotalBusinesses();
  }, []);

  return (
    <Link to="/business">
      <StatCard
        icon={Briefcase}
        value={loading ? "..." : totalBusinesses} // show "..." while loading
        label="Business"
      />
    </Link>
  );
};

export default Business;
