import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import LoginPage from "./Pages/LoginPage";
import ForgotPasswordPage from "./Pages/ForgotPasswordPage";
import UserManagementPage from "./Pages/UserManagementPage";
import ServiceCategoriesPage from "./Pages/ServiceCategoriesPage";
import BusinessDirectoryPage from "./Pages/BusinessDirectoryPage";
import DocumentsPage from "./Pages/DocumentsPage";
import ReviewsPage from "./Pages/ReviewsPage";
import NotificationsPage from "./Pages/NotificationsPage";
import LocationsOverviewPage from "./Pages/LocationsOverviewPage";
import CategoryPage from "./Pages/CategoryPage";
import SubCategoryPage from "./Pages/SubCategoryPage";
import NavbarPage from "./Pages/NavbarPage";
import NotFoundPage from "./Pages/NotFoundPage";

// Components (Dashboard)
import Dashboard from "./Components/Dashboard";
import Analytics from "./Components/Analytics";
import AddArticle from "./Components/AddArticle";
import AddBusiness from "./Components/AddBusiness";
import AddCategory from "./Components/AddCategory";
import AddNotifications from "./Components/AddNotifications";
import Counter from "./Components/Counter";

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
              <Counter />
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
          path="/notifications"
          element={
            <div className="min-h-screen bg-gray-100">
              <NavbarPage />
              <NotificationsPage />
            </div>
          }
        />
        <Route
          path="/add-notifications"
          element={
            <div className="min-h-screen bg-gray-100">
              <NavbarPage />
              <AddNotifications
                onClose={() => console.log("Closed")}
                onSave={(data) => console.log("Saved:", data)}
              />
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

        {/* Catch all route */}
        <Route
          path="*"
          element={
            <div className="min-h-screen bg-gray-100">
              <NavbarPage />
              <NotFoundPage />
            </div>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
