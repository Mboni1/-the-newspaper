import { useState } from "react";
import { Link } from "react-router-dom";
import BusinessDirectoryPage from "./BusinessDirectoryPage";
import {
  Search,
  Filter,
  Plane,
  Car,
  Bed,
  Wifi,
  CreditCard,
  Utensils,
  Ticket,
  ShoppingBag,
  MoreHorizontal,
} from "lucide-react";

const categories = [
  { id: "all", name: "All Categories", icon: Filter },
  { id: "travel", name: "Travel & Emergency", icon: Plane },
  { id: "transportation", name: "Transportation", icon: Car },
  { id: "accommodation", name: "Accommodation", icon: Bed },
  { id: "communication", name: "Communication", icon: Wifi },
  { id: "money", name: "Money & Payments", icon: CreditCard },
  { id: "food", name: "Food & Dining", icon: Utensils },
  { id: "events", name: "Events & Tours", icon: Ticket },
  { id: "shopping", name: "Shopping", icon: ShoppingBag },
];

export default function BusinessDirectory() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");

  return (
    <div className="p-6 pt-20 px-10 py-10 bg-gray-50 min-h-screen">
      <Link
        to="/dashboard"
        className="text-blue-600 hover:underline inline-block mb-4"
      >
        ← Back to Dashboard
      </Link>

      {/* Search Input */}
      <div className="relative mb-6">
        <Search className="absolute left-2 top-3 text-gray-400 w-5  h-5" />
        <input
          type="text"
          placeholder="Search businesses, locations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-xl pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <span className="text-gray-500 font-medium">Filter:</span>
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border transition 
                ${
                  activeCategory === cat.id
                    ? "bg-blue-100 text-gray-700 border-gray-300  hover:bg-blue-500 shadow"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
            >
              <Icon className="w-4 h-4" />
              <span className="whitespace-nowrap">{cat.name}</span>
            </button>
          );
        })}

        {/* More Button */}
        <button
          onClick={() => alert("Show more categories...")}
          className="flex items-center gap-2 px-4 py-2 rounded-full border bg-blue-100 text-gray-700 border-gray-300 hover:bg-blue-500 transition"
        >
          <MoreHorizontal className="w-4 h-4" />
          <span className="whitespace-nowrap">More</span>
        </button>
      </div>
      <BusinessDirectoryPage />
    </div>
  );
}
