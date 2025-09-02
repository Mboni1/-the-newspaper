// src/pages/ArticlesPage.tsx
import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Article {
  id: number;
  title: string;
  author: string;
  date: string;
  image: string;
}

const ArticlesPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const limit = 3; // articles per page
  const navigate = useNavigate();

  // Fetch articles from backend
  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "https://nearme-bn.onrender.com/category/adminfetchdocs/all",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const fetchedArticles = Array.isArray(res.data.data)
        ? res.data.data.map((item: any) => ({
            id: item.id,
            title: item.title,
            author: item.authorName || "Admin",
            date: item.date || item.createdAt || new Date().toISOString(),
            image: item.imageUrl || "https://via.placeholder.com/150",
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

  // Filtered by search
  const filteredArticles = articles.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredArticles.length / limit);
  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * limit,
    currentPage * limit
  );

  // Handlers for Prev/Next buttons
  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  if (loading) return <p className="p-8">Loading articles...</p>;
  if (error) return <p className="p-8 text-red-500">{error}</p>;

  return (
    <div className="p-6 pt-20 bg-gray-50 min-h-screen">
      {/* Back link */}
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
          onClick={() => navigate("/add-article")}
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
          onChange={(e) => setSearch(e.target.value)}
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
                  <button className="text-blue-600 hover:underline">
                    Edit
                  </button>
                  <button className="text-red-600 hover:underline">
                    Delete
                  </button>
                </div>
              </div>
              <img
                src={article.image}
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
    </div>
  );
};

export default ArticlesPage;
