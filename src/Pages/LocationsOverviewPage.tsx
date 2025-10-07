// src/pages/LocationsOverviewPage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Search, Filter, MoreHorizontal, X } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import Description from "../Components/Description";
import Pagination from "../Components/Pagination";
import SearchInput from "../Components/SearchInput";

import {
  getLocations,
  searchLocations,
  deleteLocation,
  updateLocation,
  addLocation,
} from "../Services/locationService";

interface Location {
  id: number;
  title: string;
  latitude: string;
  longitude: string;
  address: string;
  image: string[];
  provinceId: number;
  provinceName: string;
  description?: string;
  visits?: number;
}

const provinces = [
  { id: 1, name: "Northern" },
  { id: 2, name: "Southern" },
  { id: 3, name: "Eastern" },
  { id: 4, name: "Western" },
  { id: 5, name: "Kigali City" },
];

const limit = 9;

const LocationsOverviewPage: React.FC = () => {
  const navigate = useNavigate();

  // State
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [provinceFilter, setProvinceFilter] = useState<number | undefined>();
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    latitude: "",
    longitude: "",
    address: "",
    provinceId: "",
    description: "",
    image: "" as any,
  });
  const [imagePreview, setImagePreview] = useState<string>("");

  // Fetch locations function
  const fetchLocations = async () => {
    try {
      setLoading(true);
      setError(null);

      let data;
      if (searchInput.trim().length >= 2 || provinceFilter) {
        // Search/filter
        data = await searchLocations(
          searchInput.trim(),
          page,
          limit,
          provinceFilter
        );
      } else {
        // Fetch all
        data = await getLocations(page, limit, provinceFilter);
      }

      const sorted = data?.data?.sort(
        (a: Location, b: Location) => (b.visits || 0) - (a.visits || 0)
      );
      setLocations(sorted || []);
      setTotal(data?.total || 0);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to fetch locations");
      setLocations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, [searchInput, provinceFilter, page]);

  // Modal handlers
  const handleAdd = () => {
    resetForm();
    setEditingLocation(null);
    setIsModalOpen(true);
  };

  const handleEdit = (loc: Location) => {
    setEditingLocation(loc);
    setFormData({
      title: loc.title,
      latitude: loc.latitude,
      longitude: loc.longitude,
      address: loc.address,
      provinceId: loc.provinceId.toString(),
      description: loc.description || "",
      image: loc.image[0] || "",
    });
    setImagePreview(loc.image[0] || "");
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this location?")) return;
    try {
      await deleteLocation(id);
      toast.success("Location deleted successfully!");
      fetchLocations();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete location");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      latitude: "",
      longitude: "",
      address: "",
      provinceId: "",
      description: "",
      image: "",
    });
    setImagePreview("");
    setEditingLocation(null);
    setIsModalOpen(false);
  };

  const handleSave = async () => {
    try {
      if (!formData.title.trim()) {
        toast.error("Title is required");
        return;
      }

      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) data.append(key, value as any);
      });

      if (editingLocation) {
        await updateLocation(editingLocation.id, data);
        toast.success("Location updated successfully!");
      } else {
        await addLocation(data);
        toast.success("Location added successfully!");
      }

      resetForm();
      fetchLocations();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save location");
    }
  };

  const totalPages = Math.ceil(total / limit);

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

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Locations Overview</h1>
          <p className="text-gray-600">
            Manage and organize all listed locations.
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow-md"
        >
          + New
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 w-full mb-4">
        <div className="w-full sm:w-2/3">
          <SearchInput
            value={searchInput}
            onSearch={setSearchInput}
            placeholder="Search locations..."
          />
        </div>
        <div className="flex items-center relative rounded-xl px-3 py-2 bg-white shadow-sm sm:w-1/3">
          <Filter className="text-gray-400 w-5 h-5 mr-2" />
          <select
            value={provinceFilter ?? ""}
            onChange={(e) => {
              const value = e.target.value ? Number(e.target.value) : undefined;
              setProvinceFilter(value);
              setPage(1);
            }}
            className="flex-1 outline-none bg-transparent"
          >
            <option value="">All Provinces</option>
            {provinces.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Locations Grid */}
      <div className="p-6 px-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {locations.length > 0 ? (
          locations.map((location) => (
            <div
              key={location.id}
              className="bg-white rounded-2xl shadow-sm p-3 hover:shadow-md transition relative"
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
                    <div className="absolute right-6 -mt-10 translate-y-0 w-fit bg-white border border-gray-200 rounded-md shadow z-10">
                      <button
                        onClick={() => handleEdit(location)}
                        className="w-full px-2 py-1 text-left text-gray-900 hover:bg-gray-400 rounded-t-md"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(location.id)}
                        className="w-full px-2 py-1 text-left text-red-600 hover:bg-gray-400 rounded-b-md"
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
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-white bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-full max-h-[90vh] p-6 md:p-12 overflow-y-auto rounded-2xl relative flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingLocation ? "Edit Location" : "Add New Location"}{" "}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Enter title"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none"
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
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <Description
                  value={formData.description}
                  onChange={(content) =>
                    setFormData({ ...formData, description: content })
                  }
                  placeholder="Description..."
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
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none"
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
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none"
                />
              </div>
              <div className="flex flex-col md:flex-row md:items-stretch gap-4 md:gap-6 md:col-span-2">
                <div className="flex-1 flex flex-col">
                  <label className="block text-sm font-medium mb-1">
                    Province
                  </label>
                  <select
                    value={formData.provinceId}
                    onChange={(e) =>
                      setFormData({ ...formData, provinceId: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none"
                  >
                    <option value="">Select province</option>
                    {provinces.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    Featured Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-fit border border-gray-200 rounded-lg px-3 py-2 outline-none"
                  />
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="mt-2 w-full h-80 object-cover rounded-lg"
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={resetForm}
                className="px-6 py-2 border border-gray-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
              >
                {editingLocation ? "Save Changes" : "Add Location"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationsOverviewPage;
