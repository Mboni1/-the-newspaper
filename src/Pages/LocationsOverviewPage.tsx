import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Search,
  Filter,
  MoreHorizontal,
  X,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import Description from "../Components/Description";
import Pagination from "../Components/Pagination";
import api from "../lib/axios";
import MultiImageUpload from "../Components/MultiImageUpload";
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
  LocationImage: { id: number; url: string; locationId: number }[];
  provinceId: number;
  provinceName: string;
  description?: string;
  visits?: number;
}

const provinces = [
  { id: 1, name: "North Province" },
  { id: 2, name: "South Province" },
  { id: 3, name: "East Province" },
  { id: 4, name: "West Province" },
  { id: 5, name: "Kigali City" },
];

const limit = 9;

const LocationsOverviewPage: React.FC = () => {
  const navigate = useNavigate();

  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [provinceFilter, setProvinceFilter] = useState<string | undefined>();
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

  // Modal & Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    latitude: "",
    longitude: "",
    address: "",
    provinceId: "",
    description: "",
    locationImage: [] as File[],
  });
  const [imagePreview, setImagePreview] = useState<string[]>([]);

  // Carousel indexes
  const [carouselIndexes, setCarouselIndexes] = useState<{
    [key: number]: number;
  }>({});

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setPage(1);
      setSearchQuery(searchInput.trim());
    }, 500);
    return () => clearTimeout(handler);
  }, [searchInput]);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      setError(null);

      let data;
      if (provinceFilter) {
        const encodedProvince = encodeURIComponent(provinceFilter);
        const res = await api.get(`/location/${encodedProvince}`);
        data = res.data;
      } else if (searchQuery) {
        data = await searchLocations(searchQuery, page, limit);
      } else {
        data = await getLocations(page, limit);
      }

      const locationsWithImages = (data?.data || []).map((loc: Location) => ({
        ...loc,
        LocationImage: loc.LocationImage || [],
      }));

      const sorted = locationsWithImages.sort(
        (a, b) => (b.visits || 0) - (a.visits || 0)
      );

      setLocations(sorted);

      const indexes: { [key: number]: number } = {};
      sorted.forEach((loc) => (indexes[loc.id] = 0));
      setCarouselIndexes(indexes);

      setTotal(data?.total || sorted.length);
    } catch (err: any) {
      console.error(err);
      setError("Failed to fetch locations");
      setLocations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, [page, searchQuery, provinceFilter]);

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
      locationImage: [],
    });

    // ✅ Pass only image URLs to preview
    setImagePreview(loc.LocationImage?.map((img) => img.url) || []);
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

  const resetForm = () => {
    setFormData({
      title: "",
      latitude: "",
      longitude: "",
      address: "",
      provinceId: "",
      description: "",
      locationImage: [],
    });
    setImagePreview([]);
    setEditingLocation(null);
    setIsModalOpen(false);
  };

  const handleSave = async () => {
    try {
      if (!formData.title.trim()) {
        toast.error("Title is required");
        return;
      }
      if (!formData.provinceId) {
        toast.error("Province is required");
        return;
      }

      const data = new FormData();
      data.append("title", formData.title);
      data.append("address", formData.address);
      data.append("latitude", Number(formData.latitude).toString());
      data.append("longitude", Number(formData.longitude).toString());
      data.append("provinceId", Number(formData.provinceId).toString());

      const selectedProvince = provinces.find(
        (p) => p.id.toString() === formData.provinceId
      );
      data.append("provinceName", selectedProvince?.name || "");
      data.append("description", formData.description || "");

      formData.locationImage.forEach((file) => data.append("images", file));

      if (editingLocation) {
        await updateLocation(editingLocation.id, data);
        toast.success("Location updated successfully!");
      } else {
        await addLocation(data);
        toast.success("Location added successfully!");
      }

      resetForm();
      fetchLocations();
    } catch (err: any) {
      console.error("Save location error:", err.response || err);
      toast.error(err.response?.data?.message || "Failed to save location");
    }
  };

  const totalPages = Math.ceil(total / limit);

  const nextImage = (locId: number, length: number) => {
    setCarouselIndexes((prev) => ({
      ...prev,
      [locId]: (prev[locId] + 1) % length,
    }));
  };

  const prevImage = (locId: number, length: number) => {
    setCarouselIndexes((prev) => ({
      ...prev,
      [locId]: (prev[locId] - 1 + length) % length,
    }));
  };

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

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search locations..."
            className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div className="relative flex items-center bg-white border border-gray-200 rounded-lg px-3 py-2 sm:w-1/3">
          <Filter className="text-gray-400 w-5 h-5 mr-2" />
          <select
            value={provinceFilter ?? ""}
            onChange={(e) => {
              const value = e.target.value || undefined;
              setProvinceFilter(value);
              setPage(1);
            }}
            className="flex-1 outline-none bg-transparent"
          >
            <option value="">All Provinces</option>
            {provinces.map((p) => (
              <option key={p.id} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <p className="text-center p-8">Loading locations...</p>
      ) : locations.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.map((loc) => (
            <div
              key={loc.id}
              className="bg-white rounded-2xl shadow-sm p-3 hover:shadow-md transition relative"
            >
              {loc.LocationImage?.length > 0 && (
                <div className="relative w-full h-60 rounded-lg overflow-hidden">
                  <img
                    src={loc.LocationImage[carouselIndexes[loc.id]].url}
                    alt={loc.title}
                    className="w-full h-full object-cover"
                  />

                  {loc.LocationImage.length > 1 && (
                    <>
                      <button
                        onClick={() =>
                          prevImage(loc.id, loc.LocationImage.length)
                        }
                        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white/70 rounded-full p-1 hover:bg-white"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() =>
                          nextImage(loc.id, loc.LocationImage.length)
                        }
                        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white/70 rounded-full p-1 hover:bg-white"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>
              )}

              <div className="mt-3 flex justify-between items-start">
                <div>
                  <h2 className="font-semibold text-base">{loc.title}</h2>
                  <p className="text-gray-600 text-sm">{loc.address}</p>
                  {loc.description && (
                    <p className="text-gray-600 text-sm line-clamp-3 mt-1">
                      {loc.description}
                    </p>
                  )}
                  <p className="text-gray-500 text-sm mt-1">
                    {loc.provinceName}
                  </p>
                </div>

                <div className="relative">
                  <button
                    onClick={() =>
                      setOpenDropdownId(
                        openDropdownId === loc.id ? null : loc.id
                      )
                    }
                    className="text-gray-400 hover:text-gray-700"
                  >
                    <MoreHorizontal />
                  </button>
                  {openDropdownId === loc.id && (
                    <div className="absolute right-6 -mt-10 translate-y-0 bg-white border border-gray-200 rounded-md shadow z-10">
                      <button
                        onClick={() => handleEdit(loc)}
                        className="w-full px-2 py-1 text-left text-gray-900 hover:bg-gray-100 rounded-t-md"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(loc.id)}
                        className="w-full px-2 py-1 text-left text-red-600 hover:bg-gray-100 rounded-b-md"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-8">No locations found.</p>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-50 bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-full max-h-[90vh] p-6 md:p-12 overflow-y-auto rounded-2xl relative flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingLocation ? "Edit Location" : "Add New Location"}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            {/* Form */}
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

              <div className="flex flex-col md:flex-row gap-6 md:col-span-2">
                <div className="flex-1">
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
                    Upload Images
                  </label>

                  {/* ✅ Use the MultiImageUpload component */}
                  <MultiImageUpload
                    existingImages={imagePreview}
                    onChange={(files) =>
                      setFormData({ ...formData, locationImage: files })
                    }
                  />
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
