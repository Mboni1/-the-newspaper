import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Plus, Search, X } from "lucide-react";
import api from "../lib/axios";
import toast, { Toaster } from "react-hot-toast";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubCategory, setEditingSubCategory] =
    useState<SubCategory | null>(null);
  const [page, setPage] = useState(1);

  const [formData, setFormData] = useState<{
    subCategoryName: string;
    categoryName: string;
    featuredImage: File | null;
  }>({
    subCategoryName: "",
    categoryName: name || "",
    featuredImage: null,
  });

  // Fetch category + subcategories
  useEffect(() => {
    const fetchCategoryAndSubCategories = async () => {
      try {
        setLoading(true);
        if (name) {
          const resCategory = await api.get(`/category/${name}`);
          setCategory(resCategory.data.data || null);

          const resSubCategories = await api.get(`/category/${name}`);
          setSubCategories(
            Array.isArray(resSubCategories.data.data)
              ? resSubCategories.data.data
              : []
          );
        }
      } catch (error) {
        console.error("Error fetching category:", error);
        toast.error("Failed to fetch category data!");
        setCategory(null);
        setSubCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryAndSubCategories();
  }, [name]);

  // Navigate to subcategory
  const goToSubcategory = (subCategoryName: string) => {
    navigate(`/category/subCategory/${subCategoryName}`);
  };

  // Add
  const handleAdd = () => {
    setEditingSubCategory(null);
    setFormData({
      subCategoryName: "",
      categoryName: name || "",
      featuredImage: null,
    });
    setIsModalOpen(true);
  };

  // Edit
  const handleEdit = (sub: SubCategory, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingSubCategory(sub);
    setFormData({
      subCategoryName: sub.name,
      categoryName: name || "",
      featuredImage: null,
    });
    setIsModalOpen(true);
  };

  // Delete
  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.delete(`/category/subcategory/${id}`);
      setSubCategories(subCategories.filter((s) => s.id !== id));
      toast.success("Subcategory deleted successfully!");
    } catch (error) {
      console.error("Error deleting subcategory:", error);
      toast.error("Failed to delete subcategory!");
    }
  };

  // Save (Add or Edit) with toast
  const handleSave = async () => {
    if (!formData.subCategoryName.trim() || !formData.categoryName.trim()) {
      toast.error("Please fill in all required fields!");
      return;
    }

    try {
      const data = new FormData();
      data.append("subCategoryName", formData.subCategoryName);
      data.append("categoryName", formData.categoryName);
      if (formData.featuredImage) {
        data.append("featuredImage", formData.featuredImage);
      }

      if (editingSubCategory) {
        // EDIT
        const res = await api.put(
          `/category/subcategory/${editingSubCategory.id}`,
          data,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        const updated = res.data.data;
        setSubCategories((prev) =>
          prev.map((s) => (s.id === editingSubCategory.id ? updated : s))
        );
        toast.success("Subcategory updated successfully!");
      } else {
        // ADD
        const res = await api.post("/category/subcategory", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        const newSubCategory = res.data.data;
        setSubCategories((prev) => [...prev, newSubCategory]);
        toast.success("Subcategory added successfully!");
      }

      setIsModalOpen(false);
      setEditingSubCategory(null);
      setFormData({
        subCategoryName: "",
        categoryName: name || "",
        featuredImage: null,
      });
    } catch (error) {
      console.error("Error saving subcategory:", error);
      toast.error("Failed to save subcategory!");
    }
  };

  // Search + Pagination
  const filteredSubCategories = subCategories.filter((sub) =>
    sub.name.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filteredSubCategories.length / limit);
  const paginatedSubCategories = filteredSubCategories.slice(
    (page - 1) * limit,
    page * limit
  );

  if (loading) return <p className="p-8">Loading categories...</p>;
  if (!category) return <p className="p-8 text-red-500">Category not found.</p>;

  return (
    <div className="p-6 pt-20 max-w-3xl mx-auto">
      {/* Toast Provider */}
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

        {/* CRUD + Search */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Manage Subcategories</h2>
          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-3 py-1 rounded-xl flex items-center hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-1" /> New
          </button>
        </div>

        <div className="flex items-center border rounded-xl px-3 py-2 mb-4 bg-white shadow-sm">
          <Search className="text-gray-400 w-5 h-5 mr-2" />
          <input
            type="text"
            placeholder="Search subcategories..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full outline-none bg-transparent"
          />
        </div>

        {/* Subcategories list */}
        <div className="space-y-4">
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
                    className="text-blue-600 text-sm"
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

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50"
            >
              Prev.
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

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
                className="w-full border rounded-lg px-3 py-2 outline-none"
              />
              <input
                type="text"
                placeholder="Category name"
                value={formData.categoryName}
                onChange={(e) =>
                  setFormData({ ...formData, categoryName: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2 outline-none"
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
                className="w-full border rounded-lg px-3 py-2 outline-none"
              />

              {formData.featuredImage ? (
                <div className="mt-3">
                  <p className="text-sm text-gray-600 mb-1">Preview:</p>
                  <img
                    src={URL.createObjectURL(formData.featuredImage)}
                    alt="Preview"
                    className="w-full h-40 object-cover rounded-lg border"
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
                className="px-4 py-2 rounded-lg border"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
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
