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
import AddArticle from "./Components/AddArticle";
import AddBusiness from "./Components/AddBusiness";
import AddCategory from "./Components/AddCategory";
import CategoryPage from "./Pages/CategoryPage";
import SubCategoryPage from "./Pages/SubCategoryPage";
import NavbarPage from "./Pages/NavbarPage";

// Components (for Dashboard layout)

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
              <NavbarPage />
              <Dashboard />
              <Analytics />
            </div>
          }
        />

        <Route
          path="/user-management"
          element={
            <div className="min-h-screen bg-gray-100">
              <NavbarPage />
              <UserManagementPage />
            </div>
          }
        />

        <Route
          path="/service-categories"
          element={
            <div className="min-h-screen bg-gray-100">
              <NavbarPage />
              <ServiceCategoriesPage />
            </div>
          }
        />

        <Route
          path="/business"
          element={
            <div className="min-h-screen bg-gray-100">
              <NavbarPage />
              <BusinessDirectoryPage />
            </div>
          }
        />

        <Route
          path="/business-directory"
          element={
            <div className="min-h-screen bg-gray-100">
              <NavbarPage />
              <BusinessDirectoryPage />
            </div>
          }
        />

        <Route
          path="/documents"
          element={
            <div className="min-h-screen bg-gray-100">
              <NavbarPage />
              <DocumentsPage />
            </div>
          }
        />

        <Route
          path="/reviews"
          element={
            <div className="min-h-screen bg-gray-100">
              <NavbarPage />
              <ReviewsPage />
            </div>
          }
        />

        <Route
          path="/visitor-analytics"
          element={
            <div className="min-h-screen bg-gray-100">
              <NavbarPage />
              <VisitorAnalyticsPage />
            </div>
          }
        />

        <Route
          path="/locations-overview"
          element={
            <div className="min-h-screen bg-gray-100">
              <NavbarPage />
              <LocationsOverviewPage />
            </div>
          }
        />

        <Route
          path="/add-article"
          element={
            <div className="min-h-screen bg-gray-100">
              <NavbarPage />
              <AddArticle />
            </div>
          }
        />

        <Route
          path="/add-business"
          element={
            <div className="min-h-screen bg-gray-100">
              <NavbarPage />
              <AddBusiness />
            </div>
          }
        />

        <Route
          path="/add-category"
          element={
            <div className="min-h-screen bg-gray-100">
              <NavbarPage />
              <AddCategory />
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

        {/* Category detail route */}
        <Route
          path="/category/:name"
          element={
            <div className="min-h-screen bg-gray-100">
              <NavbarPage />
              <CategoryPage />
            </div>
          }
        />
        <Route
          path="/category/subCategory/:name"
          element={
            <div className="min-h-screen bg-gray-100">
              <NavbarPage />
              <SubCategoryPage />
            </div>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
