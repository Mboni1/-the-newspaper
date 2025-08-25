import React from "react";
import NotificationBell from "./NotificationBell";
import UserAvatar from "./UserAvatar";
import DropdownIcon from "./DropdownIcon";

const Navbar: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 flex justify-end items-center px-6 py-3 bg-white shadow-sm">
      <div className="flex items-center gap-6">
        <NotificationBell />
        <div className="flex items-center gap-2">
          <UserAvatar
            name="Claude"
            profileImage="https://via.placeholder.com/150"
            onLogout={() => alert("User logged out")}
            onChangePhoto={() => alert("Change photo clicked")}
          />
          <DropdownIcon />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
