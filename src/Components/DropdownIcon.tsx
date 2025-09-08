import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const DropdownIcon: React.FC = () => {
  const [open, setOpen] = useState(false);

  const handleSelect = (role: string) => {
    localStorage.setItem("role", role);
    setOpen(false);
    window.location.reload(); // refresh to apply role in Dashboard
  };

  return (
    <div className="relative inline-block text-left">
      {/* Trigger */}
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 cursor-pointer px-3 py-2 rounded-lg hover:bg-gray-200 transition"
      >
        <ChevronDown className="w-4 h-4 text-gray-600" />
      </div>

      {/* Dropdown menu */}
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <button
            onClick={() => handleSelect("admin")}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Admin
          </button>
          <button
            onClick={() => handleSelect("moderator")}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Moderator
          </button>
        </div>
      )}
    </div>
  );
};

export default DropdownIcon;
