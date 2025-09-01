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
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("https://nearme-bn.onrender.com/category", {
          //`${process.env.base_url}/category`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        console.log("Fetched data:", data);

        if (Array.isArray(data)) {
          setCategories(data);
        } else if (Array.isArray(data.data)) {
          setCategories(data.data);
        } else if (Array.isArray(data.categories)) {
          setCategories(data.categories);
        } else {
          console.error("Unexpected API response format", data);
          setCategories([]);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

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
        <div className="flex items-center flex-1  rounded-lg px-3 py-2">
          <Search className="text-gray-400 w-5 h-5 mr-2" />
          <input
            type="text"
            placeholder="Search Category"
            className="flex-1 outline-none"
          />
        </div>
      </div>{" "}
      {/* <-- closes search wrapper correctly */}
      {/* Categories Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => {
          const Icon = iconMap[category.icon] || MoreHorizontal;
          return (
            <div
              key={category.id}
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
              <Link
                to={category.link}
                className="text-blue-600 text-sm font-semibold hover:underline"
              >
                EXPLORE CATEGORY →
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ServiceCategories;
