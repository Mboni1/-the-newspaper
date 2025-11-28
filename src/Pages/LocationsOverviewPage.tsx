// src/Pages/LocationsOverviewPage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Search,
  MoreHorizontal,
  X,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import Description from "../Components/Description";
import Pagination from "../Components/Pagination";
import MultiImageUpload from "../Components/MultiImageUpload";
import {
  getLocations,
  searchLocations,
  deleteLocation,
  updateLocation,
  addLocation,
  getLocationsByProvince,
} from "../Services/locationService";

interface Location {
  id: number;
  title: string;
  latitude: string;
  longitude: string;
  address: string;
  LocationImage: string[];
  provinceName: string;
  description?: string;
}

const provinces = [
  { name: "North Province" },
  { name: "South Province" },
  { name: "East Province" },
  { name: "West Province" },
  { name: "Kigali City" },
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
    provinceName: "",
    description: "",
    locationImage: [] as File[],
  });
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [carouselIndexes, setCarouselIndexes] = useState<{
    [key: number]: number;
  }>({});

  // --- Debounce Search ---
  useEffect(() => {
    const handler = setTimeout(() => {
      setPage(1);
      setSearchQuery(searchInput.trim());
    }, 500);
    return () => clearTimeout(handler);
  }, [searchInput]);

  // --- Fetch Locations ---
  const fetchLocations = async () => {
    try {
      setLoading(true);
      setError(null);

      let data;
      if (provinceFilter) {
        data = await getLocationsByProvince(provinceFilter);
      } else if (searchQuery) {
        data = await searchLocations(searchQuery, page, limit);
      } else {
        data = await getLocations(page, limit);
      }

      const locationsWithImages: Location[] = (data?.data || []).map(
        (loc: any) => ({
          ...loc,
          LocationImage:
            loc.LocationImage?.map((img: any) =>
              img.url?.startsWith("http")
                ? img.url
                : `${import.meta.env.VITE_API_URL}${img.url}`
            ) || [],
          provinceName: loc.provinceName || "",
        })
      );

      setLocations(locationsWithImages);
      setTotal(data?.total || locationsWithImages.length);

      const indexes: { [key: number]: number } = {};
      locationsWithImages.forEach((loc) => (indexes[loc.id] = 0));
      setCarouselIndexes(indexes);
    } catch (err) {
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

  // --- Reset Form ---
  const resetForm = () => {
    setFormData({
      title: "",
      latitude: "",
      longitude: "",
      address: "",
      provinceName: "",
      description: "",
      locationImage: [],
    });
    setImagePreview([]);
    setEditingLocation(null);
    setIsModalOpen(false);
  };

  const handleAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleEdit = (loc: Location) => {
    setEditingLocation(loc);
    setFormData({
      title: loc.title || "",
      latitude: loc.latitude || "",
      longitude: loc.longitude || "",
      address: loc.address || "",
      provinceName: loc.provinceName || "",
      description: loc.description || "",
      locationImage: [],
    });
    setImagePreview(loc.LocationImage || []);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this location?")) return;
    try {
      await deleteLocation(id);
      toast.success("Location deleted successfully!");
      fetchLocations();
    } catch {
      toast.error("Failed to delete location");
    }
  };

  // --- Save Location ---
  const handleSave = async () => {
    try {
      if (!formData.title.trim()) return toast.error("Title is required");
      if (!formData.address.trim()) return toast.error("Address is required");
      if (!formData.description.trim())
        return toast.error("Description is required");
      if (!formData.latitude.trim()) return toast.error("Latitude is required");
      if (!formData.longitude.trim())
        return toast.error("Longitude is required");
      if (!formData.provinceName.trim())
        return toast.error("Province is required");

      const data = new FormData();
      data.append("title", formData.title);
      data.append("address", formData.address);
      data.append("description", formData.description);
      data.append("latitude", formData.latitude);
      data.append("longitude", formData.longitude);
      data.append("provinceName", formData.provinceName);

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
        className="text-blue-500 hover:underline mb-4 inline-block"
      >
        ← Back to Dashboard
      </Link>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Locations Overview</h1>
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
            className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 outline-none"
          />
        </div>
        <select
          value={provinceFilter ?? ""}
          onChange={(e) => setProvinceFilter(e.target.value || undefined)}
          className="border px-3 py-2 rounded-lg"
        >
          <option value="">All Provinces</option>
          {provinces.map((p) => (
            <option key={p.name} value={p.name}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* Locations Grid */}
      {loading ? (
        <p className="text-center p-8">Loading...</p>
      ) : locations.length === 0 ? (
        <p className="text-center text-gray-500 mt-8">No locations found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.map((loc) => (
            <div
              key={loc.id}
              className="bg-white rounded-2xl shadow-sm p-3 hover:shadow-md transition relative"
            >
              {loc.LocationImage.length > 0 && (
                <div className="relative w-full h-60 rounded-lg overflow-hidden">
                  <img
                    src={loc.LocationImage[carouselIndexes[loc.id]]}
                    alt={loc.title}
                    className="w-full h-full object-cover"
                  />
                  {loc.LocationImage.length > 1 && (
                    <>
                      <button
                        onClick={() =>
                          prevImage(loc.id, loc.LocationImage.length)
                        }
                        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white/70 rounded-full p-1"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() =>
                          nextImage(loc.id, loc.LocationImage.length)
                        }
                        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white/70 rounded-full p-1"
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
                    <div className="absolute right-6 -mt-10 bg-white border border-gray-200 rounded-md shadow z-10">
                      <button
                        onClick={() => handleEdit(loc)}
                        className="w-full px-2 py-1 text-left hover:bg-gray-100 rounded-t-md"
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
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-50 bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-full max-h-[90vh] p-6 md:p-12 overflow-y-auto rounded-2xl relative flex flex-col">
            <button
              onClick={resetForm}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X />
            </button>

            <h2 className="text-xl font-bold mb-4">
              {editingLocation ? "Edit Location" : "Add Location"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg"
                />
              </div>

              <div>
                <label className="block mb-1">Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg"
                />
              </div>

              <div>
                <label className="block mb-1">Latitude</label>
                <input
                  type="text"
                  value={formData.latitude}
                  onChange={(e) =>
                    setFormData({ ...formData, latitude: e.target.value })
                  }
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg"
                />
              </div>

              <div>
                <label className="block mb-1">Longitude</label>
                <input
                  type="text"
                  value={formData.longitude}
                  onChange={(e) =>
                    setFormData({ ...formData, longitude: e.target.value })
                  }
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block mb-1">Description</label>
                <Description
                  value={formData.description || ""}
                  onChange={(content) =>
                    setFormData({ ...formData, description: content })
                  }
                />
              </div>

              <div>
                <label className="block mb-1">Province</label>
                <select
                  value={formData.provinceName}
                  onChange={(e) =>
                    setFormData({ ...formData, provinceName: e.target.value })
                  }
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg"
                >
                  <option value="">Select Province</option>
                  {provinces.map((p) => (
                    <option key={p.name} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1">Upload Images</label>
                <MultiImageUpload
                  existingImages={imagePreview}
                  onChange={(files) =>
                    setFormData({ ...formData, locationImage: files })
                  }
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={resetForm}
                className="px-6 py-2 border border-gray-300 rounded-lg"
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
