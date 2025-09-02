import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import LoginPage from "./Pages/LoginPage";
import ForgotPasswordPage from "./Pages/ForgotPasswordPage";
import DashboardPage from "./Pages/DashboardPage";
import UserManagementPage from "./Pages/UserManagementPage";
import ServiceCategoriesPage from "./Pages/ServiceCategoriesPage";
import BusinessDirectoryPage from "./Pages/BusinessDirectoryPage";
import DocumentsPage from "./Pages/DocumentsPage";
import ReviewsPage from "./Pages/ReviewsPage";
import VisitorAnalyticsPage from "./Pages/VisitorAnalyticsPage";
import LocationsOverviewPage from "./Pages/LocationsOverviewPage";
import AddArticlePage from "./Pages/AddArticlePage";
import AddLocationPage from "./Pages/AddLocationPage";
import AddBusinessPage from "./Pages/AddBusinessPage";
import AddCategoryPage from "./Pages/AddCategoryPage";

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
              <BusinessDirectoryPage />
            </div>
          }
        />
        <Route
          path="/business-directory"
          element={
            <div className="min-h-screen bg-gray-100">
              <Navbar />
              <BusinessDirectoryPage />
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
        <Route
          path="/visitor-analytics"
          element={
            <div className="min-h-screen bg-gray-100">
              <Navbar />
              <VisitorAnalyticsPage />
            </div>
          }
        />
        <Route
          path="/locations-overview"
          element={
            <div className="min-h-screen bg-gray-100">
              <Navbar />
              <LocationsOverviewPage />
            </div>
          }
        />
        <Route
          path="/add-article"
          element={
            <div className="min-h-screen bg-gray-100">
              <Navbar />
              <AddArticlePage />
            </div>
          }
        />
        <Route
          path="/add-location"
          element={
            <div className="min-h-screen bg-gray-100">
              <Navbar />
              <AddLocationPage />
            </div>
          }
        />
        <Route
          path="/add-business"
          element={
            <div className="min-h-screen bg-gray-100">
              <Navbar />
              <AddBusinessPage />
            </div>
          }
        />
        <Route
          path="/add-category"
          element={
            <div className="min-h-screen bg-gray-100">
              <Navbar />
              <AddCategoryPage />
            </div>
          }
        />
        <Route
          path="/login"
          element={
            <div className="min-h-screen bg-gray-100">
              <LoginPage />
            </div>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
