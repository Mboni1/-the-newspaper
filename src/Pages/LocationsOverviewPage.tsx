// src/Pages/LocationsOverviewPage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Search, Filter, MoreHorizontal, X } from "lucide-react";
import api from "../lib/axios";
import toast, { Toaster } from "react-hot-toast";

interface Location {
  id: number;
  title: string;
  latitude: string;
  longitude: string;
  address: string;
  image: string[];
  provinceName: string;
  description?: string;
}

const limit = 3;

const LocationsOverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const [locations, setLocations] = useState<Location[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [provinceFilter, setProvinceFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  // Dropdown & editing
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);

  // Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    latitude: "",
    longitude: "",
    address: "",
    image: "",
    provinceName: "",
    description: "",
  });

  // Image preview
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  // Fetch locations
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await api.get("/location/admin/all");
        const data = res.data.data || [];
        setLocations(data);
        setFilteredLocations(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch locations");
      } finally {
        setLoading(false);
      }
    };
    fetchLocations();
  }, []);

  // Filter + search
  useEffect(() => {
    let filtered = [...locations];

    if (searchTerm) {
      filtered = filtered.filter(
        (loc) =>
          loc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          loc.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (provinceFilter !== "All") {
      filtered = filtered.filter(
        (loc) => loc.provinceName.toLowerCase() === provinceFilter.toLowerCase()
      );
    }

    setFilteredLocations(filtered);
    setCurrentPage(1);
  }, [searchTerm, provinceFilter, locations]);

  const totalPages = Math.ceil(filteredLocations.length / limit);
  const paginatedLocations = filteredLocations.slice(
    (currentPage - 1) * limit,
    currentPage * limit
  );

  // Delete
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this location?")) return;
    try {
      await api.delete(`/location/${id}`);
      setLocations((prev) => prev.filter((loc) => loc.id !== id));
      setFilteredLocations((prev) => prev.filter((loc) => loc.id !== id));
      toast.success("Location deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete location");
    }
  };

  // Open edit modal
  const handleEdit = (loc: Location) => {
    setEditingLocation(loc);
    setFormData({
      title: loc.title,
      address: loc.address,
      latitude: loc.latitude,
      longitude: loc.longitude,
      description: loc.description || "",
      provinceName: loc.provinceName || "",
      image: loc.image[0] || "",
    });
    setImagePreview(loc.image[0] || "");
    setIsEditModalOpen(true);
  };

  // Image change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Save edit
  const handleSave = async () => {
    if (!editingLocation) return;

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("address", formData.address);
      data.append("latitude", formData.latitude);
      data.append("longitude", formData.longitude);
      data.append("province", formData.provinceName);
      data.append("description", formData.description);
      if (imageFile) data.append("image", imageFile);

      const res = await api.patch(`/location/${editingLocation.id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setLocations((prev) =>
        prev.map((loc) => (loc.id === editingLocation.id ? res.data.data : loc))
      );
      setFilteredLocations((prev) =>
        prev.map((loc) => (loc.id === editingLocation.id ? res.data.data : loc))
      );
      setEditingLocation(null);
      setIsEditModalOpen(false);
      setImageFile(null);
      setImagePreview("");
      toast.success("Location updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update location");
    }
  };

  // Save new location
  const handleAdd = async () => {
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("address", formData.address);
      data.append("latitude", formData.latitude);
      data.append("longitude", formData.longitude);
      data.append("province", formData.provinceName);
      data.append("description", formData.description);
      if (imageFile) data.append("image", imageFile);

      const res = await api.post("/location", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setLocations((prev) => [res.data.data, ...prev]);
      setFilteredLocations((prev) => [res.data.data, ...prev]);
      setIsAddModalOpen(false);
      setFormData({
        title: "",
        latitude: "",
        longitude: "",
        address: "",
        image: "",
        provinceName: "",
        description: "",
      });
      setImageFile(null);
      setImagePreview("");
      toast.success("Location added successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add location");
    }
  };

  if (loading) return <p className="p-6 pt-20">Loading locations...</p>;
  if (error) return <p className="p-6 pt-20 text-red-500">{error}</p>;

  return (
    <div className="p-6 pt-20 min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <Link
        to="/dashboard"
        className="text-blue-500 hover:underline inline-block mb-4"
      >
        ← Back to Dashboard
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Locations Overview</h1>
          <p className="text-gray-600">
            Manage and organize all listed locations in one place.
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow-md"
        >
          + New
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 w-full mb-4">
        <div className="flex items-center w-full px-3 py-2 rounded-xl bg-white shadow-sm">
          <Search className="text-gray-300 w-5 h-5 mr-2" />
          <input
            type="text"
            placeholder="Search location"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 outline-none"
          />
        </div>
        <div className="flex items-center relative rounded-lg px-3 py-2">
          <Filter className="text-gray-300 w-5 h-5 mr-2" />
          <select
            value={provinceFilter}
            onChange={(e) => setProvinceFilter(e.target.value)}
            className="rounded-xl px-3 py-2 bg-white shadow-sm"
          >
            <option value="All">All Provinces</option>
            <option value="Northern">Northern</option>
            <option value="Southern">Southern</option>
            <option value="Eastern">Eastern</option>
            <option value="Western">Western</option>
            <option value="Kigali City">Kigali City</option>
          </select>
        </div>
      </div>

      {/* Locations Grid */}
      <div className="p-6 px-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedLocations.length > 0 ? (
          paginatedLocations.map((location) => (
            <div
              key={location.id}
              className="bg-white rounded-2xl shadow-sm p-3 hover:shadow-md transition w-full relative"
            >
              {location.image?.length > 0 && (
                <img
                  src={location.image[0]}
                  alt={location.title}
                  className="w-full h-60 object-cover rounded-lg"
                />
              )}
              <div className="mt-3 flex justify-between items-start">
                <div>
                  <h2 className="font-semibold text-base">{location.title}</h2>
                  <p className="text-gray-600 text-sm">{location.address}</p>
                  {location.description && (
                    <p className="text-gray-600 text-sm line-clamp-3 mt-1">
                      {location.description}
                    </p>
                  )}
                  <p className="text-gray-500 text-sm mt-1">
                    {location.provinceName}
                  </p>
                </div>

                {/* Dropdown */}
                <div className="relative">
                  <button
                    onClick={() =>
                      setOpenDropdownId(
                        openDropdownId === location.id ? null : location.id
                      )
                    }
                    className="text-gray-400 hover:text-gray-700"
                  >
                    <MoreHorizontal />
                  </button>
                  {openDropdownId === location.id && (
                    <div className="absolute right-0 mt-2 w-24 bg-white border border-gray-200 rounded-md shadow z-10">
                      <button
                        onClick={() => handleEdit(location)}
                        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-t-md"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(location.id)}
                        className="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100 rounded-b-md"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No locations found.</p>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Add/Edit Modal */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 bg-gray-300 bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-full max-h-[90vh] p-6 md:p-12 overflow-y-auto rounded-2xl relative flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {isEditModalOpen ? "Edit Location" : "Add New Location"}
              </h2>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setIsEditModalOpen(false);
                  setEditingLocation(null);
                  setImagePreview("");
                  setImageFile(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X />
              </button>
            </div>

            {/* Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Title, Address, Latitude, Longitude, Description */}
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Enter title"
                  className="w-full border rounded-lg px-3 py-2 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  placeholder="Enter address"
                  className="w-full border rounded-lg px-3 py-2 outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Enter description"
                  className="w-full border rounded-lg px-3 py-2 outline-none min-h-[100px]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Latitude
                </label>
                <input
                  type="text"
                  value={formData.latitude}
                  onChange={(e) =>
                    setFormData({ ...formData, latitude: e.target.value })
                  }
                  placeholder="Enter latitude"
                  className="w-full border rounded-lg px-3 py-2 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Longitude
                </label>
                <input
                  type="text"
                  value={formData.longitude}
                  onChange={(e) =>
                    setFormData({ ...formData, longitude: e.target.value })
                  }
                  placeholder="Enter longitude"
                  className="w-full border rounded-lg px-3 py-2 outline-none"
                />
              </div>

              {/* Province + Image Row */}
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 md:col-span-2">
                {/* Province */}
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    Province
                  </label>
                  <select
                    value={formData.provinceName}
                    onChange={(e) =>
                      setFormData({ ...formData, provinceName: e.target.value })
                    }
                    className="w-full border rounded-lg px-3 py-2 outline-none"
                  >
                    <option value="">Select province</option>
                    <option value="Northern">Northern</option>
                    <option value="Southern">Southern</option>
                    <option value="Eastern">Eastern</option>
                    <option value="Western">Western</option>
                    <option value="Kigali City">Kigali City</option>
                  </select>
                </div>

                {/* Image */}
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    Featured Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full border rounded-lg px-3 py-2 outline-none"
                  />
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="mt-2 w-full h-32 object-cover rounded-lg"
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setIsEditModalOpen(false);
                  setEditingLocation(null);
                  setImagePreview("");
                  setImageFile(null);
                }}
                className="px-6 py-2 border rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={isEditModalOpen ? handleSave : handleAdd}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationsOverviewPage;
