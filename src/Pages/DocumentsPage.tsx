import React, { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../lib/axios";
import toast, { Toaster } from "react-hot-toast";
import Description from "../Components/Description";
import Pagination from "../Components/Pagination";
import SearchInput from "../Components/SearchInput";

interface Article {
  id: number;
  title: string;
  author: string;
  date: string;
  location: string;
  categoryName: string;
  featuredImg: string;
  summary: string;
  description: string;
}

const limit = 3;

const ArticlesPage: React.FC = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    categoryName: "",
    location: "",
    featuredImg: "",
    description: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  // Fetch articles
  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res = await api.get("/doc-item/admin/all");
      const fetchedArticles = Array.isArray(res.data.data)
        ? res.data.data.map((item: any) => ({
            id: item.id,
            title: item.title,
            author: item.authorName || "Admin",
            date: item.date || item.createdAt || new Date().toISOString(),
            featuredImg: item.featuredImg || "https://via.placeholder.com/150",
            summary: item.summary || "",
            categoryName: item.categoryName || "",
            location: item.location || "",
          }))
        : [];
      setArticles(fetchedArticles);
    } catch (err: any) {
      setError(err.message || "Failed to fetch articles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  // Search + Pagination
  const filteredArticles = articles.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filteredArticles.length / limit);
  const paginatedArticles = filteredArticles.slice(
    (page - 1) * limit,
    page * limit
  );
  const handlePrev = () => setPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setPage((prev) => Math.min(prev + 1, totalPages));

  // Modal handlers
  const handleAdd = () => {
    setEditingArticle(null);
    setFormData({
      title: "",
      summary: "",
      categoryName: "",
      location: "",
      featuredImg: "",
      description: "",
    });
    setImageFile(null);
    setImagePreview("");
    setIsModalOpen(true);
  };

  const handleEdit = (article: Article) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      summary: article.summary,
      categoryName: article.categoryName,
      location: article.location,
      featuredImg: article.featuredImg,
      description: article.description,
    });
    setImageFile(null);
    setImagePreview(article.featuredImg);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    try {
      await api.delete(`/doc-item/${id}`);
      setArticles(articles.filter((a) => a.id !== id));
      toast.success("Article deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete article");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("summary", formData.summary);
      data.append("categoryName", formData.categoryName);
      data.append("location", formData.location);
      if (imageFile) data.append("featuredImg", imageFile);

      if (editingArticle) {
        const res = await api.patch(`/doc-item/${editingArticle.id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setArticles((prev) =>
          prev.map((a) => (a.id === editingArticle.id ? res.data.data : a))
        );
        toast.success("Article updated successfully");
      } else {
        const res = await api.post("/doc-item", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setArticles((prev) => [res.data.data, ...prev]);
        toast.success("Article added successfully");
      }

      setIsModalOpen(false);
      setFormData({
        title: "",
        summary: "",
        categoryName: "",
        location: "",
        featuredImg: "",
        description: "",
      });
      setImageFile(null);
      setImagePreview("");
      setEditingArticle(null);
    } catch (err: any) {
      console.error(err);
      toast.error(
        "Failed to save article: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  if (loading) return <p className="p-8">Loading articles...</p>;
  if (error) return <p className="p-8 text-red-500">{error}</p>;

  return (
    <div className="p-6 pt-20 bg-gray-50 min-h-screen">
      <Toaster position="top-right" />
      <button
        onClick={() => navigate("/dashboard")}
        className="text-blue-500 hover:underline inline-block mb-4"
      >
        ← Back to Dashboard
      </button>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">All Articles</h1>
          <p className="text-gray-600">
            Manage and organize all listed articles in one place.
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow-md"
        >
          + New
        </button>
      </div>

      {/* Search */}
      <SearchInput
        value={search}
        onSearch={(val) => setSearch(val)}
        placeholder="Search Articles..."
      />

      <div className="space-y-4">
        {paginatedArticles.length > 0 ? (
          paginatedArticles.map((article) => (
            <div
              key={article.id}
              className="flex items-center justify-between bg-white rounded-2xl shadow-md p-4 mt-6"
            >
              <div>
                <h2 className="text-lg font-semibold">{article.title}</h2>
                <div className="text-sm text-gray-500">
                  {article.author} &nbsp; {article.date}
                </div>
                <div className="flex gap-4 mt-2">
                  <button
                    onClick={() => handleEdit(article)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(article.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <img
                src={article.featuredImg}
                alt={article.title}
                className="w-24 h-20 object-cover rounded-xl"
              />
            </div>
          ))
        ) : (
          <p className="text-gray-500">No articles found.</p>
        )}
      </div>

      {/* Pagination */}
      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={(p) => setPage(p)}
      />

      {isModalOpen && (
        <div className="fixed inset-0 bg-white bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-full max-h-[90vh] p-6 md:p-12 overflow-y-auto rounded-2xl relative flex flex-col">
            {/* Close button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Title */}
            <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-center md:text-left">
              {editingArticle ? "Edit Article" : "New Article"}
            </h2>

            {/* Form */}
            <div className="flex flex-col gap-6 w-full">
              {/* Title */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-600 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="Enter title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Description */}
              <Description
                value={formData.description} // controlled
                onChange={(content) =>
                  setFormData({ ...formData, description: content })
                }
                placeholder="Description..."
              />

              {/* Summary */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-600 mb-1">
                  Summary
                </label>
                <textarea
                  placeholder="Short summary..."
                  value={formData.summary}
                  onChange={(e) =>
                    setFormData({ ...formData, summary: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24 resize-none focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Category + Location in one row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    placeholder="Category name"
                    value={formData.categoryName}
                    onChange={(e) =>
                      setFormData({ ...formData, categoryName: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="Enter location"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
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
                  className=" border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-2xl h-100 object-cover rounded-lg mt-3 shadow"
                  />
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-3 border rounded-lg hover:bg-gray-200"
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

export default ArticlesPage;
