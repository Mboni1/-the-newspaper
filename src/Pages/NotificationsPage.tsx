// src/Pages/NotificationsPage.tsx
import React, { useEffect, useState } from "react";
import { Bell, Plus, Pencil, Trash, X, Search, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import api from "../lib/axios";
import Pagination from "../Components/Pagination";
import AddNotifications from "../Components/AddNotifications";

export interface Notification {
  id: number;
  title: string;
  body: string;
  category: string;
  type: "SYSTEM" | "ALERT" | "REMINDER" | "PROMOTION";
}

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalNotifications, setTotalNotifications] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editNotification, setEditNotification] = useState<Notification>();

  const limit = 10;

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setPage(1);
      setSearchQuery(searchTerm.trim());
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch notifications whenever page, filters, or searchQuery change
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const params: any = { page, limit };
        if (searchQuery) params.query = searchQuery;
        if (categoryFilter) params.category = categoryFilter;
        if (typeFilter) params.type = typeFilter;

        const res =
          searchQuery || categoryFilter || typeFilter
            ? await api.get("/notification/search", { params })
            : await api.get("/notification/admin/all", { params });

        const { data, total } = res.data;
        if (!Array.isArray(data)) throw new Error("Invalid API response");

        setNotifications(data);
        const totalCount = total ?? 0; // default 0 if undefined
        setTotalNotifications(totalCount);
        setTotalPages(Math.ceil(totalCount / limit)); // pagination ikora neza
      } catch (error: any) {
        console.error(error.response || error);
        toast.error("Failed to fetch notifications");
        setNotifications([]);
        setTotalNotifications(0);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [page, searchQuery, categoryFilter, typeFilter]);

  // Save notification
  const handleSave = async (data: Notification) => {
    try {
      if (editNotification) {
        const res = await api.patch(
          `/notification/${editNotification.id}`,
          data
        );
        setNotifications((prev) =>
          prev.map((n) => (n.id === editNotification.id ? res.data : n))
        );
        toast.success("Notification updated successfully");
      } else {
        const res = await api.post("/notification/add", data);
        setNotifications((prev) => [res.data, ...prev]);
        // Update totalNotifications and totalPages correctly
        setTotalNotifications((prev) => {
          const newTotal = prev + 1;
          setTotalPages(Math.ceil(newTotal / limit));
          return newTotal;
        });
        toast.success("Notification added successfully");
      }
      setShowModal(false);
      setEditNotification(undefined);
    } catch (error: any) {
      console.error(error.response || error);
      toast.error(
        error.response?.data?.message || "Failed to save notification"
      );
    }
  };

  // Delete notification
  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/notification/admin/${id}`);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      setTotalNotifications((prev) => {
        const newTotal = prev - 1;
        setTotalPages(Math.ceil(newTotal / limit));
        return newTotal;
      });
      toast.success("Notification deleted");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete notification");
    }
  };

  const handleEdit = (notification: Notification) => {
    setEditNotification(notification);
    setShowModal(true);
  };

  return (
    <div className="p-6 pt-20 bg-gray-50 min-h-screen">
      <Toaster position="top-right" />

      <Link
        to="/dashboard"
        className="text-blue-500 hover:underline inline-block mb-4"
      >
        ← Back to Dashboard
      </Link>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Bell className="text-blue-600" /> Notifications
        </h2>
        <button
          onClick={() => {
            setEditNotification(undefined);
            setShowModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus size={18} /> Add Notification
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-3 items-center">
        {/* Search input */}
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search notifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border  border-gray-300 rounded-xl w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Category filter */}
        <div className="w-full md:w-1/4">
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            className="border  border-gray-300 rounded-xl px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">All Categories</option>
            <option value="Marketing">Marketing</option>
            <option value="Sales">Sales</option>
            <option value="Updates">Updates</option>
            <option value="System">System</option>
            <option value="test">test</option>
          </select>
        </div>

        {/* Type filter */}
        <div className="w-full md:w-1/4">
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setPage(1);
            }}
            className="border  border-gray-300 rounded-xl px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">All Types</option>
            <option value="SYSTEM">SYSTEM</option>
            <option value="ALERT">ALERT</option>
            <option value="REMINDER">REMINDER</option>
            <option value="PROMOTION">PROMOTION</option>
          </select>
        </div>
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="animate-spin text-blue-600" size={32} />
        </div>
      ) : notifications.length === 0 ? (
        <p className="text-gray-500 text-center py-10">
          No notifications found.
        </p>
      ) : (
        <div className="space-y-4">
          {notifications.map((n) => (
            <div
              key={n.id}
              className="w-full border  border-gray-300 rounded-xl p-4 shadow bg-white flex justify-between items-center hover:shadow-md transition"
            >
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {n.title}
                </h3>
                <p className="text-gray-700 text-sm">{n.body}</p>
                <div className="text-xs text-gray-500 mt-1"></div>
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => handleEdit(n)}
                  className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => handleDelete(n.id)}
                  className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                >
                  <Trash size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-md relative">
            <button
              onClick={() => {
                setShowModal(false);
                setEditNotification(undefined);
              }}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>

            <AddNotifications
              onClose={() => {
                setShowModal(false);
                setEditNotification(undefined);
              }}
              onSave={handleSave}
              initialData={editNotification}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
