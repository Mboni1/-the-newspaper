import React, { useEffect, useState } from "react";
import { Bell, Plus, Pencil, Trash, X, Search, Loader2 } from "lucide-react";
import AddNotifications from "../Components/AddNotifications";
import api from "../lib/axios";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editNotification, setEditNotification] = useState<
    Notification | undefined
  >(undefined);

  // Fetch notifications
  const fetchNotifications = async (query = "") => {
    try {
      setLoading(true);
      const res = await api.get("/notifications", {
        params: query ? { search: query } : {},
      });
      setNotifications(res.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchNotifications(searchTerm);
    }, 500);
    return () => clearTimeout(delay);
  }, [searchTerm]);

  // Add or update notification
  const handleSave = async (data: Notification) => {
    try {
      if (editNotification) {
        const res = await api.put(
          `/notifications/${editNotification.id}`,
          data,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        setNotifications((prev) =>
          prev.map((n) => (n.id === editNotification.id ? res.data : n))
        );
        toast.success("Notification updated successfully");
      } else {
        const res = await api.post("/notification/add", data, {
          headers: { "Content-Type": "application/json" },
        });
        setNotifications((prev) => [...prev, res.data]);
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
      await api.delete(`/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
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

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
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

      {/* Search */}
      <div className="mb-4 relative">
        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search notifications..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 border rounded-xl w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Notification List */}
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="animate-spin text-blue-600" size={32} />
        </div>
      ) : notifications.length === 0 ? (
        <p className="text-gray-500 text-center py-10">
          No notifications found.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notifications.map((n) => (
            <div
              key={n.id}
              className="border rounded-xl p-4 shadow hover:shadow-md transition relative"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{n.title}</h3>
                  <p className="text-gray-600 mb-1">{n.body}</p>

                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Category:</span> {n.category}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Type:</span> {n.type}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(n)}
                    className="p-1 text-blue-600 hover:bg-blue-100 rounded-lg"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(n.id)}
                    className="p-1 text-red-600 hover:bg-red-100 rounded-lg"
                  >
                    <Trash size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
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
