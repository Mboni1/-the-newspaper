// src/pages/BusinessDirectoryPage.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Building, MoreHorizontal, Search } from "lucide-react";

interface Business {
  id: number;
  name: string;
  address: string;
  category: string;
  placeImg: string[];
  coords: string[];
  icon?: React.ElementType;
}

// Corrected SearchFilterBar
interface SearchFilterBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
}

const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  searchTerm,
  setSearchTerm,
  category,
  setCategory,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full mb-6">
      {/* Search Input */}
      <div className="flex items-center w-full px-4 py-2 rounded-xl border border-gray-300 focus-within:ring-2 focus-within:ring-blue-500">
        <Search className="text-gray-400 w-5 h-5 mr-2" />
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 outline-none bg-transparent"
        />
      </div>

      {/* Dropdown Filter */}
      <div className="relative">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-2 rounded-xl border border-gray-300 outline-none cursor-pointer focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">All categories</option>
          <option value="Hotels">Hotels</option>
          <option value="Restaurants">Restaurants</option>
          <option value="Shops">Shops</option>
          <option value="Museums">Museums</option>
        </select>
      </div>
    </div>
  );
};

const BusinessDirectoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 3;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search / Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");

  const fetchBusinesses = async (page = 1) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "https://nearme-bn.onrender.com/category/adminfetchbuz/all",
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { page, limit },
        }
      );

      const mappedData: Business[] = (res.data.data || []).map((item: any) => ({
        id: item.id,
        name: item.title,
        address: item.location,
        category: item.subCategory?.name || "Uncategorized",
        placeImg: item.placeImg || [],
        coords: item.coords || [],
        icon: Building,
      }));

      setBusinesses(mappedData);
      setTotalPages(Math.ceil(res.data.total / limit) || 1);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching businesses:", err);
      setError("Failed to fetch businesses.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses(currentPage);
  }, [currentPage]);

  // Filtered businesses
  const filteredBusinesses = businesses.filter((b) => {
    const matchesCategory = category === "All" || b.category === category;
    const matchesSearch =
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.address.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div className="p-6 pt-20 px-10 py-10 bg-gray-50 min-h-screen">
      <Link
        to="/dashboard"
        className="text-blue-600 hover:underline inline-block mb-4"
      >
        ← Back to Dashboard
      </Link>

      {/* Header + New */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Business Directory</h1>
          <p className="text-gray-600">
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

      {/* Search / Filter Bar */}
      <SearchFilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        category={category}
        setCategory={setCategory}
      />

      {/* Loading/Error */}
      {loading && <p className="p-4">Loading businesses...</p>}
      {error && <p className="p-4 text-red-500">{error}</p>}

      {/* Business Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBusinesses.map((business) => {
          const Icon = business.icon || Building;
          return (
            <div
              key={business.id}
              className="bg-white rounded-2xl shadow hover:shadow-md transition overflow-hidden"
            >
              {business.placeImg.length > 0 && (
                <img
                  src={business.placeImg[0]}
                  alt={business.name}
                  className="w-full h-40 object-cover"
                />
              )}

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

      {/* Pagination */}
      <div className="flex justify-center mt-6 gap-4">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Prev.
        </button>
        <span className="px-4 py-2">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BusinessDirectoryPage;
