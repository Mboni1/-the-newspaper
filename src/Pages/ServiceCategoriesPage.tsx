// src/pages/ServiceCategories.tsx
import React, { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import api from "../lib/axios";
import toast, { Toaster } from "react-hot-toast";
import SearchInput from "../Components/SearchInput";
import Pagination from "../Components/Pagination";

interface Category {
  id: number;
  name: string;
  services: number;
  description: string;
  icon: string;
  link: string;
}

const limit = 9; // items per page

const ServiceCategories: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: "", isDoc: false });
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch categories (all for live search)
  const fetchCategories = async (query = "") => {
    setLoading(true);
    try {
      const res = query
        ? await api.get("/category/search/category/all", { params: { query } })
        : await api.get("/category", { params: { limit: 1000 } });
      const data = res.data.data || res.data;
      setCategories(data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch categories");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  // Live search with debounce
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPage(1); // reset to page 1 on search
      fetchCategories(search.trim());
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search]);

  // Frontend pagination
  const totalPages = Math.ceil(categories.length / limit);
  const paginatedCategories = categories.slice(
    (page - 1) * limit,
    page * limit
  );

  const handlePrev = () => setPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setPage((prev) => Math.min(prev + 1, totalPages));

  // Modal handlers
  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({ name: category.name, isDoc: false });
    setIsModalOpen(true);
    setOpenDropdownId(null);
  };

  const handleDelete = async (category: Category) => {
    if (!confirm(`Are you sure you want to delete ${category.name}?`)) return;
    try {
      await api.delete(`/category/${category.id}`);
      setCategories(categories.filter((c) => c.id !== category.id));
      toast.success("Category deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete category");
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }
    try {
      if (editingCategory) {
        const res = await api.patch(`/category/${editingCategory.id}`, {
          name: formData.name,
          isDoc: formData.isDoc,
        });
        const updated = res.data;
        setCategories(
          categories.map((c) => (c.id === updated.id ? updated : c))
        );
        toast.success("Category updated successfully");
      } else {
        const res = await api.post("/category", formData);
        setCategories([res.data, ...categories]);
        toast.success("Category added successfully");
      }
      setIsModalOpen(false);
      setEditingCategory(null);
      setFormData({ name: "", isDoc: false });
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to save category");
    }
  };

  return (
    <div className="p-6 pt-20 bg-gray-50 min-h-screen">
      <Toaster position="top-right" />
      <Link
        to="/dashboard"
        className="text-blue-500 hover:underline mb-4 inline-block"
      >
        ← Back to Dashboard
      </Link>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Service Categories</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow-md"
        >
          + New
        </button>
      </div>

      {/* Live Search */}
      <div className="mb-4 w-full">
        <SearchInput
          value={search}
          onSearch={(val) => setSearch(val)}
          placeholder="Search Categories..."
        />
      </div>

      {loading ? (
        <p className="p-8">Loading categories...</p>
      ) : paginatedCategories.length === 0 ? (
        <p className="p-8 text-gray-500">No categories found.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {paginatedCategories.map((category) => (
            <div
              key={category.id}
              className="relative bg-white p-6 rounded-2xl shadow hover:shadow-lg transition"
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-semibold">{category.name}</h2>
                <div className="relative">
                  <MoreHorizontal
                    className="w-5 h-5 cursor-pointer"
                    onClick={() =>
                      setOpenDropdownId(
                        openDropdownId === category.id ? null : category.id
                      )
                    }
                  />
                  {openDropdownId === category.id && (
                    <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                      <button
                        className="w-full px-3 py-2 text-left hover:bg-gray-200"
                        onClick={() => handleEdit(category)}
                      >
                        Edit
                      </button>
                      <button
                        className="w-full px-3 py-2 text-left hover:bg-gray-200 text-red-600"
                        onClick={() => handleDelete(category)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-sm text-blue-600 font-medium mb-2">
                {category.services} services
              </p>
              <p className="text-gray-600 text-sm mb-4">
                {category.description}
              </p>
              <button
                onClick={() => navigate(`/category/${category.name}`)}
                className="text-blue-600 text-sm font-semibold hover:underline"
              >
                EXPLORE CATEGORY →
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Pagination - always visible if there are categories */}
      {categories.length > 0 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {editingCategory ? "Edit Category" : "Add New Category"}
            </h2>
            <input
              type="text"
              placeholder="Category Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3"
            />
            <label className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                checked={formData.isDoc}
                onChange={(e) =>
                  setFormData({ ...formData, isDoc: e.target.checked })
                }
              />
              Is Document Category?
            </label>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingCategory(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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

export default ServiceCategories;
