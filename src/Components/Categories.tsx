import React, { useEffect, useState } from "react";
import { Grid } from "lucide-react";
import StatCard from "./StatCard";
import { Link } from "react-router-dom";
import axios from "axios";

const Categories: React.FC = () => {
  const [categories, setCategories] = useState(0);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("https://nearme-bn.onrender.com/category", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (Array.isArray(res.data.data)) {
          setCategories(res.data.data.length);
        } else if (res.data.data) {
          setCategories(1);
        } else {
          setCategories(0);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <Link to="/service-categories">
      <StatCard icon={Grid} value={categories} label="Categories" />
    </Link>
  );
};

export default Categories;
