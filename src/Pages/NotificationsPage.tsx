import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
import Pagination from "../Components/Pagination";
import {
  Search,
  Trash2,
  Pencil,
  PlusCircle,
  Wrench,
  Megaphone,
  Users,
  AlertTriangle,
  CalendarClock,
} from "lucide-react";

interface Notification {
  id: number;
  title: string;
  message: string;
  type: "SYSTEM" | "ALERT" | "REMINDER" | "PROMOTION";
}

const limit = 3;

const NotificationsPage: React.FC = () => {
  const [notifications] = useState<Notification[]>([
    {
      id: 1,
      title: "System Maintenance Notice",
      message:
        "Scheduled maintenance will occur on Sunday from 2–4 AM. Services may be temporarily unavailable.",
      type: "SYSTEM",
    },
    {
      id: 2,
      title: "New Features Available",
      message:
        "Check out our latest updates including enhanced search and improved user profiles.",
      type: "PROMOTION",
    },
    {
      id: 3,
      title: "Welcome New Members",
      message:
        "Welcome to our community! Explore categories and discover amazing local businesses.",
      type: "REMINDER",
    },
    {
      id: 4,
      title: "Security Alert",
      message:
        "Please update your password to ensure account security. Click here to update now.",
      type: "ALERT",
    },
    {
      id: 5,
      title: "Holiday Schedule Update",
      message:
        "Our support team will have limited hours during the holiday season.",
      type: "SYSTEM",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"All" | "Scheduled">("All");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const filteredNotifications = notifications.filter((n) =>
    n.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate total pages whenever filteredNotifications changes
  useEffect(() => {
    setTotalPages(Math.ceil(filteredNotifications.length / limit));
    // Reset page if current page exceeds total pages
    if (page > Math.ceil(filteredNotifications.length / limit)) {
      setPage(1);
    }
  }, [filteredNotifications, page]);

  // Slice notifications for current page
  const paginatedNotifications = filteredNotifications.slice(
    (page - 1) * limit,
    page * limit
  );

  const getIcon = (type: string) => {
    switch (type) {
      case "SYSTEM":
        return <Wrench className="w-5 h-5 text-blue-500" />;
      case "PROMOTION":
        return <Megaphone className="w-5 h-5 text-blue-500" />;
      case "REMINDER":
        return <Users className="w-5 h-5 text-blue-500" />;
      case "ALERT":
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <CalendarClock className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="p-6 pt-20 bg-gray-50 min-h-screen">
      <Toaster position="top-right" />
      <Link
        to="/dashboard"
        className="text-blue-600 hover:underline inline-block mb-4"
      >
        ← Back to Dashboard
      </Link>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Notifications
          </h1>
          <p className="text-gray-500">
            Create, schedule and manage user notifications
          </p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition">
          <PlusCircle className="w-5 h-5" />
          <span>New</span>
        </button>
      </div>

      {/* Search + Tabs */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center bg-white px-3 py-2 rounded-lg shadow w-full max-w-md">
          <Search className="text-gray-400 w-5 h-5 mr-2" />
          <input
            type="text"
            placeholder="Search notification"
            className="w-full outline-none text-sm text-gray-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("All")}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              activeTab === "All"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 border"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab("Scheduled")}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              activeTab === "Scheduled"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 border"
            }`}
          >
            Scheduled
          </button>
        </div>
      </div>

      {/* Notification List */}
      <div className="bg-white rounded-lg shadow p-5">
        {paginatedNotifications.length === 0 ? (
          <p className="text-center text-gray-400 py-6">
            No notifications found.
          </p>
        ) : (
          paginatedNotifications.map((notification) => (
            <div
              key={notification.id}
              className="flex justify-between items-start border-b last:border-none py-4"
            >
              <div className="flex items-start gap-3">
                {getIcon(notification.type)}
                <div>
                  <h3 className="font-medium text-gray-900">
                    {notification.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {notification.message}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="text-blue-600 hover:text-blue-800">
                  <Pencil className="w-5 h-5" />
                </button>
                <button className="text-red-500 hover:text-red-700">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={(p) => setPage(p)}
        />
      )}
    </div>
  );
};

export default NotificationsPage;
