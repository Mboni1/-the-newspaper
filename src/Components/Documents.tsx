import React from "react";
import { FileText } from "lucide-react";
import StatCard from "./StatCard";

const Documents: React.FC = () => {
  return <StatCard icon={FileText} value={45} label="Documents" />;
};

export default Documents;
