import React, { useEffect, useState } from "react";
import api from "../lib/axios";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";

interface Category {
  id: number;
  name: string;
}

interface Notification {
  id: number;
  title: string;
  body: string;
  type: "SYSTEM" | "ALERT" | "REMINDER" | "PROMOTION";
  categoryId?: number;
  createdAt: string;
}

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [type, setType] = useState<Notification["type"]>("SYSTEM");
  const [categoryId, setCategoryId] = useState<number | undefined>();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch categories and notifications
  useEffect(() => {
    fetchNotifications();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/category/admin/all");
      setCategories(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notification/admin/all");
      setNotifications(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !body) return;

    setLoading(true);
    try {
      const payload = { title, body, type, categoryId };
      await api.post("/notification/add", payload);
      resetForm();
      fetchNotifications();
    } catch (error) {
      console.error("Failed to save notification:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (n: Notification) => {
    setTitle(n.title);
    setBody(n.body);
    setType(n.type);
    setCategoryId(n.categoryId);
    setEditingId(n.id);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this notification?")) return;
    try {
      await api.delete(`/notification/${id}`);
      fetchNotifications();
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  const resetForm = () => {
    setTitle("");
    setBody("");
    setType("SYSTEM");
    setCategoryId(undefined);
    setEditingId(null);
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
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Notifications</h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-2xl p-6 mb-8"
      >
        <h2 className="text-lg font-semibold mb-4">
          {editingId ? "Update Notification" : "Add New Notification"}
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Title
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-300 outline-none"
              placeholder="Enter notification title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as Notification["type"])}
              className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-300 outline-none"
            >
              <option value="SYSTEM">System</option>
              <option value="ALERT">Alert</option>
              <option value="REMINDER">Reminder</option>
              <option value="PROMOTION">Promotion</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Body
            </label>
            <textarea
              className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-300 outline-none"
              placeholder="Enter notification message"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Category
            </label>
            <select
              value={categoryId || ""}
              onChange={(e) =>
                setCategoryId(
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
              className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-300 outline-none"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-60"
          >
            {loading
              ? "Saving..."
              : editingId
              ? "Update Notification"
              : "Add Notification"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Notifications List */}
      <div className="bg-white shadow-md rounded-2xl p-6">
        {notifications.length === 0 ? (
          <p className="text-gray-500 text-sm"></p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {notifications.map((n) => (
              <li key={n.id} className="py-3 flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900">{n.title}</h3>
                  <p className="text-gray-600 text-sm">{n.body}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Type: <span className="font-medium">{n.type}</span>{" "}
                    {n.categoryId && (
                      <span>
                        | Category ID:{" "}
                        <span className="font-medium">{n.categoryId}</span>
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(n)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(n.id)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
