import React, { useEffect, useState } from "react";
import { Bell } from "lucide-react";

interface Notification {
  id: number;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

const NotificationBell: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // fetch notifications from backend
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch(
          "https://nearme-bn.onrender.com/notifications",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = await res.json();
        if (Array.isArray(data.data)) {
          setNotifications(data.data);
          setUnreadCount(data.data.filter((n) => !n.read).length);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();

    // optional: auto-refresh every 30 sec
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

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
