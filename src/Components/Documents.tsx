import React, { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import StatCard from "./StatCard";
import { Link } from "react-router-dom";
import axios from "axios";

const Documents: React.FC = () => {
  const [totalDocs, setTotalDocs] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTotalDocuments = async () => {
      try {
        const res = await axios.get(
          "https://nearme-bn.onrender.com/category/adminfetchdocs/all",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        // Assuming backend returns { total: number }
        setTotalDocs(res.data.total || 0);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchTotalDocuments();
  }, []);

  return (
    <Link to="/documents">
      <StatCard
        icon={FileText}
        value={loading ? "..." : totalDocs} // show "..." while loading
        label="Documents"
      />
    </Link>
  );
};

export default Documents;
