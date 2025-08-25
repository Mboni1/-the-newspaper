import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import LoginPage from "./Pages/LoginPage";
import ForgotPasswordPage from "./Pages/ForgotPasswordPage";
import DashboardPage from "./Pages/DashboardPage";
import UserManagementPage from "./Pages/UserManagementPage";
import ServiceCategoriesPage from "./Pages/ServiceCategoriesPage";
import BusinessPage from "./Pages/BusinessesPage";
import DocumentsPage from "./Pages/DocumentsPage";
import ReviewsPage from "./Pages/ReviewsPage";
import LocationAnalyticsPage from "./Pages/LocationAnalyticsPage";

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
        <Route
          path="/service-categories"
          element={
            <div className="min-h-screen bg-gray-100">
              <Navbar />
              <ServiceCategoriesPage />
            </div>
          }
        />
        <Route
          path="/business"
          element={
            <div className="min-h-screen bg-gray-100">
              <Navbar />
              <BusinessPage />
            </div>
          }
        />
        <Route
          path="/documents"
          element={
            <div className="min-h-screen bg-gray-100">
              <Navbar />
              <DocumentsPage />
            </div>
          }
        />
        <Route
          path="/reviews"
          element={
            <div className="min-h-screen bg-gray-100">
              <Navbar />
              <ReviewsPage />
            </div>
          }
        />

        {/* New Route: Location Analytics */}
        <Route
          path="/location-analytics"
          element={
            <div className="min-h-screen bg-gray-100">
              <Navbar />
              <LocationAnalyticsPage />
            </div>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
