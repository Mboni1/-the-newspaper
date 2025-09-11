import React, { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import StatCard from "./StatCard";
import { Link } from "react-router-dom";
import api from "../lib/axios";

const Location: React.FC = () => {
  const [totalLocations, setTotalLocations] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTotalLocations = async () => {
      try {
        const res = await api.get("/location/admin/all");

        // Assuming backend returns { total: number }
        setTotalLocations(res.data.total || 0);
      } catch (err) {
        console.error("Failed to fetch total locations:", err);
        setTotalLocations(0);
      } finally {
        setLoading(false);
      }
    };

    fetchTotalLocations();
  }, []);

  return (
    <Link to="/locations-overview">
      <StatCard
        icon={MapPin}
        value={loading ? "..." : totalLocations}
        label="Location"
      />
    </Link>
  );
};

export default Location;
