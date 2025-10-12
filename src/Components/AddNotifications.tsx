import React, { useState } from "react";
import { CalendarIcon } from "@heroicons/react/24/outline";
import { XIcon } from "lucide-react";

const categories = ["Marketing", "Sales", "Updates"]; // example categories
const types = ["Info", "Warning", "Alert"]; // example types

const AddNotification: React.FC = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [schedule, setSchedule] = useState("");

  const handleCreate = () => {
    const data = { title, message, category, type, schedule };
    console.log("Notification data:", data);
    // TODO: call API to create notification
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        {/* Close button */}
        <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <XIcon className="h-5 w-5" />
        </button>

        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span className="inline-block">🔔</span> Create new Notification
        </h2>

        {/* Title */}
        <label className="block mb-2 font-medium">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter Notification title"
          className="w-full border border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Message */}
        <label className="block mb-2 font-medium">Message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter Notification Message"
          className="w-full border border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Category and Type */}
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <label className="block mb-2 font-medium">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="block mb-2 font-medium">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Type</option>
              {types.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Schedule */}
        <label className="block mb-2 font-medium">Schedule (Optional)</label>
        <div className="relative mb-6">
          <input
            type="date"
            value={schedule}
            onChange={(e) => setSchedule(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <CalendarIcon className="h-5 w-5 absolute right-2 top-2.5 text-gray-400" />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <button
            onClick={() => console.log("Cancel")}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Create Notification
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddNotification;
