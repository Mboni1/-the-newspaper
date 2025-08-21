import React from "react";
import Dashboard from "./Components/Dashboard";
import Navbar from "./Components/Navbar";
import Analytics from "./Components/Analytics";

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <Dashboard />
      <Analytics />
    </div>
  );
};

export default App;
