import React from "react";
import Sidebar from "./Sidebar";
import NavbarPage from "../Pages/NavbarPage";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <NavbarPage />
        <main className="p-6 mt-16">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
