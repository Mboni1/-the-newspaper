// src/pages/ArticlesPage.tsx
import React, { useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom"; // <-- import useNavigate

interface Article {
  id: number;
  title: string;
  author: string;
  date: string;
  image: string;
}

const ArticlesPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate(); // <-- initialize useNavigate

  const [articles, setArticles] = useState<Article[]>([
    {
      id: 1,
      title: "Best telecom to use in Southern Rwanda",
      author: "John Doe",
      date: "2025-08-20",
      image:
        "https://images.unsplash.com/photo-1524666041070-9d87656c25b7?w=300",
    },
    {
      id: 2,
      title: "Best Hotels in Karongi District",
      author: "John Doe",
      date: "2025-08-20",
      image:
        "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=300",
    },
    {
      id: 3,
      title: "What Is UMUGANDA and How Is It Done",
      author: "John Doe",
      date: "2025-08-20",
      image:
        "https://images.unsplash.com/photo-1508780709619-79562169bc64?w=300",
    },
  ]);

  const filteredArticles = articles.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase())
  );

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

        {/* + New button using useNavigate */}
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
          placeholder="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="ml-2 w-full outline-none text-gray-700"
        />
      </div>

      {/* Articles List */}
      <div className="space-y-4">
        {filteredArticles.map((article) => (
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
                <button className="text-blue-600 hover:underline">Edit</button>
                <button className="text-red-600 hover:underline">Delete</button>
              </div>
            </div>
            <img
              src={article.image}
              alt={article.title}
              className="w-24 h-20 object-cover rounded-xl"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArticlesPage;
