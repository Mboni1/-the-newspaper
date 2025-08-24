import React from "react";
import { Search, Bell, ChevronDown, User } from "lucide-react";

const Navbar: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 flex justify-between items-center px-6 py-3  bg-white shadow-sm">
      {/* Search bar */}
      <div className="flex items-center w-1/3 relative">
        {/* Search Icon */}
        <Search className="absolute left-3 text-gray-400 w-5 h-5" />

        {/* Input */}
        <input
          type="text"
          placeholder="Search..."
          className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6">
        {/* Notification Icon */}
        <div className="relative">
          <Bell className="w-6 h-6 text-gray-600 cursor-pointer" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
        </div>

        {/* User Avatar */}
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <ChevronDown className="w-4 h-4 text-gray-600" />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
