import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MoreHorizontal, Building, Search, ChevronDown } from "lucide-react";
import axios from "axios";

interface Business {
  id: number;
  name: string;
  address: string;
  category: string;
  image: string;
  icon: React.ElementType;
}

const categories = [
  "All Categories",
  "Transportation Services",
  "Accommodation Services",
  "Food & Dining",
  "Local Events & Tours",
];

const BusinessDirectoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 4;
  const [totalPages, setTotalPages] = useState(1);

  const fetchBusinesses = async (page: number) => {
    try {
      setLoading(true);
      const params: any = { limit, page };
      if (selectedCategory !== "All Categories")
        params.category = selectedCategory;
      if (search) params.search = search;

      const res = await axios.get(
        "https://nearme-bn.onrender.com/category/adminfetchbuz/all",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          params,
        }
      );

      setBusinesses(res.data.data || []);
      setTotalPages(Math.ceil(res.data.total / limit) || 1); // assuming backend returns total
      setLoading(false);
    } catch (err: any) {
      console.error(err);
      setError("Failed to load businesses.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, selectedCategory, search]);

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  if (loading) return <p className="p-6">Loading businesses...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="p-6 pt-20 px-10 py-10 bg-gray-50 min-h-screen">
      <Link
        to="/dashboard"
        className="text-blue-600 hover:underline inline-block mb-4"
      >
        ← Back to Dashboard
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Business Directory</h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Manage and organize all listed businesses in one place.
          </p>
        </div>
        <button
          onClick={() => navigate("/add-business")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow-md"
        >
          + New
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mb-8">
        <div className="flex items-center w-full px-3 py-4 rounded-xl bg-white shadow-sm">
          <Search className="w-5 h-5 text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search"
            className="w-full outline-none text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="relative w-full lg:w-1/2">
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1); // reset to page 1
            }}
            className="w-full px-3 py-4 rounded-xl shadow-sm bg-white text-sm appearance-none cursor-pointer"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-500 pointer-events-none" />
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {businesses.map((business) => {
          const Icon = business.icon || Building;
          return (
            <div
              key={business.id}
              className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden"
            >
              <img
                src={
                  business.image ||
                  "https://source.unsplash.com/400x300/?business"
                }
                alt={business.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">{business.name}</h2>
                    <p className="text-gray-500 text-sm">{business.address}</p>
                  </div>
                  <MoreHorizontal className="text-gray-400 w-5 h-5 cursor-pointer" />
                </div>
                <div className="flex items-center mt-3 text-blue-600 font-medium text-sm">
                  <Icon className="w-5 h-5 mr-2" />
                  {business.category}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Buttons */}
      <div className="flex justify-center mt-6 gap-4">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-600 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-blue-600 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BusinessDirectoryPage;
