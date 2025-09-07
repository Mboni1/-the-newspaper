import React from "react";
import NotificationBell from "./NotificationBell";
import UserAvatar from "./UserAvatar";
import DropDownIcon from "./DropDownIcon";
import logo1 from "../Assets/logo1.jpeg";

const Navbar: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 flex justify-between items-center px-4 py-3 bg-white shadow-sm">
      {/* Left side - Logo */}
      <div className="flex items-center px-6">
        <img src={logo1} alt="Logo1" className="h-12 w-auto object-contain" />
      </div>

      {/* Right side - Notification + User */}
      <div className="flex items-center gap-3">
        <NotificationBell />
        <div className="flex items-center gap-2 px-4">
          <UserAvatar />
          <DropDownIcon />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
