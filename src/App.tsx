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

// Components
import Dashboard from "./Components/Dashboard";
import Analytics from "./Components/Analytics";
import AddArticle from "./Components/AddArticle";
import AddBusiness from "./Components/AddBusiness";
import AddCategory from "./Components/AddCategory";
import AddNotifications from "./Components/AddNotifications";

// Protection
import ProtectedRoute from "./Components/ProtectedRoute";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* 🚨 PROTECTED ROUTES 🚨 */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-100">
                <NavbarPage />
                <Dashboard />
                <Analytics />
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/user-management"
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-100">
                <NavbarPage />
                <UserManagementPage />
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/service-categories"
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-100">
                <NavbarPage />
                <ServiceCategoriesPage />
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/business"
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-100">
                <NavbarPage />
                <BusinessDirectoryPage />
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/documents"
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-100">
                <NavbarPage />
                <DocumentsPage />
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/reviews"
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-100">
                <NavbarPage />
                <ReviewsPage />
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-100">
                <NavbarPage />
                <NotificationsPage />
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-notifications"
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-100">
                <NavbarPage />
                <AddNotifications
                  onClose={() => console.log("Closed")}
                  onSave={(data) => console.log("Saved:", data)}
                />
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/locations-overview"
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-100">
                <NavbarPage />
                <LocationsOverviewPage />
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-article"
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-100">
                <NavbarPage />
                <AddArticle />
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-business"
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-100">
                <NavbarPage />
                <AddBusiness />
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-category"
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-100">
                <NavbarPage />
                <AddCategory />
              </div>
            </ProtectedRoute>
          }
        />

        {/* CATEGORY ROUTES */}
        <Route
          path="/category/:name"
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-100">
                <NavbarPage />
                <CategoryPage />
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/category/subCategory/:name"
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-100">
                <NavbarPage />
                <SubCategoryPage />
              </div>
            </ProtectedRoute>
          }
        />

        {/* CATCH ALL */}
        <Route
          path="*"
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-100">
                <NavbarPage />
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
