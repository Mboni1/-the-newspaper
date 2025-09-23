// src/Pages/LocationsOverviewPage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Search,
  Filter,
  MoreHorizontal,
  X,
  MapPin,
  Loader2,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import Description from "../Components/Description";
import Pagination from "../Components/Pagination";
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
  provinceName: string;
  description?: string;
}

const limit = 6;

const LocationsOverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [provinceFilter, setProvinceFilter] = useState("All");
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState(0);

  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    latitude: "",
    longitude: "",
    address: "",
    image: "",
    provinceName: "",
    description: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => setPage(1), [searchTerm]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let data;
        if (searchTerm.trim()) {
          data = await searchLocations(searchTerm, page, limit);
        } else {
          data = await getLocations(page, limit);
        }
        setLocations(data?.data || []);
        setTotal(data?.total || 0);
      } catch (err: any) {
        setError(err.message || "Failed to fetch locations");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page, searchTerm]);

  const totalPages = Math.ceil(total / limit);

  const resetForm = () => {
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
    setEditingLocation(null);
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this location?")) return;
    try {
      await deleteLocation(id);
      setLocations((prev) => prev.filter((loc) => loc.id !== id));
      toast.success("Location deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete location");
    }
  };

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("address", formData.address);
      data.append("latitude", formData.latitude);
      data.append("longitude", formData.longitude);
      data.append("province", formData.provinceName);
      data.append("description", formData.description);
      if (imageFile) data.append("image", imageFile);

      if (isEditModalOpen && editingLocation) {
        const res = await updateLocation(editingLocation.id, data);
        setLocations((prev) =>
          prev.map((loc) =>
            loc.id === editingLocation.id ? res.data.data : loc
          )
        );
        toast.success("Location updated successfully!");
      } else if (isAddModalOpen) {
        const res = await addLocation(data);
        setLocations((prev) => [res.data.data, ...prev]);
        toast.success("Location added successfully!");
      }

      resetForm();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save location");
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
        {locations.length > 0 ? (
          locations.map((location) => (
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

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      {/* Add/Edit Modal */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-4xl p-6 rounded-xl relative overflow-y-auto max-h-screen">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {isEditModalOpen ? "Edit Location" : "Add New Location"}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700"
              >
                <X />
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

              {/* Description */}
              <Description
                value={formData.description}
                onChange={(val) =>
                  setFormData({ ...formData, description: val })
                }
                placeholder="Enter location description..."
              />

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
                    value={formData.provinceName}
                    onChange={(e) =>
                      setFormData({ ...formData, provinceName: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none"
                  >
                    <option value="">Select province</option>
                    <option value="Northern">Northern</option>
                    <option value="Southern">Southern</option>
                    <option value="Eastern">Eastern</option>
                    <option value="Western">Western</option>
                    <option value="Kigali City">Kigali City</option>
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
