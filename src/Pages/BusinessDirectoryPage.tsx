// src/pages/BusinessDirectoryPage.tsx
import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Building,
  MoreHorizontal,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import api from "../lib/axios";
import toast, { Toaster } from "react-hot-toast";
import Description from "../Components/Description";
import Pagination from "../Components/Pagination";
import CategoryMenu from "../Components/CategoryMenu";
import MultiImageUpload from "../Components/MultiImageUpload";

interface Business {
  id: number;
  title: string;
  description: string;
  workingHours: string;
  businessEmail: string;
  phoneNumber: string;
  categoryName?: string;
  subCategoryName: string;
  location: string;
  placeImage: string[];
  latitude: string;
  longitude: string;
  subCategory: string;
  icon?: React.ElementType;
}

const limit = 3;

const BusinessDirectoryPage: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    workingHours: "",
    businessEmail: "",
    phoneNumber: "",
    categoryName: "",
    subCategoryName: "",
    subCategory: "",
    location: "",
    latitude: "",
    longitude: "",
    placeImage: [] as File[],
  });

  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  // Fetch businesses
  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      setError("");
      let res;

      const params: any = { page, limit, isDoc: false };

      if (selectedSubCategory) {
        res = await api.get(
          `/place-item/subcategory/${encodeURIComponent(selectedSubCategory)}`,
          { params }
        );
      } else if (selectedCategory && !searchTerm) {
        // selected category without search term
        params.category = selectedCategory;
        res = await api.get("/place-item/all", { params });
      } else if (searchTerm) {
        params.query = searchTerm;
        if (selectedCategory) params.category = selectedCategory;
        res = await api.get("/place-item/search/all", { params });
      } else {
        // default case: all items (non-document)
        res = await api.get("/place-item/all", { params });
      }

      const mappedData: Business[] = (res.data.data || []).map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        workingHours: item.workingHours,
        businessEmail: item.businessEmail,
        phoneNumber: item.phoneNumber,
        subCategoryName: item.subCategory?.name || "Uncategorized",
        subCategory: item.subCategory,
        categoryName: item.categoryName,
        location: item.location,

        placeImage:
          item.PlaceImage?.map((img: any) =>
            img.url.startsWith("http")
              ? img.url
              : `$${(import.meta as any).env.VITE_API_URL}${img.url}`
          ) || [],
        latitude: item.latitude,
        longitude: item.longitude,
        icon: Building,
      }));

      console.log(" Loaded businesses:", mappedData);
      setBusinesses(mappedData);
      setTotalPages(Math.ceil(res.data.total / limit) || 1);
    } catch (err) {
      console.error("Error fetching businesses:", err);
      toast.error("Failed to fetch businesses. Please try again.");
      setError("Failed to fetch businesses.");
      setBusinesses([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search/filter
  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(fetchBusinesses, 400);
    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [searchTerm, selectedCategory, selectedSubCategory, page]);

  useEffect(() => {
    fetchBusinesses();
  }, []);

  // Modal Handlers
  const handleAdd = () => {
    setEditingBusiness(null);
    setFormData({
      title: "",
      description: "",
      workingHours: "",
      businessEmail: "",
      phoneNumber: "",
      categoryName: "",
      subCategoryName: "",
      subCategory: "",
      location: "",
      latitude: "",
      longitude: "",
      placeImage: [],
    });
    setIsModalOpen(true);
  };

  const handleEdit = (business: Business) => {
    setEditingBusiness(business);
    setFormData({
      title: business.title,
      description: business.description,
      workingHours: business.workingHours,
      businessEmail: business.businessEmail,
      phoneNumber: business.phoneNumber,
      categoryName: business.categoryName || "",
      subCategoryName: business.subCategoryName,
      subCategory: business.subCategory,
      location: business.location,
      latitude: business.latitude,
      longitude: business.longitude,
      placeImage: [],
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this business?"))
      return;
    try {
      await api.delete(`/place-item/${id}`);
      toast.success("Business deleted successfully!");
      fetchBusinesses();
    } catch {
      toast.error("Failed to delete business.");
    }
  };

  const handleSave = async () => {
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "placeImage") return;
        data.append(key, value as any);
      });
      // Make sure backend expects "images" or adjust if "placeImage"
      formData.placeImage.forEach((file) => data.append("images", file));

      if (editingBusiness) {
        await api.patch(`/place-item/${editingBusiness.id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Business updated successfully!");
      } else {
        await api.post("/place-item", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Business added successfully!");
      }

      setIsModalOpen(false);
      fetchBusinesses();
    } catch (err: any) {
      console.error("Save error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to save business.");
    }
  };

  // Carousel with fallback + CORS fix
  const Carousel: React.FC<{ images: string[] }> = ({ images }) => {
    const [current, setCurrent] = useState(0);
    const displayImage =
      images && images.length > 0
        ? images[current]
        : "https://via.placeholder.com/400x300?text=No+Image";

    return (
      <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-200">
        <img
          src={displayImage}
          alt={`slide-${current}`}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        {images.length > 1 && (
          <>
            <button
              onClick={() =>
                setCurrent((prev) => (prev - 1 + images.length) % images.length)
              }
              className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white/80 p-1 rounded-full shadow hover:bg-gray-100"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrent((prev) => (prev + 1) % images.length)}
              className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white/80 p-1 rounded-full shadow hover:bg-gray-100"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>
    );
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

      {/* Search + CategoryMenu */}
      <div className="flex flex-col sm:flex-row gap-3 w-full mb-6 items-start sm:items-center">
        <div className="w-full sm:w-1/2">
          <div className="flex items-center w-full px-4 py-2 rounded-xl border border-gray-300 focus-within:ring-2 focus-within:ring-blue-500">
            <Search className="text-gray-400 w-5 h-5 mr-2" />
            <input
              type="text"
              placeholder="Search businesses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 outline-none bg-transparent"
            />
          </div>
        </div>
        <div className="w-full sm:w-1/2">
          <CategoryMenu
            selectedCategory={selectedCategory}
            selectedSubCategory={selectedSubCategory}
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              setSelectedSubCategory("");
            }}
            onSelectSubCategory={setSelectedSubCategory}
          />
        </div>
      </div>

      {/* Business Cards */}
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
              <Carousel images={business.placeImage} />
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

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={(p) => setPage(p)}
      />

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-50 bg-opacity-40 flex items-center justify-center z-50 p-4">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>

              <div className="mb-2 text-left mt-7">
                <CategoryMenu
                  selectedCategory={formData.categoryName}
                  selectedSubCategory={formData.subCategoryName}
                  onSelectCategory={(cat) =>
                    setFormData({
                      ...formData,
                      categoryName: cat,
                      subCategoryName: "",
                    })
                  }
                  onSelectSubCategory={(sub) =>
                    setFormData({ ...formData, subCategoryName: sub })
                  }
                />
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                  value={formData.longitude}
                  onChange={(e) =>
                    setFormData({ ...formData, longitude: e.target.value })
                  }
                />
              </div>

              <MultiImageUpload
                existingImages={editingBusiness?.placeImage || []}
                onChange={(files) =>
                  setFormData({ ...formData, placeImage: files })
                }
              />
            </div>

            {/* Modal Buttons */}
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
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

export default BusinessDirectoryPage;
