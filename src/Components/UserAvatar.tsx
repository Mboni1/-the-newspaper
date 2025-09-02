import React, { useState } from "react";
import { User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UserAvatar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Gusiba token/session
    localStorage.removeItem("token");
    console.log("Logged out");
    navigate("/login"); // Redirect kuri LoginPage
  };

  return (
    <div className="relative">
      {/* Avatar */}
      <div
        className="w-10 h-10 rounded-full overflow-hidden bg-blue-500 flex items-center justify-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <User className="w-6 h-6 text-white" />
      </div>

      {/* Dropdown: Logout only */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white border rounded-xl shadow-lg p-2 z-20">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 text-red-500 rounded-lg"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
