import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Plus, Search, X } from "lucide-react";

interface Category {
  id: number;
  name: string;
  description: string;
  image: string;
  services: number;
  featuredImage: string;
}

const limit = 3;

const CategoryPage: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [page, setPage] = useState(1);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
  });
  useEffect(() => {
    const fetchCategoryAndServices = async () => {
      try {
        setLoading(true);

        if (name) {
          // Fetch category info
          const resOne = await fetch(
            `https://nearme-bn.onrender.com/category/${name}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          const dataOne = await resOne.json();
          console.log("Category response:", dataOne);
          setCategory(dataOne.data || null);

          // Fetch subcategories/services for that category
          const resServices = await fetch(
            `https://nearme-bn.onrender.com/category/${name}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          const dataServices = await resServices.json();
          console.log("Services response:", dataServices);
          setCategories(
            Array.isArray(dataServices.data) ? dataServices.data : []
          );
        }
      } catch (error) {
        console.error("Error fetching category:", error);
        setCategory(null);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryAndServices();
  }, [name]);

  // Add
  const handleAdd = () => {
    setEditingCategory(null);
    setFormData({ name: "", description: "", image: "" });
    setIsModalOpen(true);
  };

  // Edit
  const handleEdit = (cat: Category) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      description: cat.description,
      image: cat.featuredImage,
    });
    setIsModalOpen(true);
  };

  // Delete
  const handleDelete = (id: number) => {
    setCategories(categories.filter((c) => c.id !== id));
  };

  // Save
  const handleSave = () => {
    if (!formData.name.trim() || !formData.description.trim()) return;

    if (editingCategory) {
      setCategories(
        categories.map((c) =>
          c.id === editingCategory.id ? { ...c, ...formData } : c
        )
      );
      if (category && category.id === editingCategory.id) {
        setCategory({ ...category, ...formData });
      }
    } else {
      const newCategory: Category = {
        id: Date.now(),
        ...formData,
        services: 0,
        featuredImage: formData.image,
      };
      setCategories([...categories, newCategory]);
    }
    setIsModalOpen(false);
  };

  // Search + Pagination
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filteredCategories.length / limit);
  const paginatedCategories = filteredCategories.slice(
    (page - 1) * limit,
    page * limit
  );

  if (loading) return <p className="p-8">Loading categories...</p>;
  if (!category) return <p className="p-8 text-red-500">Category not found.</p>;

  return (
    <div className="p-6 pt-20 max-w-3xl mx-auto">
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
          <h2 className="text-xl font-semibold">Manage Categories</h2>
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
            placeholder="Search categories..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1); // reset to first page when searching
            }}
            className="w-full outline-none bg-transparent"
          />
        </div>

        {/* Categories list with image on right */}
        <div className="space-y-4">
          {paginatedCategories.map((cat) => (
            <div
              key={cat.id}
              className="flex justify-between items-center bg-gray-50 rounded-2xl shadow p-4"
            >
              <div className="flex-1 pr-4">
                <h3 className="font-semibold text-lg">{cat.name}</h3>
                <p className="text-sm text-gray-500">{cat.description}</p>
                <div className="flex space-x-4 mt-2">
                  <button
                    onClick={() => handleEdit(cat)}
                    className="text-blue-600 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="text-red-600 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
              {cat.featuredImage && (
                <img
                  src={cat.featuredImage}
                  alt={cat.name}
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
              className="px-3 py-1 bg-blue-600 rounded disabled:opacity-50"
            >
              Prev.
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 bg-blue-600 rounded disabled:opacity-50"
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
                {editingCategory ? "Edit Category" : "New Category"}
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
                placeholder="Category name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2 outline-none"
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2 outline-none"
              />
              <input
                type="text"
                placeholder="Image URL"
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2 outline-none"
              />
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
