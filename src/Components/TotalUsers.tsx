import React, { useEffect, useState } from "react";
import { Users } from "lucide-react";
import StatCard from "./StatCard";
import { Link } from "react-router-dom";
import axios from "axios";
import api from "../lib/axios";

const TotalUsers: React.FC = () => {
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTotalUsers = async () => {
      try {
        const res = await api.get("/user/all");

        // Assuming backend returns { total: number }
        setTotalUsers(res.data.total || 0);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchTotalUsers();
  }, []);

  return (
    <Link to="/user-management">
      <StatCard
        icon={Users}
        value={loading ? "..." : totalUsers} // show "..." while loading
        label="TotalUsers"
      />
    </Link>
  );
};

export default TotalUsers;
