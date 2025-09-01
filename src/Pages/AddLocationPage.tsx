import React, { useState } from "react";
import { Link } from "react-router-dom";

const AddLocation: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreview(URL.createObjectURL(file)); // generate preview
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConfirming) {
      alert("Please confirm before publishing.");
      return;
    }

    console.log({ title, description, image });
    // Send API request here...
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 pt-20">
      <Link
        to="/locations-overview"
        className="text-blue-600 hover:underline inline-block mb-4"
      >
        ← Back to Location
      </Link>
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-6">Add New Location</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-lg font-semibold mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-lg font-semibold mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded-md px-4 py-2 h-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            ></textarea>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-lg font-semibold mb-2">
              Add Image
            </label>
            <div className="border-2 border-dashed border-gray-400 rounded-md p-6 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="fileUpload"
              />
              <label
                htmlFor="fileUpload"
                className="cursor-pointer text-blue-600 font-medium"
              >
                {image ? "Change Image" : "Click to upload image"}
              </label>
            </div>

            {/* Image Preview */}
            {preview && (
              <div className="mt-4">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-60 object-cover rounded-md border"
                />
              </div>
            )}
          </div>

          {/* Confirm Button */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsConfirming(!isConfirming)}
              className={`px-4 py-2 rounded-md border ${
                isConfirming
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-gray-200 text-gray-700 border-gray-300"
              }`}
            >
              {isConfirming ? "Confirmed ✔" : "Confirm"}
            </button>

            {/* Publish */}
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            >
              Add Location
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLocation;
