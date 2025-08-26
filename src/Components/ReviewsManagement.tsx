import React, { useState } from "react";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";

// --- Types
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
  status: "Published" | "Pending";
  statusColor: string;
};

// --- Dummy Data
const reviews: Review[] = [
  {
    id: 1,
    reviewer: "Sarah Johnson",
    initials: "SJ",
    rating: 5,
    date: "2024-01-15",
    business: "Kigali Serena Hotel",
    category: "Accommodation",
    categoryColor: "bg-blue-100 text-blue-700",
    title: "Exceptional service and beautiful location",
    content:
      "Had an amazing stay at this hotel. The staff was incredibly friendly and the rooms were spotless. The view from my room was breathtaking and the breakfast was delicious.",
    status: "Published",
    statusColor: "bg-green-100 text-green-700",
  },
  {
    id: 2,
    reviewer: "Mike Chen",
    initials: "MC",
    rating: 4,
    date: "2024-01-14",
    business: "Heaven Restaurant",
    category: "Food & Dining",
    categoryColor: "bg-orange-100 text-orange-700",
    title: "Great food, lovely atmosphere",
    content:
      "The food was excellent and the ambiance was perfect for a romantic dinner. Service was a bit slow but the quality made up for it.",
    status: "Published",
    statusColor: "bg-green-100 text-green-700",
  },
  {
    id: 3,
    reviewer: "Alex Rodriguez",
    initials: "AR",
    rating: 3,
    date: "2024-01-12",
    business: "MTN Rwanda Service Center",
    category: "Communication",
    categoryColor: "bg-purple-100 text-purple-700",
    title: "Average service, long wait times",
    content:
      "The staff was helpful but I had to wait for over an hour to get my SIM card issue resolved. The process could be more efficient.",
    status: "Pending",
    statusColor: "bg-yellow-100 text-yellow-700",
  },
  {
    id: 4,
    reviewer: "Emily Davis",
    initials: "ED",
    rating: 5,
    date: "2024-01-13",
    business: "Rwanda Eco Tours",
    category: "Events & Tours",
    categoryColor: "bg-green-100 text-green-700",
    title: "Unforgettable gorilla trekking experience",
    content:
      "This tour company provided an incredible experience. Our guide was knowledgeable and the entire trip was well organized. Highly recommend!",
    status: "Published",
    statusColor: "bg-green-100 text-green-700",
  },
  {
    id: 5,
    reviewer: "Lisa Wang",
    initials: "LW",
    rating: 5,
    date: "2024-01-11",
    business: "King Faisal Hospital",
    category: "Health & Wellness",
    categoryColor: "bg-pink-100 text-pink-700",
    title: "Professional medical care",
    content:
      "Excellent medical facility with modern equipment and professional staff. The doctors were thorough and caring.",
    status: "Published",
    statusColor: "bg-green-100 text-green-700",
  },
  {
    id: 6,
    reviewer: "John Smith",
    initials: "JS",
    rating: 2,
    date: "2024-01-10",
    business: "Kimironko Market",
    category: "Shopping",
    categoryColor: "bg-indigo-100 text-indigo-700",
    title: "Crowded and overpriced",
    content:
      "The market is very crowded and some vendors try to overcharge tourists. Need better organization and price regulation.",
    status: "Pending",
    statusColor: "bg-red-100 text-red-700",
  },
];

// --- Small Components
const ReviewCard: React.FC<{ review: Review }> = ({ review }) => (
  <div className="bg-white rounded-2xl shadow p-6">
    {/* User & Rating */}
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

    {/* Business */}
    <div className="mt-3">
      <h4 className="text-lg font-semibold text-gray-800">{review.business}</h4>
      <span
        className={`inline-block text-xs px-3 py-1 rounded-full ${review.categoryColor}`}
      >
        {review.category}
      </span>
    </div>

    {/* Title & Content */}
    <h5 className="mt-3 font-semibold text-gray-700">{review.title}</h5>
    <p className="text-gray-600 mt-1 text-sm">{review.content}</p>

    {/* Status */}
    <div className="mt-4">
      <span className={`px-3 py-1 text-sm rounded-full ${review.statusColor}`}>
        {review.status}
      </span>
    </div>
  </div>
);

// --- Main Component
export default function ReviewsManagement() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "All" | "Published" | "Pending"
  >("All");

  const filteredReviews = reviews.filter(
    (review) =>
      (statusFilter === "All" || review.status === statusFilter) &&
      (review.reviewer.toLowerCase().includes(search.toLowerCase()) ||
        review.business.toLowerCase().includes(search.toLowerCase()) ||
        review.content.toLowerCase().includes(search.toLowerCase()))
  );

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

      {/* Search + Filter */}
      <div className="flex items-center gap-4 mb-6 mt-4">
        <input
          type="text"
          placeholder="Search reviews by business, reviewer, or content..."
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
          <option value="Pending">Pending</option>
        </select>
      </div>

      {/* Reviews Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredReviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
}
