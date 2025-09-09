import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Search, Filter, MoreHorizontal, Edit, Trash2, X } from "lucide-react";
import api from "../lib/axios";

interface Location {
  id: number;
  title: string;
  name: string;
  location: string;
  district: string;
  placeImg: string[];
  province?: string;
}

const LocationsOverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const [locations, setLocations] = useState<Location[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [provinceFilter, setProvinceFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 3;

  // Dropdown & editing state
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    district: "",
    province: "",
    placeImg: "",
  });

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await api.get("/location/admin/all");
        const data = res.data.data || [];
        setLocations(data);
        setFilteredLocations(data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || "Failed to fetch locations");
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
          loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          loc.district.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (provinceFilter !== "All") {
      filtered = filtered.filter(
        (loc) => loc.province?.toLowerCase() === provinceFilter.toLowerCase()
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

  // Handle delete
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this location?")) return;
    try {
      await api.delete(`/location/${id}`);
      setLocations((prev) => prev.filter((loc) => loc.id !== id));
      setFilteredLocations((prev) => prev.filter((loc) => loc.id !== id));
    } catch (err: any) {
      console.error(err);
      alert("Failed to delete location");
    }
  };

  // Open edit form
  const handleEdit = (loc: Location) => {
    setEditingLocation(loc);
    setFormData({
      title: loc.title,
      location: loc.location,
      district: loc.district,
      province: loc.province || "",
      placeImg: loc.placeImg[0] || "",
    });
  };

  // Save edit
  const handleSave = async () => {
    if (!editingLocation) return;
    try {
      const res = await api.put(`/location/${editingLocation.id}`, {
        title: formData.title,
        location: formData.location,
        district: formData.district,
        province: formData.province,
        placeImg: [formData.placeImg],
      });

      setLocations((prev) =>
        prev.map((loc) => (loc.id === editingLocation.id ? res.data.data : loc))
      );
      setFilteredLocations((prev) =>
        prev.map((loc) => (loc.id === editingLocation.id ? res.data.data : loc))
      );
      setEditingLocation(null);
    } catch (err: any) {
      console.error(err);
      alert("Failed to update location");
    }
  };

  if (loading) return <p className="p-6 pt-20">Loading locations...</p>;
  if (error) return <p className="p-6 pt-20 text-red-500">{error}</p>;

  return (
    <div className="p-6 pt-20 min-h-screen bg-gray-50">
      <Link
        to="/dashboard"
        className="text-blue-600 hover:underline inline-block mb-4"
      >
        ← Back to Dashboard
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Locations Overview</h1>
          <p className="text-gray-600">
            Detailed insights into visitor activities across Rwanda&apos;s
            destinations
          </p>
        </div>
        <button
          onClick={() => navigate("/add-location")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow-md"
        >
          + New
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 w-full mb-4">
        <div className="flex items-center w-full px-3 py-2 rounded-xl bg-white shadow-sm">
          <Search className="text-gray-400 w-5 h-5 mr-2" />
          <input
            type="text"
            placeholder="Search location"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 outline-none"
          />
        </div>
        <div className="flex items-center relative rounded-lg px-3 py-2">
          <Filter className="text-gray-400 w-5 h-5 mr-2" />
          <select
            value={provinceFilter}
            onChange={(e) => setProvinceFilter(e.target.value)}
            className="flex flex-col rounded-xl px-3 py-2 bg-white shadow-sm"
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
              {location.placeImg?.length > 0 && (
                <img
                  src={location.placeImg[0]}
                  alt={location.name}
                  className="w-full h-70 object-cover rounded-lg"
                />
              )}
              <div className="mt-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="font-semibold text-base">
                      {location.title}
                    </h2>
                    <p className="text-gray-500 text-sm">{location.location}</p>
                  </div>

                  {/* MoreHorizontal Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() =>
                        setOpenDropdownId(
                          openDropdownId === location.id ? null : location.id
                        )
                      }
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <MoreHorizontal />
                    </button>

                    {openDropdownId === location.id && !editingLocation && (
                      <div className="absolute right-0 mt-2 w-32 bg-white border rounded-md shadow-lg z-10">
                        <button
                          onClick={() => handleEdit(location)}
                          className="flex items-center w-full px-3 py-2 text-left hover:bg-gray-100"
                        >
                          <Edit className="w-4 h-4 mr-2" /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(location.id)}
                          className="flex items-center w-full px-3 py-2 text-left hover:bg-gray-100 text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Edit form */}
                {editingLocation?.id === location.id && (
                  <div className="mt-3 border-t pt-3 space-y-2">
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="Title"
                      className="w-full border rounded-lg px-3 py-2 outline-none"
                    />
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      placeholder="Location"
                      className="w-full border rounded-lg px-3 py-2 outline-none"
                    />
                    <input
                      type="text"
                      value={formData.district}
                      onChange={(e) =>
                        setFormData({ ...formData, district: e.target.value })
                      }
                      placeholder="District"
                      className="w-full border rounded-lg px-3 py-2 outline-none"
                    />
                    <input
                      type="text"
                      value={formData.province}
                      onChange={(e) =>
                        setFormData({ ...formData, province: e.target.value })
                      }
                      placeholder="Province"
                      className="w-full border rounded-lg px-3 py-2 outline-none"
                    />
                    <input
                      type="text"
                      value={formData.placeImg}
                      onChange={(e) =>
                        setFormData({ ...formData, placeImg: e.target.value })
                      }
                      placeholder="Image URL"
                      className="w-full border rounded-lg px-3 py-2 outline-none"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleSave}
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingLocation(null)}
                        className="bg-gray-300 px-4 py-2 rounded flex items-center gap-1"
                      >
                        <X className="w-4 h-4" /> Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Badges */}
                <div className="flex gap-2 mt-2 flex-wrap">
                  <span className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-md">
                    {location.district}
                  </span>
                  {location.province && (
                    <span className="bg-green-50 text-green-600 text-xs px-2 py-1 rounded-md">
                      {location.province}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">No locations found.</p>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-blue-600 rounded disabled:opacity-50"
          >
            Prev.
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-blue-600 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default LocationsOverviewPage;
