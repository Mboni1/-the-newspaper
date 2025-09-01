import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  MoreHorizontal,
  Car,
  Utensils,
  Building,
  Camera,
  Search,
  ChevronDown,
} from "lucide-react";

interface Business {
  id: number;
  name: string;
  address: string;
  category: string;
  image: string;
  icon: React.ElementType;
}

const businesses: Business[] = [
  {
    id: 1,
    name: "Move Car Rental",
    address: "KG 9 Ave, Kigali",
    category: "Transportation Services",
    image: "https://source.unsplash.com/400x300/?car,rental",
    icon: Car,
  },
  {
    id: 2,
    name: "Kigali Bus service",
    address: "KG 9 Ave, Kigali",
    category: "Transportation Services",
    image: "https://source.unsplash.com/400x300/?bus,transport",
    icon: Car,
  },
  {
    id: 3,
    name: "Kigali Serena Hotel",
    address: "KG 9 Ave, Kigali",
    category: "Accommodation Services",
    image: "https://source.unsplash.com/400x300/?hotel,kigali",
    icon: Building,
  },
  {
    id: 4,
    name: "Heaven Restaurant",
    address: "KG 9 Ave, Kigali",
    category: "Food & Dining",
    image: "https://source.unsplash.com/400x300/?restaurant,food",
    icon: Utensils,
  },
  {
    id: 5,
    name: "Rwanda Eco Tours",
    address: "KG 9 Ave, Kigali",
    category: "Local Events & Tours",
    image: "https://source.unsplash.com/400x300/?tourism,rwanda",
    icon: Camera,
  },
  {
    id: 6,
    name: "Repub Lounge",
    address: "KG 9 Ave, Kigali",
    category: "Food & Dining",
    image: "https://source.unsplash.com/400x300/?dining,lounge",
    icon: Utensils,
  },
];

const categories = [
  "All Categories",
  "Transportation Services",
  "Accommodation Services",
  "Food & Dining",
  "Local Events & Tours",
];

const BusinessDirectory: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  // Filter logic
  const filteredBusinesses = businesses.filter((business) => {
    const matchesSearch =
      business.name.toLowerCase().includes(search.toLowerCase()) ||
      business.address.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "All Categories" ||
      business.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

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
        {/* Search bar */}
        <div className="flex items-center w-full  px-3 py-4 rounded-xl bg-white shadow-sm">
          <Search className="w-5 h-5 text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="search"
            className="w-full outline-none text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Category filter */}
        <div className="relative w-full lg:w-1/2 ">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-4  rounded-xl shadow-sm bg-white text-sm appearance-none cursor-pointer"
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
        {filteredBusinesses.map((business) => {
          const Icon = business.icon;
          return (
            <div
              key={business.id}
              className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden"
            >
              {/* Business Image */}
              <img
                src={business.image}
                alt={business.name}
                className="w-full h-40 object-cover"
              />

              {/* Business Info */}
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
    </div>
  );
};

export default BusinessDirectory;
