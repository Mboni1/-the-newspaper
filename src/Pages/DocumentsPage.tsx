import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../lib/axios";

interface Article {
  id: number;
  title: string;
  author: string;
  date: string;
  location: string;
  categoryName: string;
  featuredImg: string;
  description: string;
  summary: string;
}

const limit = 3;

const ArticlesPage: React.FC = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    summary: "",
    categoryName: "",
    location: "",
    featuredImg: "",
  });

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
          }))
        : [];
      setArticles(fetchedArticles);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || "Failed to fetch articles");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  // Search filter
  const filteredArticles = articles.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredArticles.length / limit);
  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * limit,
    currentPage * limit
  );

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  // Modal handlers
  const handleAdd = () => {
    setEditingArticle(null);
    setFormData({
      title: "",
      description: "",
      summary: "",
      categoryName: "",
      location: "",
      featuredImg: "",
    });
    setIsModalOpen(true);
  };

  const handleEdit = (article: Article) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      description: article.description,
      summary: article.summary,
      categoryName: article.categoryName,
      location: article.location,
      featuredImg: article.featuredImg,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    try {
      await api.delete(`/doc-item/${id}`);
      setArticles(articles.filter((a) => a.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete article");
    }
  };

  const handleSave = async () => {
    if (!formData.title.trim()) return alert("Title is required");

    try {
      if (editingArticle) {
        // Update existing article
        const res = await api.patch(`/doc-item/${editingArticle.id}`, formData);

        // Update articles state immediately
        setArticles((prev) =>
          prev.map((a) => (a.id === editingArticle.id ? res.data.data : a))
        );
      } else {
        // Add new article
        const res = await api.post("/doc-item", formData);

        // Add the new article to state immediately
        setArticles((prev) => [res.data.data, ...prev]);
      }

      // Close modal after success
      setIsModalOpen(false);
      setFormData({
        title: "",
        description: "",
        summary: "",
        categoryName: "",
        location: "",
        featuredImg: "",
      });
      setEditingArticle(null);
    } catch (err: any) {
      console.error(err);
      alert(
        "Failed to save article: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  if (loading) return <p className="p-8">Loading articles...</p>;
  if (error) return <p className="p-8 text-red-500">{error}</p>;

  return (
    <div className="p-6 pt-20 bg-gray-50 min-h-screen">
      {/* Back */}
      <button
        onClick={() => navigate("/dashboard")}
        className="text-blue-600 hover:underline inline-block mb-4"
      >
        ← Back to Dashboard
      </button>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">All Articles</h1>
          <p className="text-gray-600">
            Manage and organize all listed articles in one place.
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow-md"
        >
          + New
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center bg-white rounded-xl shadow px-4 py-2 mb-6">
        <Search className="w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search articles"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="ml-2 w-full outline-none text-gray-700"
        />
      </div>

      {/* Articles List */}
      <div className="space-y-4">
        {paginatedArticles.length > 0 ? (
          paginatedArticles.map((article) => (
            <div
              key={article.id}
              className="flex items-center justify-between bg-white rounded-2xl shadow-md p-4"
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
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-blue-600 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-blue-600 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {editingArticle ? "Edit Article" : "New Article"}
            </h2>
            <input
              type="text"
              placeholder="Title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full border rounded-lg px-3 py-2 mb-3"
            />
            <input
              type="text"
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full border rounded-lg px-3 py-2 mb-3"
            />
            <input
              type="text"
              placeholder="Summary"
              value={formData.summary}
              onChange={(e) =>
                setFormData({ ...formData, summary: e.target.value })
              }
              className="w-full border rounded-lg px-3 py-2 mb-3"
            />
            <input
              type="string"
              placeholder="CategoryName"
              value={formData.categoryName}
              onChange={(e) =>
                setFormData({ ...formData, categoryName: e.target.value })
              }
              className="w-full border rounded-lg px-3 py-2 mb-3"
            />
            <input
              type="text"
              placeholder="Location"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="w-full border rounded-lg px-3 py-2 mb-3"
            />

            <input
              type="text"
              placeholder="Image URL"
              value={formData.featuredImg}
              onChange={(e) =>
                setFormData({ ...formData, featuredImg: e.target.value })
              }
              className="w-full border rounded-lg px-3 py-2 mb-3"
            />
            {/* Image preview */}
            {formData.featuredImg && (
              <img
                src={formData.featuredImg}
                alt="Preview"
                className="w-full h-40 object-cover rounded-lg mb-3"
              />
            )}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
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

export default ArticlesPage;
