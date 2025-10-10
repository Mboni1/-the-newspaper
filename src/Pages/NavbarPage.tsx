import React from "react";
import { Link } from "react-router-dom";
import UserAvatar from "../Components/UserAvatar";
import DropDownIcon from "../Components/DropDownIcon";
import logo1 from "../Assets/logo1.jpeg";

const Navbar: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 flex justify-between items-center px-4 py-3 bg-white shadow-sm">
      {/* Left side - Logo */}
      <div className="flex items-center px-6">
        <Link to="/dashboard">
          <img
            src={logo1}
            alt="Logo1"
            className="h-12 w-auto object-contain cursor-pointer"
          />
        </Link>
      </div>

      {/* Right side - Notification + User */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-4">
          <UserAvatar />
          <DropDownIcon />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
