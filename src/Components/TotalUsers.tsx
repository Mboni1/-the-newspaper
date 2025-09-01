import React, { useEffect, useState } from "react";
import { Users } from "lucide-react";
import StatCard from "./StatCard";
import { Link } from "react-router-dom";
import axios from "axios";

const TotalUsers: React.FC = () => {
  const [users, setUsers] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("https://nearme-bn.onrender.com/user", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (Array.isArray(res.data.data)) {
          setUsers(res.data.data.length);
        } else if (res.data.data) {
          setUsers(1);
        } else {
          setUsers(0);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <Link to="/user-management">
      <StatCard icon={Users} value={users} label="Users" />
    </Link>
  );
};

export default TotalUsers;
