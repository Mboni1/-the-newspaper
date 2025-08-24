import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import LoginPage from "./Pages/LoginPage";
import ForgotPasswordPage from "./Pages/ForgotPasswordPage";
import DashboardPage from "./Pages/DashboardPage";
import UserManagementPage from "./Pages/UserManagementPage";
import ServiceCategoriesPage from "./Pages/ServiceCategoriesPage";

// Components (for Dashboard layout)
import Navbar from "./Components/Navbar";
import Dashboard from "./Components/Dashboard";
import Analytics from "./Components/Analytics";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <div className="min-h-screen bg-gray-100">
              <Navbar />
              <Dashboard />
              <Analytics />
            </div>
          }
        />

        <Route
          path="/user-management"
          element={
            <div className="min-h-screen bg-gray-100">
              <Navbar />
              <UserManagementPage />
            </div>
          }
        />

        {/* Service Categories Route */}
        <Route
          path="/service-categories"
          element={
            <div className="min-h-screen bg-gray-100">
              <Navbar />
              <ServiceCategoriesPage />
            </div>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
