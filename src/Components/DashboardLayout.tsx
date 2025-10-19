import React from "react";
import NavbarPage from "../Pages/NavbarPage"; // ✅ correct path
import Sidebar from "./Sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <NavbarPage />
        <main className="p-6 mt-16">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
