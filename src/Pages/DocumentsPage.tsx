import { useState } from "react";
import { Link } from "react-router-dom";

type Article = {
  id: number;
  title: string;
  author: string;
  date: string;
  image?: string;
};

const articles: Article[] = [
  {
    id: 1,
    title: "Best telecom to use in Southern Rwanda",
    author: "John Doe",
    date: "2025-08-20",
    image: "https://source.unsplash.com/100x100/?technology",
  },
  {
    id: 2,
    title: "Best Hotels in Karongi District",
    author: "John Doe",
    date: "2025-08-20",
    image: "https://source.unsplash.com/100x100/?hotel",
  },
  {
    id: 3,
    title: "What Is UMUGANDA and How Is It Done",
    author: "John Doe",
    date: "2025-08-20",
    image: "https://source.unsplash.com/100x100/?community",
  },
  {
    id: 4,
    title: "How To Renew Your Resident Permit In Rwanda",
    author: "John Doe",
    date: "2025-08-20",
    image: "https://source.unsplash.com/100x100/?document",
  },
  {
    id: 5,
    title: "How To Get A Rwandan Visa",
    author: "John Doe",
    date: "2025-08-20",
    image: "https://source.unsplash.com/100x100/?passport",
  },
];

export default function DocumentsPage() {
  const [search, setSearch] = useState("");

  // Correct filtering
  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 pt-20 px-6 py-6 bg-gray-50 max-w-3xl mx-auto">
      <Link
        to="/dashboard"
        className="text-blue-600 hover:underline inline-block mb-4"
      >
        ← Back to Dashboard
      </Link>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search Articles"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-4 py-2 border border-gray-200 rounded-xl mb-6 focus:ring-2 focus:ring-blue-400 outline-none"
      />

      {/* Articles List */}
      <div className="space-y-4 mb-10">
        {filteredArticles.map((article) => (
          <div
            key={article.id}
            className="flex items-center justify-between bg-white rounded-xl shadow-sm hover:shadow-md transition p-4"
          >
            {/* Left side: Title + Author + Date */}
            <div>
              <h2 className="text-blue-600 font-medium hover:underline cursor-pointer">
                {article.title}
              </h2>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                {/* Avatar initials */}
                <div className="w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold mr-2">
                  {article.author
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <span className="mr-2">{article.author}</span>
                <span>{article.date}</span>
              </div>
            </div>

            {/* Right side: Thumbnail */}
            {article.image && (
              <img
                src={article.image}
                alt={article.title}
                className="w-16 h-16 rounded-lg object-cover ml-4"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
