import React, { useEffect, useState } from "react";
import { Notification } from "../Pages/NotificationsPage";
import { Loader2 } from "lucide-react";
import api from "../lib/axios";

export interface AddNotificationProps {
  onClose: () => void;
  onSave: (data: Notification) => void;
  initialData?: Notification;
}

const AddNotifications: React.FC<AddNotificationProps> = ({
  onClose,
  onSave,
  initialData,
}) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [body, setBody] = useState(initialData?.body || "");
  const [category, setCategory] = useState(initialData?.category || "");
  const [type, setType] = useState<Notification["type"]>(
    initialData?.type || "SYSTEM"
  );
  const [loading, setLoading] = useState(false);

  // categories
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const [loadingCategories, setLoadingCategories] = useState(true);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/category?limit=1000");
      const data = res.data.data || res.data;
      const filtered = data.filter((cat: any) => !cat.isDoc);

      setCategories(filtered);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setBody(initialData.body);
      setCategory(initialData.category);
      setType(initialData.type);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !body.trim() || !category.trim()) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);

    const payload: Notification = {
      id: initialData?.id || 0,
      title,
      body,
      category,
      type,
    };

    try {
      await onSave(payload);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 flex flex-col gap-4 rounded-2xl"
    >
      <h2 className="text-xl font-bold text-gray-800">
        {initialData ? "Edit Notification" : "Add Notification"}
      </h2>

      {/* Title */}
      <div>
        <label className="block mb-2 font-medium text-gray-700">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded-xl px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Enter title"
        />
      </div>

      {/* Body */}
      <div>
        <label className="block mb-2 font-medium text-gray-700">Body</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="w-full border rounded-xl px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Enter body text"
          rows={3}
        />
      </div>

      {/* Category Dropdown (from API) */}
      <div>
        <label className="block mb-2 font-medium text-gray-700">Category</label>

        {loadingCategories ? (
          <p className="text-gray-500 text-sm">Loading categories...</p>
        ) : (
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border rounded-xl px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Type Dropdown */}
      <div>
        <label className="block mb-2 font-medium text-gray-700">Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as Notification["type"])}
          className="w-full border rounded-xl px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="SYSTEM">System</option>
          <option value="ALERT">Alert</option>
          <option value="REMINDER">Reminder</option>
          <option value="PROMOTION">Promotion</option>
        </select>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 mt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center gap-2"
        >
          {loading && <Loader2 className="animate-spin" size={18} />}
          {initialData ? "Update" : "Save"}
        </button>
      </div>
    </form>
  );
};

export default AddNotifications;
