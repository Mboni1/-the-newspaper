// src/pages/ServiceCategories.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Search,
  Plane,
  Bus,
  Bed,
  Wifi,
  CreditCard,
  Heart,
  Utensils,
  Map,
  ShoppingBag,
  MoreHorizontal,
} from "lucide-react";
import api from "../lib/axios";
import toast, { Toaster } from "react-hot-toast";

// Map string names from API -> Lucide icons
const iconMap: Record<string, React.ElementType> = {
  Plane,
  Bus,
  Bed,
  Wifi,
  CreditCard,
  Heart,
  Utensils,
  Map,
  ShoppingBag,
  MoreHorizontal,
};

interface Category {
  id: number;
  name: string;
  services: number;
  description: string;
  icon: string;
  link: string;
}

const ServiceCategories: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalCategories, setTotalCategories] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: "", isDoc: false });
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

  const limit = 9;

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get(
        `/category?page=${page}&limit=${limit}&search=${searchTerm}`
      );
      const responseData = await res.data;

      if (Array.isArray(responseData.data)) {
        setCategories(responseData.data);
        setTotalCategories(responseData.total || responseData.data.length);
      } else {
        setCategories([]);
        setTotalCategories(0);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [page, searchTerm]);

  const totalPages = Math.ceil(totalCategories / limit);

  const handlePrev = () => page > 1 && setPage((prev) => prev - 1);
  const handleNext = () => page < totalPages && setPage((prev) => prev + 1);

  const toggleDropdown = (id: number) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({ name: category.name, isDoc: false }); // Adjust isDoc if needed
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
        console.log("Updating category ID:", editingCategory.id);

        const res = await api.patch(`/category/${editingCategory.id}`, {
          name: formData.name,
          isDoc: formData.isDoc,
        });

        const updatedCategory = res.data;
        setCategories(
          categories.map((c) =>
            c.id === updatedCategory.id ? updatedCategory : c
          )
        );
        toast.success("Category updated successfully");
      } else {
        const res = await api.post("/category", {
          name: formData.name,
          isDoc: formData.isDoc,
        });

        const newCategory = res.data;
        setCategories([newCategory, ...categories]);
        toast.success("Category added successfully");
      }

      setIsModalOpen(false);
      setEditingCategory(null);
      setFormData({ name: "", isDoc: false });
    } catch (err: any) {
      console.error("Save failed:", err.response || err);
      toast.error(err.response?.data?.message || "Failed to save category");
    }
  };

  if (loading) return <p className="p-8">Loading categories...</p>;
  if (categories.length === 0)
    return <p className="p-8 text-red-500">No categories found.</p>;

  return (
    <div className="p-6 pt-20 px-10 py-10 bg-gray-50 min-h-screen">
      <Toaster position="top-right" reverseOrder={false} />
      <Link
        to="/dashboard"
        className="text-blue-600 hover:underline inline-block mb-4"
      >
        ← Back to Dashboard
      </Link>

      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Service Categories</h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Explore our comprehensive range of services organized by category to
            help you find exactly what you need.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow-md"
        >
          + New
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-1.5 rounded-xl shadow mb-8">
        <div className="flex items-center flex-1 rounded-lg px-3 py-2">
          <Search className="text-gray-400 w-5 h-5 mr-2" />
          <input
            type="text"
            placeholder="Search Category"
            value={searchTerm}
            onChange={(e) => {
              setPage(1);
              setSearchTerm(e.target.value);
            }}
            className="flex-1 outline-none"
          />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => {
          return (
            <div
              key={category.id}
              className="relative bg-white p-6 rounded-2xl shadow hover:shadow-lg transition"
            >
              <div className="flex items-center gap-3 mb-3 justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-semibold">{category.name}</h2>
                </div>
                <div className="relative">
                  <MoreHorizontal
                    className="w-5 h-5 cursor-pointer"
                    onClick={() => toggleDropdown(category.id)}
                  />
                  {openDropdownId === category.id && (
                    <div className="absolute right-0 mt-2 w-32 bg-white border rounded-md shadow-lg z-10">
                      <button
                        className="flex items-center w-full px-3 py-2 text-left hover:bg-gray-100"
                        onClick={() => handleEdit(category)}
                      >
                        Edit
                      </button>
                      <button
                        className="flex items-center w-full px-3 py-2 text-left hover:bg-gray-100 text-red-600"
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
          );
        })}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 gap-4">
        <button
          onClick={handlePrev}
          disabled={page === 1}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-4 py-2">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={page === totalPages}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
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
              className="w-full border rounded-lg px-3 py-2 mb-3"
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
                className="px-4 py-2 border rounded-lg"
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
