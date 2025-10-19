import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage: React.FC = () => (
  <div className="flex flex-col justify-center items-center h-screen">
    <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
    <Link to="/dashboard" className="text-blue-500 underline">
      Go to Dashboard
    </Link>
  </div>
);

export default NotFoundPage;
