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

interface CategoryMenuProps {
  selectedCategory?: string;
  selectedSubCategory?: string;
  onSelectCategory: (value: string) => void;
  onSelectSubCategory: (value: string) => void;
}

const CategoryMenu: React.FC<CategoryMenuProps> = ({
  selectedCategory = "",
  selectedSubCategory = "",
  onSelectCategory,
  onSelectSubCategory,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/category");
      const data = res.data.data || res.data;
      const filtered = data.filter((cat: any) => !cat.isDoc);
      setCategories(filtered);

      if (selectedCategory) fetchSubCategories(selectedCategory);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSubCategories = async (categoryName: string) => {
    try {
      const res = await api.get(`/category/${categoryName}`);
      const data = res.data.data || res.data;
      setSubCategories(data || []);
    } catch (err) {
      setSubCategories([]);
    }
  };

  // Ensure subCategories are loaded when selectedCategory changes
  useEffect(() => {
    if (selectedCategory) fetchSubCategories(selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="flex w-full space-x-2 items-center">
      {/* Category Dropdown */}
      <div className="relative w-2/3">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex items-center justify-between w-full px-3 py-2.5 border border-gray-300 rounded text-sm font-medium hover:bg-gray-100 transition"
        >
          {selectedCategory || "Select Category"}
          <ChevronDown
            className={`w-4 h-4 ml-2 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute left-0 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg z-50">
            <ul className="divide-y divide-gray-200">
              {categories.map((cat) => (
                <li
                  key={cat.id}
                  className="px-3 py-2.5 hover:bg-gray-100 flex justify-between items-center cursor-pointer relative"
                  onMouseEnter={() => {
                    setHoveredCategory(cat.name);
                    fetchSubCategories(cat.name);
                  }}
                  onMouseLeave={() => setHoveredCategory(null)}
                  onClick={() => {
                    onSelectCategory(cat.name);
                    onSelectSubCategory(""); // reset subCategory
                  }}
                >
                  {cat.name}
                  {subCategories.length > 0 && hoveredCategory === cat.name && (
                    <ChevronRight className="w-3 h-3" />
                  )}

                  {hoveredCategory === cat.name && subCategories.length > 0 && (
                    <ul className="absolute top-0 left-full ml-1 w-40 border border-gray-200 rounded shadow-lg bg-white">
                      {subCategories.map((sub) => (
                        <li
                          key={sub.id}
                          className="px-3 py-2.5 hover:bg-gray-100 cursor-pointer text-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectSubCategory(sub.name);
                            setIsOpen(false);
                          }}
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

      {/* SubCategory Input */}
      <input
        type="text"
        value={selectedSubCategory}
        readOnly
        placeholder="Select SubCategory"
        className="w-1/3 px-3 py-2.5 border border-gray-300 rounded focus:outline-none text-sm"
      />
    </div>
  );
};

export default CategoryMenu;
