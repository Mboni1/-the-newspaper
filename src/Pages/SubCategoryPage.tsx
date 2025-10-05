// src/Pages/SubCategoryPage.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, X } from "lucide-react";
import api from "../lib/axios";
import toast, { Toaster } from "react-hot-toast";
import Description from "../Components/Description";
import Pagination from "../Components/Pagination";
import SearchInput from "../Components/SearchInput";

interface Business {
  id: number;
  title: string;
  description: string;
  workingHours: string;
  location: string;
  businessEmail: string;
  phoneNumber: string;
  subCategoryName: string;
  latitude: string;
  longitude: string;
  placeImg: string;
}

const limit = 1;

const SubCategoryPage: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);
  const [page, setPage] = useState(1);
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    workingHours: "",
    location: "",
    businessEmail: "",
    phoneNumber: "",
    subCategoryName: name || "",
    latitude: "",
    longitude: "",
    placeImg: "",
  });

  const [imagePreview, setImagePreview] = useState<string>("");

  // Fetch businesses (search integrated)
  useEffect(() => {
    if (!name) return;

    let active = true;
    let debounceTimer: ReturnType<typeof setTimeout>;

    const fetchBusinesses = async () => {
      try {
        // Ntitwongere gukoresha setLoading(true) buri gihe
        // ahubwo tuyikoreshe rimwe gusa ku initial load
        if (!search.trim()) setLoading(true);

        debounceTimer = setTimeout(async () => {
          const endpoint = search.trim()
            ? "/place-item/search/all"
            : `/place-item/subcategory/${name}`;

          const params = search.trim()
            ? { query: search, subCategoryName: name }
            : {};

          const res = await api.get(endpoint, { params });

          if (active) {
            setBusinesses(Array.isArray(res.data.data) ? res.data.data : []);
            setLoading(false);
          }
        }, 400);
      } catch (err) {
        console.error("Error fetching businesses:", err);
        if (active) {
          toast.error("Failed to fetch businesses!");
          setLoading(false);
        }
      }
    };

    fetchBusinesses();

    return () => {
      active = false;
      clearTimeout(debounceTimer);
    };
  }, [name, search]);

  // Modal handlers
  const handleAdd = () => {
    setEditingBusiness(null);
    setFormData({
      title: "",
      description: "",
      workingHours: "",
      location: "",
      businessEmail: "",
      phoneNumber: "",
      subCategoryName: name || "",
      latitude: "",
      longitude: "",
      placeImg: "",
    });
    setImagePreview("");
    setIsModalOpen(true);
  };

  const handleEdit = (biz: Business, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingBusiness(biz);
    setFormData({
      title: biz.title || "",
      description: biz.description || "",
      workingHours: biz.workingHours || "",
      location: biz.location || "",
      businessEmail: biz.businessEmail || "",
      phoneNumber: biz.phoneNumber || "",
      subCategoryName: biz.subCategoryName || name || "",
      latitude: biz.latitude || "",
      longitude: biz.longitude || "",
      placeImg: biz.placeImg || "",
    });
    setImagePreview(biz.placeImg || "");
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.delete(`/place-item/${id}`);
      setBusinesses(businesses.filter((b) => b.id !== id));
      toast.success("Business deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete business");
    }
  };

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({ ...formData, placeImg: file as any });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Save business (add or edit)
  const handleSave = async () => {
    try {
      if (!formData.title.trim()) {
        toast.error("Title is required");
        return;
      }

      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, value as any);
      });

      if (editingBusiness) {
        const res = await api.patch(
          `/place-item/${editingBusiness.id}`,
          submitData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        setBusinesses(
          businesses.map((b) =>
            b.id === editingBusiness.id ? res.data.data : b
          )
        );
        toast.success("Business updated successfully");
      } else {
        const res = await api.post(`/place-item`, submitData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setBusinesses([...businesses, res.data.data]);
        toast.success("Business added successfully");
      }

      setIsModalOpen(false);
      setEditingBusiness(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save business");
    }
  };

  // Pagination
  const totalPages = Math.ceil(businesses.length / limit);
  const paginatedBusinesses = businesses.slice(
    (page - 1) * limit,
    page * limit
  );

  if (loading) return <p className="p-8">Loading businesses...</p>;
  if (!businesses.length)
    return <p className="p-8 text-red-500">No businesses found.</p>;

  return (
    <div className="p-6 pt-20 max-w-3xl mx-auto">
      <Toaster position="top-right" />

      <button
        onClick={() => navigate(-1)}
        className="text-blue-600 hover:underline"
      >
        ← Back
      </button>

      <div className="bg-white p-6 mt-6 rounded-2xl shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Manage Businesses</h2>
          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-3 py-1 rounded-xl flex items-center hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-1" /> New
          </button>
        </div>

        <SearchInput
          value={search}
          onSearch={(val) => setSearch(val)}
          placeholder="Search Business..."
        />

        <div className="space-y-4 mt-4">
          {paginatedBusinesses.map((biz) => (
            <div
              key={biz.id}
              className="flex justify-between items-center bg-gray-50 rounded-2xl shadow p-4 cursor-pointer hover:bg-gray-100 transition mt-6"
            >
              <div className="flex-1 pr-4">
                <h3 className="font-semibold text-lg">{biz.title}</h3>
                <div className="flex space-x-4 mt-2">
                  <button
                    onClick={(e) => handleEdit(biz, e)}
                    className="text-blue-600 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => handleDelete(biz.id, e)}
                    className="text-red-600 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
              {biz.placeImg && (
                <img
                  src={biz.placeImg}
                  alt={biz.title}
                  className="w-24 h-20 object-cover rounded-xl"
                />
              )}
            </div>
          ))}
        </div>

        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={(p) => setPage(p)}
        />
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-white bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-full max-h-[90vh] p-6 md:p-12 overflow-y-auto rounded-2xl relative flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">
                {editingBusiness ? "Edit Business" : "New Business"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input
                  type="text"
                  placeholder="SubCategory Name"
                  value={formData.subCategoryName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      subCategoryName: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <Description
                value={formData.description} // controlled
                onChange={(content) =>
                  setFormData({ ...formData, description: content })
                }
                placeholder="Description..."
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Working Hours"
                  value={formData.workingHours}
                  onChange={(e) =>
                    setFormData({ ...formData, workingHours: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="email"
                  placeholder="Business Email"
                  value={formData.businessEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, businessEmail: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Latitude"
                  value={formData.latitude}
                  onChange={(e) =>
                    setFormData({ ...formData, latitude: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input
                  type="text"
                  placeholder="Longitude"
                  value={formData.longitude}
                  onChange={(e) =>
                    setFormData({ ...formData, longitude: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Business Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-2xl h-100 object-cover mt-2 rounded-lg"
                  />
                )}
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-3 bg-blue-500 border border-gray-300 text-white rounded-lg hover:bg-blue-700"
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

export default SubCategoryPage;
