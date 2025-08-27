import React from "react";
import NotificationBell from "./NotificationBell";
import UserAvatar from "./UserAvatar";
import DropdownIcon from "./DropdownIcon";

const Navbar: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 flex justify-end items-center px-0 py-3 bg-white shadow-sm">
      <div className="flex items-center gap-6">
        <NotificationBell />
        <div className="flex items-center gap-2">
          <UserAvatar />
          <DropdownIcon />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
