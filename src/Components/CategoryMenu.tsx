// src/components/CategoryMenu.tsx
import React, { useState } from "react";
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

interface CategoryMenuProps {
  categories: Category[];
  onSelectCategory: (value: string) => void;
}

const CategoryMenu: React.FC<CategoryMenuProps> = ({
  categories,
  onSelectCategory,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

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

  // Handle selection
  const handleSelect = (name: string) => {
    setSelectedCategory(name); // Update local selected state
    onSelectCategory(name); // Pass value to parent
    setIsOpen(false); // Close dropdown
  };

  return (
    <div className="relative w-full">
      {/* Dropdown Trigger */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center justify-between w-full px-4 py-2 border border-gray-300 rounded text-sm font-medium hover:bg-gray-100 transition"
      >
        {selectedCategory || "Select Category"}
        <ChevronDown
          className={`w-4 h-4 ml-2 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <ul className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg z-50">
          {categories.map((cat) => (
            <li
              key={cat.id}
              className="px-4 py-2 hover:bg-gray-100 flex justify-between items-center cursor-pointer relative"
              onMouseEnter={() => {
                setHoveredCategory(cat.name);
                fetchSubCategories(cat.name);
              }}
              onMouseLeave={() => setHoveredCategory(null)}
              onClick={() => handleSelect(cat.name)}
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
                      onClick={() => handleSelect(sub.name)}
                    >
                      {sub.name}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CategoryMenu;
