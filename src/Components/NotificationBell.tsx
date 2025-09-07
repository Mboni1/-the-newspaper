import React, { useState } from "react";
import { Bell } from "lucide-react";

const NotificationBell: React.FC = () => {
  const [unreadCount] = useState(0);

  return (
    <div className="relative cursor-pointer">
      <Bell className="w-6 h-6 text-gray-600" />

      {/* show badge if unread */}
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full">
          {unreadCount}
        </span>
      )}
    </div>
  );
};

export default NotificationBell;
