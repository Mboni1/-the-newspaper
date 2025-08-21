import React from "react";
import { Bell } from "lucide-react";

const NotificationBell: React.FC = () => {
  return (
    <div className="relative cursor-pointer">
      <Bell className="w-6 h-6 text-gray-600" />
      <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
    </div>
  );
};

export default NotificationBell;
