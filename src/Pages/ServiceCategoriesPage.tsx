import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Search,
  Plane,
  Bus,
  Bed,
  Wifi,
  CreditCard,
  Heart,
  Utensils,
  Map,
  ShoppingBag,
  MoreHorizontal,
} from "lucide-react";

// Map string names from API -> Lucide icons
const iconMap: Record<string, React.ElementType> = {
  Plane,
  Bus,
  Bed,
  Wifi,
  CreditCard,
  Heart,
  Utensils,
  Map,
  ShoppingBag,
  MoreHorizontal,
};

interface Category {
  id: number;
  name: string;
  services: number;
  description: string;
  icon: string;
  link: string;
}

const ServiceCategories: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalCategories, setTotalCategories] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);

  const limit = 9;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://nearme-bn.onrender.com/category?page=${page}&limit=${limit}&search=${searchTerm}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const responseData = await res.json();
        console.log(
          "Fetched categories:",
          JSON.stringify(responseData, null, 2)
        );

        if (Array.isArray(responseData.data)) {
          setCategories(responseData.data);
          setTotalCategories(responseData.total || responseData.data.length);
        } else {
          setCategories([]);
          setTotalCategories(0);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [page, searchTerm]);

  const totalPages = Math.ceil(totalCategories / limit);

  const handlePrev = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  if (loading) return <p className="p-8">Loading categories...</p>;
  if (categories.length === 0) {
    return <p className="p-8 text-red-500">No categories found.</p>;
  }

  return (
    <div className="p-6 pt-20 px-10 py-10 bg-gray-50 min-h-screen">
      <Link
        to="/dashboard"
        className="text-blue-600 hover:underline inline-block mb-4"
      >
        ← Back to Dashboard
      </Link>

      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Service Categories</h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Explore our comprehensive range of services organized by category to
            help you find exactly what you need.
          </p>
        </div>

        <button
          onClick={() => navigate("/add-category")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow-md"
        >
          + New
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-1.5 rounded-xl shadow mb-8">
        <div className="flex items-center flex-1 rounded-lg px-3 py-2">
          <Search className="text-gray-400 w-5 h-5 mr-2" />
          <input
            type="text"
            placeholder="Search Category"
            value={searchTerm}
            onChange={(e) => {
              setPage(1); // reset page kuri 1 igihe ushakisha
              setSearchTerm(e.target.value);
            }}
            className="flex-1 outline-none"
          />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => {
          const Icon = iconMap[category.icon] || MoreHorizontal;
          return (
            <div
              key={category.name}
              className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition"
            >
              <div className="flex items-center gap-3 mb-3">
                <Icon className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold">{category.name}</h2>
              </div>
              <p className="text-sm text-blue-600 font-medium mb-2">
                {category.services} services
              </p>
              <p className="text-gray-600 text-sm mb-4">
                {category.description}
              </p>
              <button
                onClick={() => navigate(`/category/${category.name}`)}
                className="text-blue-600 text-sm font-semibold hover:underline"
              >
                EXPLORE CATEGORY →
              </button>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 gap-4">
        <button
          onClick={handlePrev}
          disabled={page === 1}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-4 py-2">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={page === totalPages}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ServiceCategories;
