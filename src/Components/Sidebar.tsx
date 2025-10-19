import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { toggleSidebar } from "../store/uiSlice";

const menuItems = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "User Management", path: "/user-management" },
  { name: "Service Categories", path: "/service-categories" },
  { name: "Business Directory", path: "/business-directory" },
  { name: "Documents", path: "/documents" },
  { name: "Reviews", path: "/reviews" },
  { name: "Notifications", path: "/notifications" },
];

const Sidebar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const sidebarOpen = useSelector((state: RootState) => state.ui.sidebarOpen);
  const location = useLocation();

  return (
    <div
      className={`bg-gray-800 text-white h-screen p-4 fixed top-0 left-0 transition-transform transform ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 w-64 z-50`}
    >
      {/* Toggle button for mobile */}
      <button
        className="md:hidden mb-4 px-2 py-1 bg-gray-700 rounded"
        onClick={() => dispatch(toggleSidebar())}
      >
        Toggle
      </button>

      <ul>
        {menuItems.map((item) => (
          <li key={item.path} className="mb-2">
            <Link
              to={item.path}
              className={`block px-4 py-2 rounded hover:bg-gray-700 ${
                location.pathname === item.path ? "bg-gray-900 font-bold" : ""
              }`}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
