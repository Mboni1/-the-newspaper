// src/components/CategoryMenu.tsx
import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import api from "../lib/axios";

interface SubCategory {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
}

const CategoryMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  // Fetch categories (exclude isDoc)
  const fetchCategories = async () => {
    try {
      const res = await api.get("/category");
      const data = res.data.data || res.data;
      const filtered = data.filter((cat: any) => !cat.isDoc); // only non-doc categories
      setCategories(filtered);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  // Fetch subcategories on hover
  const fetchSubCategories = async (categoryName: string) => {
    try {
      const res = await api.get(`/category/${categoryName}`);
      const data = res.data.data || res.data;
      setSubCategories(data || []);
    } catch (err) {
      console.error("Failed to fetch subcategories:", err);
      setSubCategories([]);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="relative inline-block text-left">
      {/* Dropdown Trigger */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-left px-8 py-2.5 border border-gray-300 rounded text-sm font-medium hover:bg-gray-100 transition mt-7"
      >
        Categories
        <ChevronDown
          className={`w-4 h-4 ml-1 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 mt-2 w-68 bg-white border border-gray-300 rounded shadow-lg z-50">
          <ul className="divide-y divide-gray-200">
            {categories.map((cat) => (
              <li
                key={cat.id}
                className="px-4 py-2 hover:bg-gray-100 flex justify-between items-center cursor-pointer relative"
                onMouseEnter={() => {
                  setHoveredCategory(cat.name);
                  fetchSubCategories(cat.name);
                }}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                {cat.name}
                {subCategories.length > 0 && hoveredCategory === cat.name && (
                  <ChevronRight className="w-3 h-3" />
                )}

                {/* Subcategories Panel */}
                {hoveredCategory === cat.name && subCategories.length > 0 && (
                  <ul className="absolute top-0 left-full ml-1 w-40 bg-gray-50 border border-gray-200 rounded shadow-lg">
                    {subCategories.map((sub) => (
                      <li
                        key={sub.id}
                        className="px-3 py-1 hover:bg-gray-100 cursor-pointer text-sm"
                      >
                        {sub.name}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CategoryMenu;
