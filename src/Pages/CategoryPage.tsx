// src/pages/CategoryPage.tsx
import React, { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Plus, X } from "lucide-react";
import api from "../lib/axios";
import toast, { Toaster } from "react-hot-toast";
import SearchInput from "../Components/SearchInput";
import Pagination from "../Components/Pagination";

interface Category {
  id: number;
  name: string;
  description: string;
  image: string;
  services: number;
  featuredImage: string;
}

interface SubCategory {
  id: number;
  name: string;
  featuredImage?: string;
}

const limit = 3;

const CategoryPage: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();

  const [category, setCategory] = useState<Category | null>(null);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubCategory, setEditingSubCategory] =
    useState<SubCategory | null>(null);
  const [formData, setFormData] = useState<{
    subCategoryId?: number;
    subCategoryName: string;
    categoryName: string;
    featuredImage: File | null;
  }>({
    subCategoryId: undefined,
    subCategoryName: "",
    categoryName: name || "",
    featuredImage: null,
  });

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch category info
  useEffect(() => {
    if (!name) return;
    const fetchCategory = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/category/${name}`);
        setCategory(res.data.data || null);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch category!");
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, [name]);

  // Fetch subcategories with live search + debounce
  const fetchSubCategories = async (query = "") => {
    if (!name) return;
    try {
      setLoading(true);
      const res = query
        ? await api.get("/category/search/subcategory/all", {
            params: { query, categoryName: name },
          })
        : await api.get(`/category/${name}`);
      const data = Array.isArray(res.data.data) ? res.data.data : [];
      setSubCategories(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch subcategories!");
      setSubCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPage(1);
      fetchSubCategories(search.trim());
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search, name]);

  // Pagination
  const totalPages = Math.ceil(subCategories.length / limit);
  const paginatedSubCategories = subCategories.slice(
    (page - 1) * limit,
    page * limit
  );

  // Navigation & modal handlers
  const goToSubcategory = (subName: string) =>
    navigate(`/category/subCategory/${subName}`);

  const handleAdd = () => {
    setEditingSubCategory(null);
    setFormData({
      subCategoryId: undefined,
      subCategoryName: "",
      categoryName: name || "",
      featuredImage: null,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (sub: SubCategory, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingSubCategory(sub);
    setFormData({
      subCategoryId: sub.id,
      subCategoryName: sub.name,
      categoryName: name || "",
      featuredImage: null,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.delete(`/category/subcategory/${id}`);
      setSubCategories(subCategories.filter((s) => s.id !== id));
      toast.success("Subcategory deleted!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete subcategory!");
    }
  };

  const handleSave = async () => {
    if (!formData.subCategoryName.trim() || !formData.categoryName.trim()) {
      toast.error("Please fill in all required fields!");
      return;
    }

    try {
      const data = new FormData();
      data.append("subCategoryName", formData.subCategoryName);
      data.append("categoryName", formData.categoryName);
      if (formData.featuredImage)
        data.append("featuredImage", formData.featuredImage);

      if (editingSubCategory) {
        const res = await api.patch(
          `/category/subcategory/${editingSubCategory.id}`,
          data,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        const updated = res.data.data;
        setSubCategories((prev) =>
          prev.map((s) => (s.id === editingSubCategory.id ? updated : s))
        );
        toast.success("Subcategory updated!");
      } else {
        const res = await api.post(`/category/subcategory`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setSubCategories((prev) => [...prev, res.data.data]);
        toast.success("Subcategory added!");
      }

      setIsModalOpen(false);
      setEditingSubCategory(null);
      setFormData({
        subCategoryId: undefined,
        subCategoryName: "",
        categoryName: name || "",
        featuredImage: null,
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to save subcategory!");
    }
  };

  if (loading) return <p className="p-8">Loading...</p>;
  if (!category) return <p className="p-8 text-red-500">Category not found.</p>;

  return (
    <div className="p-6 pt-20 max-w-3xl mx-auto">
      <Toaster position="top-right" reverseOrder={false} />
      <Link to="/service-categories" className="text-blue-600 hover:underline">
        ← Back to Categories
      </Link>

      <div className="bg-white p-6 mt-6 rounded-2xl shadow">
        <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
        <p className="text-gray-600 mb-2">{category.description}</p>
        <p className="text-sm text-blue-600 mb-4">
          {category.services} services available
        </p>
        {category.featuredImage && (
          <img
            src={category.featuredImage}
            alt={category.name}
            className="w-full max-w-md object-cover rounded-xl mb-4"
          />
        )}

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Manage Subcategories</h2>
          <button
            onClick={handleAdd}
            className="bg-blue-500 text-white px-3 py-1 rounded-xl flex items-center hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-1" /> New
          </button>
        </div>

        {/* Live Search */}
        <SearchInput
          value={search}
          onSearch={(val) => setSearch(val)}
          placeholder="Search subcategories..."
        />
      </div>

      <div className="space-y-4 mt-4">
        {paginatedSubCategories.map((sub) => (
          <div
            key={sub.id}
            onClick={() => goToSubcategory(sub.name)}
            className="flex justify-between items-center bg-gray-50 rounded-2xl shadow p-4 cursor-pointer hover:bg-gray-100 transition"
          >
            <div className="flex-1 pr-4">
              <h3 className="font-semibold text-lg">{sub.name}</h3>
              <div className="flex space-x-4 mt-2">
                <button
                  onClick={(e) => handleEdit(sub, e)}
                  className="text-blue-500 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => handleDelete(sub.id, e)}
                  className="text-red-600 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
            {sub.featuredImage && (
              <img
                src={sub.featuredImage}
                alt={sub.name}
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {editingSubCategory ? "Edit Subcategory" : "New Subcategory"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Subcategory name"
                value={formData.subCategoryName}
                onChange={(e) =>
                  setFormData({ ...formData, subCategoryName: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none"
              />
              <input
                type="text"
                placeholder="Category name"
                value={formData.categoryName}
                onChange={(e) =>
                  setFormData({ ...formData, categoryName: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    featuredImage: e.target.files?.[0] || null,
                  })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none"
              />

              {formData.featuredImage ? (
                <div className="mt-3">
                  <p className="text-sm text-gray-600 mb-1">Preview:</p>
                  <img
                    src={URL.createObjectURL(formData.featuredImage)}
                    alt="Preview"
                    className="w-full h-40 object-cover rounded-lg border border-gray-300"
                  />
                </div>
              ) : editingSubCategory?.featuredImage ? (
                <div className="mt-3">
                  <p className="text-sm text-gray-600 mb-1">Current Image:</p>
                  <img
                    src={editingSubCategory.featuredImage}
                    alt="Current"
                    className="w-full h-40 object-cover rounded-lg border"
                  />
                </div>
              ) : null}
            </div>

            <div className="flex justify-end mt-6 space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-700"
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

export default CategoryPage;
