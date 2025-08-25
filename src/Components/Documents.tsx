import React from "react";
import { FileText } from "lucide-react";
import StatCard from "./StatCard";
import { Link } from "react-router-dom"; // import Link

const Documents: React.FC = () => {
  return (
    <Link to="/documents">
      {/* <-- navigate to DocumentsPage */}
      <StatCard icon={FileText} value={45} label="Documents" />
    </Link>
  );
};

export default Documents;
