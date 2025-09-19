import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../lib/axios";

type Review = {
  id: number;
  reviewer: string;
  initials: string;
  rating: number;
  date: string;
  business: string;
  category: string;
  categoryColor: string;
  title: string;
  content: string;
  status: "Published" | "Flagged";
  statusColor: string;
};

const ReviewCard: React.FC<{ review: Review }> = ({ review }) => (
  <div className="bg-white rounded-2xl shadow p-6">
    <div className="flex items-start justify-between">
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
          {review.initials}
        </div>
        <div className="ml-3">
          <h3 className="font-semibold text-gray-800">{review.reviewer}</h3>
          <div className="flex items-center text-sm text-gray-500">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={
                  i < review.rating
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }
              />
            ))}
            <span className="ml-2">{review.date}</span>
          </div>
        </div>
      </div>
      <button className="text-gray-400">⋯</button>
    </div>
    <div className="mt-3">
      <h4 className="text-lg font-semibold text-gray-800">{review.business}</h4>
      <span
        className={`inline-block text-xs px-3 py-1 rounded-full ${review.categoryColor}`}
      >
        {review.category}
      </span>
    </div>
    <h5 className="mt-3 font-semibold text-gray-700">{review.title}</h5>
    <p className="text-gray-600 mt-1 text-sm">{review.content}</p>
    <div className="mt-4">
      <span className={`px-3 py-1 text-sm rounded-full ${review.statusColor}`}>
        {review.status}
      </span>
    </div>
  </div>
);

export default function ReviewsManagement() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "All" | "Published" | "Pending"
  >("All");
  const [loading, setLoading] = useState(true);
  const [totalCategories, setTotalCategories] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const limit = 20; // limit

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const res = await api.get(
          `/review/admin/all?page=${page}&limit=${limit}`
        );

        const reviewsData = Array.isArray(res.data.data) ? res.data.data : [];
        const mapped: Review[] = reviewsData.map((item: any) => ({
          id: item.id,
          reviewer: item.reviewerName || "Anonymous",
          initials: (item.reviewerName || "A")
            .split(" ")
            .map((n: string) => n[0])
            .join("")
            .toUpperCase(),
          rating: item.rating,
          date: new Date(item.date).toLocaleDateString(),
          business: item.businessName || "Unknown Business",
          category: item.categoryName,
          categoryColor: "bg-blue-100 text-blue-700",
          title: item.title,
          content: item.comment,
          status:
            item.status?.toLowerCase() === "published"
              ? "Published"
              : "Flagged",
          statusColor:
            item.status?.toLowerCase() === "published"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700",
        }));

        setReviews(mapped);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || "Failed to fetch reviews");
        setLoading(false);
      }
    };

    fetchReviews();
  }, [page]);

  const totalPages = Math.ceil(totalCategories / limit);

  const handlePrev = () => page > 1 && setPage((prev) => prev - 1);
  const handleNext = () => page < totalPages && setPage((prev) => prev + 1);

  const filteredReviews = reviews.filter(
    (review) =>
      (statusFilter === "All" || review.status === statusFilter) &&
      (review.reviewer.toLowerCase().includes(search.toLowerCase()) ||
        review.business.toLowerCase().includes(search.toLowerCase()) ||
        review.content.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) return <p className="p-8">Loading reviews...</p>;
  if (error) return <p className="p-8 text-red-500">{error}</p>;

  return (
    <div className="p-6 pt-20 px-10 py-10 bg-gray-50 min-h-screen">
      <Link
        to="/dashboard"
        className="text-blue-600 hover:underline inline-block mb-4"
      >
        ← Back to Dashboard
      </Link>
      <h1 className="text-2xl font-semibold mt-2">Reviews Management</h1>
      <p className="text-gray-500">
        Monitor and manage user reviews across all business listings
      </p>

      <div className="flex items-center gap-4 mb-6 mt-4">
        <input
          type="text"
          placeholder="Search by reviewer, business, or content..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="px-4 py-2 border border-gray-200 rounded-xl bg-white"
        >
          <option value="All">All Status</option>
          <option value="Published">Published</option>
          <option value="Pending">Flagged</option>
        </select>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {filteredReviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 gap-4">
        <button
          onClick={handlePrev}
          disabled={page === 1}
          className="px-4 py-2 bg-blue-600 text-black rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-4 py-2">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={page === totalPages}
          className="px-4 py-2 bg-blue-600 text-black rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
