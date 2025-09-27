// src/pages/BusinessDirectoryPage.tsx
import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Building, MoreHorizontal, Search, X } from "lucide-react";
import api from "../lib/axios";
import toast, { Toaster } from "react-hot-toast";
import Description from "../Components/Description";
import Pagination from "../Components/Pagination";

// Interfaces
interface Business {
  id: number;
  title: string;
  description: string;
  workingHours: string;
  businessEmail: string;
  phoneNumber: string;
  subCategoryName: string;
  location: string;
  placeImg: string[];
  latitude: string;
  longitude: string;
  icon?: React.ElementType;
}

interface SearchFilterBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  categories: string[];
}

// Search + Filter Component
const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  searchTerm,
  setSearchTerm,
  category,
  setCategory,
  categories,
}) => (
  <div className="flex flex-col sm:flex-row gap-3 w-full mb-6">
    <div className="flex items-center w-full px-4 py-2 rounded-xl border border-gray-300 focus-within:ring-2 focus-within:ring-blue-500">
      <Search className="text-gray-400 w-5 h-5 mr-2" />
      <input
        type="text"
        placeholder="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="flex-1 outline-none bg-transparent"
      />
    </div>
    <div className="relative">
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="px-4 py-2 rounded-xl border border-gray-300 outline-none cursor-pointer focus:ring-2 focus:ring-blue-500"
      >
        <option value="All">All categories</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>
  </div>
);

// Main Page
const limit = 3;

const BusinessDirectoryPage: React.FC = () => {
  // States
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

  const [categories, setCategories] = useState<string[]>([]);
  const [subCategories, setSubCategories] = useState<string[]>([]);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    workingHours: "",
    businessEmail: "",
    phoneNumber: "",
    subCategoryName: "",
    location: "",
    latitude: "",
    longitude: "",
    placeImg: "" as any,
  });
  const [imagePreview, setImagePreview] = useState<string>("");

  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  // Fetch categories and subcategories from database
  const fetchCategories = async () => {
    try {
      const res = await api.get(`/category`);
      // Filtro: zitarimo documents
      const filtered = res.data.data
        .filter((cat: any) => cat.isDoc === false)
        .map((cat: any) => cat.name);

      setCategories(filtered);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSubCategories = async () => {
    try {
      const res = await api.get(`/category/${name}`);
      setSubCategories(res.data.data.map((sub: any) => sub.name));
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch all businesses
  const fetchAllBusinesses = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/place-item/all", {
        params: { page, limit },
      });

      const mappedData: Business[] = (res.data.data || []).map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        workingHours: item.workingHours,
        businessEmail: item.businessEmail,
        phoneNumber: item.phoneNumber,
        subCategoryName: item.subCategory?.name || "Uncategorized",
        location: item.location,
        placeImg: item.placeImg || [],
        latitude: item.latitude,
        longitude: item.longitude,
        icon: Building,
      }));

      setBusinesses(mappedData);
      setTotalPages(Math.ceil(res.data.total / limit) || 1);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch businesses.");
    } finally {
      setLoading(false);
    }
  };

  // Search results
  const fetchSearchResults = async () => {
    if (!searchTerm) return fetchAllBusinesses();

    try {
      setLoading(true);
      setError("");

      const params: any = { query: searchTerm, page, limit };
      if (category !== "All") params.category = category;

      const res = await api.get("/place-item/search/all", { params });

      const mappedData: Business[] = (res.data.data || []).map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        workingHours: item.workingHours,
        businessEmail: item.businessEmail,
        phoneNumber: item.phoneNumber,
        subCategoryName: item.subCategory?.name || "Uncategorized",
        location: item.location,
        placeImg: item.placeImg || [],
        latitude: item.latitude,
        longitude: item.longitude,
        icon: Building,
      }));

      setBusinesses(mappedData);
      setTotalPages(Math.ceil(res.data.total / limit) || 1);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch search results.");
      setBusinesses([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // Debounce search
  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      if (searchTerm) {
        fetchSearchResults();
      } else {
        fetchAllBusinesses();
      }
    }, 500);
  }, [searchTerm, category, page]);

  // Fetch categories/subcategories on mount
  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
    fetchAllBusinesses();
  }, []);

  // Modal handlers
  const handleAdd = () => {
    setEditingBusiness(null);
    setFormData({
      title: "",
      workingHours: "",
      businessEmail: "",
      phoneNumber: "",
      subCategoryName: subCategories[0] || "",
      location: "",
      latitude: "",
      longitude: "",
      placeImg: "",
      description: "",
    });
    setImagePreview("");
    setIsModalOpen(true);
  };

  const handleEdit = (biz: Business) => {
    setEditingBusiness(biz);
    setFormData({
      title: biz.title || "",
      workingHours: biz.workingHours || "",
      businessEmail: biz.businessEmail || "",
      phoneNumber: biz.phoneNumber || "",
      subCategoryName: biz.subCategoryName || subCategories[0] || "",
      location: biz.location || "",
      latitude: biz.latitude || "",
      longitude: biz.longitude || "",
      placeImg: biz.placeImg,
      description: biz.description || "",
    });
    setImagePreview(biz.placeImg[0] || "");
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this business?")) return;
    try {
      await api.delete(`/place-item/${id}`);
      setBusinesses(businesses.filter((b) => b.id !== id));
      toast.success("Business deleted successfully");
    } catch (err) {
      console.error("Error deleting business:", err);
      toast.error("Failed to delete business");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({ ...formData, placeImg: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    try {
      if (!formData.title.trim()) {
        toast.error("Title is required");
        return;
      }

      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) submitData.append(key, value as any);
      });

      if (editingBusiness) {
        const res = await api.patch(
          `/place-item/${editingBusiness.id}`,
          submitData,
          { headers: { "Content-Type": "multipart/form-data" } }
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
    } catch (err) {
      console.error("Error saving business:", err);
      toast.error("Failed to save business");
    }
  };

  return (
    <div className="p-6 pt-20 bg-gray-50 min-h-screen">
      <Toaster position="top-right" />
      <Link
        to="/dashboard"
        className="text-blue-500 hover:underline inline-block mb-4"
      >
        ← Back to Dashboard
      </Link>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Business Directory</h1>
          <p className="text-gray-600">Manage all listed businesses.</p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow-md"
        >
          + New
        </button>
      </div>

      {/* Search + Filter */}
      <SearchFilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        category={category}
        setCategory={setCategory}
        categories={categories}
      />

      {/* Business Grid */}
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && businesses.length === 0 && (
        <p className="text-gray-500">No businesses found.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {businesses.map((business) => {
          const Icon = business.icon || Building;
          return (
            <div
              key={business.id}
              className="bg-white rounded-2xl shadow-sm p-3 hover:shadow-md transition relative"
            >
              {business.placeImg.length > 0 && (
                <img
                  src={business.placeImg[0]}
                  alt={business.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
              )}
              <div className="p-4">
                <div className="flex justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">{business.title}</h2>
                    <p className="text-gray-500 text-sm">{business.location}</p>
                  </div>
                  <button
                    onClick={() =>
                      setOpenDropdownId(
                        openDropdownId === business.id ? null : business.id
                      )
                    }
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <MoreHorizontal />
                  </button>
                  {openDropdownId === business.id && (
                    <div className="absolute right-12 mt-3 translate-y-3 w-20 bg-white border border-gray-200 rounded-md shadow z-10">
                      <button
                        onClick={() => handleEdit(business)}
                        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-200 rounded-t-md"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(business.id)}
                        className="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-200 rounded-b-md"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex items-center mt-3 text-blue-500 font-medium text-sm">
                  <Icon className="w-5 h-5 mr-2" />
                  {business.subCategoryName}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={(p) => setPage(p)}
      />

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-300 bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-full max-h-[90vh] p-6 md:p-12 overflow-y-auto rounded-2xl relative flex flex-col">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X />
            </button>
            <h2 className="text-xl font-bold mb-4">
              {editingBusiness ? "Edit Business" : "Add Business"}
            </h2>

            {/* Form Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium">Title</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Sub Category</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  value={formData.subCategoryName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      subCategoryName: e.target.value,
                    })
                  }
                >
                  {subCategories.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>

              <Description
                value={formData.description}
                onChange={(content) =>
                  setFormData({ ...formData, description: content })
                }
                placeholder="Description..."
              />

              <div>
                <label className="block mb-1 font-medium">Business Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  value={formData.businessEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, businessEmail: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Phone Number</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Location</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Working Hours</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  value={formData.workingHours}
                  onChange={(e) =>
                    setFormData({ ...formData, workingHours: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Latitude</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  value={formData.latitude}
                  onChange={(e) =>
                    setFormData({ ...formData, latitude: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Longitude</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  value={formData.longitude}
                  onChange={(e) =>
                    setFormData({ ...formData, longitude: e.target.value })
                  }
                />
              </div>

              {/* Image upload */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-600 mb-2">
                  Featured Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="border-gray-300 border rounded p-2"
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded mt-2"
                  />
                )}
              </div>
            </div>

            <button
              onClick={handleSave}
              className="mt-6 bg-blue-500 hover:bg-blue-700 text-white px-6 py-2 rounded-xl shadow-md"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessDirectoryPage;
