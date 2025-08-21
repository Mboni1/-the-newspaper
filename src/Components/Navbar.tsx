import React from "react";
import SearchBar from "./SearchBar";
import NotificationBell from "./NotificationBell";
import UserMenu from "./UserMenu";

const Navbar: React.FC = () => {
  return (
    <header className="flex justify-between items-center px-6 py-3 bg-white shadow-sm">
      <SearchBar />
      <div className="flex items-center gap-6">
        <NotificationBell />
        <UserMenu />
      </div>
    </header>
  );
};

export default Navbar;
