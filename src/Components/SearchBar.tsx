import React from "react";
import { Search } from "lucide-react";

const SearchBar: React.FC = () => {
  return (
    <div className="flex items-center w-1/3 relative">
      <Search className="absolute left-3 text-gray-400 w-5 h-5" />
      <input
        type="text"
        placeholder="Search..."
        className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export default SearchBar;
