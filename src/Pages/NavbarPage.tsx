import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import { toggleSidebar } from "../store/uiSlice";
import { Bars3Icon } from "@heroicons/react/24/outline";

import UserAvatar from "../Components/UserAvatar";
import logo1 from "../Assets/logo1.jpeg";

const Navbar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 flex justify-between items-center px-4 py-3 bg-white shadow-sm">
      {/* Left side - Logo & Mobile menu toggle */}
      <div className="flex items-center gap-4">
        {/* Mobile Sidebar Toggle */}
        <button
          className="md:hidden p-2 rounded hover:bg-gray-200"
          onClick={() => dispatch(toggleSidebar())}
        >
          <Bars3Icon className="w-6 h-6 text-gray-700" />
        </button>

        <Link to="/dashboard">
          <img
            src={logo1}
            alt="Logo1"
            className="h-12 w-auto object-contain cursor-pointer"
          />
        </Link>
      </div>

      {/* User Avatar */}
      <div className="flex items-center gap-4">
        <UserAvatar />
      </div>
    </header>
  );
};

export default Navbar;
