import React from "react";
import { User, ChevronDown } from "lucide-react";

const UserMenu: React.FC = () => {
  return (
    <div className="flex items-center gap-2 cursor-pointer">
      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
        <User className="w-5 h-5 text-white" />
      </div>
      <ChevronDown className="w-4 h-4 text-gray-600" />
    </div>
  );
};

export default UserMenu;
